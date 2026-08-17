import { access, readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const docs = resolve(here, "../docs");
const release = JSON.parse(await readFile(resolve(here, "release.json"), "utf8"));
const support = JSON.parse(await readFile(resolve(here, "support.json"), "utf8"));

function crc16Ccitt(texto) {
  let crc = 0xffff;
  for (const byte of Buffer.from(texto, "utf8")) {
    crc ^= byte << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

async function sha256(caminho) {
  return createHash("sha256").update(await readFile(caminho)).digest("hex");
}

async function arquivos(dir) {
  const saida = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const caminho = resolve(dir, item.name);
    if (item.isDirectory()) saida.push(...await arquivos(caminho));
    else saida.push(caminho);
  }
  return saida;
}

const htmls = (await arquivos(docs)).filter((arquivo) => arquivo.endsWith(".html"));
if (htmls.length !== 15) throw new Error(`Esperava 15 HTMLs incluindo 404; encontrei ${htmls.length}.`);

for (const arquivo of htmls) {
  const html = await readFile(arquivo, "utf8");
  if (!html.includes("<html lang=")) throw new Error(`Idioma ausente em ${arquivo}`);
  if (!html.includes("dotchi.app@gmail.com")) throw new Error(`Contato ausente em ${arquivo}`);
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (/^(https?:|mailto:|#)/.test(href)) continue;
    const semAncora = href.split("#")[0];
    const destino = resolve(dirname(arquivo), semAncora);
    await access(semAncora.endsWith("/") ? resolve(destino, "index.html") : destino);
  }
}

if (!support.pix.payload.startsWith("000201") || !support.pix.payload.includes("BR.GOV.BCB.PIX")) {
  throw new Error("Payload Pix não parece seguir o padrão BR Code.");
}
if (!support.pix.payload.includes(support.pix.key)) {
  throw new Error("A chave Pix não está contida no payload publicado.");
}
if (crc16Ccitt(support.pix.payload.slice(0, -4)) !== support.pix.payload.slice(-4)) {
  throw new Error("Checksum CRC16 do payload Pix é inválido.");
}

const paypal = new URL(support.paypal.url);
if (paypal.protocol !== "https:" || paypal.hostname !== "www.paypal.com" || !paypal.pathname.startsWith("/qrcodes/p2pqrc/")) {
  throw new Error("O endereço PayPal não é o destino público oficial esperado.");
}

for (const canal of [support.pix, support.paypal]) {
  const fonte = resolve(here, "assets", canal.qrAsset);
  const gerado = resolve(docs, "assets", canal.qrAsset);
  if (await sha256(fonte) !== canal.qrSha256 || await sha256(gerado) !== canal.qrSha256) {
    throw new Error(`QR Code ${canal.qrAsset} divergiu do arquivo validado.`);
  }
}

const supportPages = [resolve(docs, "support/index.html"), resolve(docs, "pt-br/support/index.html")];
for (const arquivo of supportPages) {
  const html = await readFile(arquivo, "utf8");
  for (const valor of [support.pix.key, support.pix.payload, support.pix.recipient, support.paypal.url, support.pix.qrAsset, support.paypal.qrAsset]) {
    if (!html.includes(valor)) throw new Error(`Canal de apoio incompleto em ${arquivo}: ${valor}`);
  }
  if (!html.includes('target="_blank" rel="noopener noreferrer"')) {
    throw new Error(`Link externo do PayPal sem isolamento em ${arquivo}`);
  }
  if (/coming soon|em preparação|pix indisponível|paypal indisponível/i.test(html)) {
    throw new Error(`Estado inativo antigo ainda aparece em ${arquivo}`);
  }
}

for (const arquivo of htmls.filter((arquivo) => !supportPages.includes(arquivo))) {
  const html = await readFile(arquivo, "utf8");
  for (const valor of [support.pix.key, support.pix.payload, support.paypal.url]) {
    if (html.includes(valor)) throw new Error(`Dado de pagamento saiu da página de apoio em ${arquivo}`);
  }
}

for (const rota of ["download", "pt-br/download"]) {
  const html = await readFile(resolve(docs, rota, "index.html"), "utf8");
  for (const valor of [release.version, release.minimumSystem, release.file, release.size, release.sha256, release.downloadUrl, release.itchUrl]) {
    if (!html.includes(valor)) throw new Error(`${rota} divergiu de release.json em ${valor}`);
  }
}

console.log(`Site íntegro: ${htmls.length} HTMLs, links locais válidos, release ${release.version} e apoio Pix/PayPal consistentes.`);
