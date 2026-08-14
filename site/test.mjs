import { access, readFile, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const docs = resolve(here, "../docs");
const release = JSON.parse(await readFile(resolve(here, "release.json"), "utf8"));

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
  if (/pix copia e cola|paypal\.me|qr code[^<]{0,20}[A-Za-z0-9]{20}/i.test(html)) {
    throw new Error(`Dado financeiro parece ter vazado em ${arquivo}`);
  }
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (/^(https?:|mailto:|#)/.test(href)) continue;
    const semAncora = href.split("#")[0];
    const destino = resolve(dirname(arquivo), semAncora);
    await access(semAncora.endsWith("/") ? resolve(destino, "index.html") : destino);
  }
}

for (const rota of ["download", "pt-br/download"]) {
  const html = await readFile(resolve(docs, rota, "index.html"), "utf8");
  for (const valor of [release.version, release.file, release.size, release.sha256, release.downloadUrl]) {
    if (!html.includes(valor)) throw new Error(`${rota} divergiu de release.json em ${valor}`);
  }
}

console.log(`Site íntegro: ${htmls.length} HTMLs, links locais válidos e release ${release.version} consistente.`);
