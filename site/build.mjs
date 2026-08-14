import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../docs");
const release = JSON.parse(await readFile(resolve(here, "release.json"), "utf8"));

const locales = {
  en: {
    lang: "en",
    base: "",
    switchHref: "pt-br/",
    switchLabel: "Português",
    nav: [
      ["download/", "Download"], ["#workflow", "How it works"], ["help/", "Help"], ["support/", "Support Dotchi"]
    ],
    footer: [["privacy/", "Privacy"], ["terms/", "Terms"], ["help/", "Help"], ["changelog/", "Changelog"], ["support/", "Support Dotchi"]],
    menu: "Menu",
    skip: "Skip to content",
  },
  pt: {
    lang: "pt-BR",
    base: "pt-br/",
    switchHref: "../",
    switchLabel: "English",
    nav: [
      ["download/", "Baixar"], ["#como-funciona", "Como funciona"], ["help/", "Ajuda"], ["support/", "Apoie o Dotchi"]
    ],
    footer: [["privacy/", "Privacidade"], ["terms/", "Termos"], ["help/", "Ajuda"], ["changelog/", "Novidades"], ["support/", "Apoie o Dotchi"]],
    menu: "Menu",
    skip: "Pular para o conteúdo",
  },
};

const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
function layout(localeKey, route, { title, description, body }) {
  const l = locales[localeKey];
  const localPrefix = route ? "../" : "";
  const assetPrefix = `${localeKey === "pt" ? "../" : ""}${localPrefix}`;
  const rootHref = localPrefix || "./";
  const navHref = (href) => href.startsWith("#") ? `${rootHref}${href}` : `${localPrefix}${href}`;
  const switchHref = localeKey === "en"
    ? `${localPrefix}pt-br/`
    : route ? `../../${route ? route + "/" : ""}` : "../";
  return `<!doctype html>
<html lang="${l.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#100e18">
  <meta name="description" content="${esc(description)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="website">
  <title>${esc(title)}</title>
  <link rel="icon" href="${assetPrefix}assets/dotchi-logo.png">
  <link rel="stylesheet" href="${assetPrefix}assets/styles.css">
</head>
<body>
  <a class="skip" href="#main">${l.skip}</a>
  <header class="site-header">
    <div class="shell nav-row">
      <a class="wordmark" href="${rootHref}" aria-label="Dotchi">
        <img src="${assetPrefix}assets/dotchi-logo.png" alt="" width="38" height="40"><span>Dotchi</span>
      </a>
      <button class="menu-trigger" type="button" data-menu-trigger aria-expanded="false">${l.menu}</button>
      <nav class="nav-links" data-nav aria-label="${localeKey === "pt" ? "Navegação principal" : "Main navigation"}">
        ${l.nav.map(([href,label]) => `<a href="${navHref(href)}">${label}</a>`).join("\n        ")}
        <a class="language" hreflang="${localeKey === "en" ? "pt-BR" : "en"}" href="${switchHref}">${l.switchLabel}</a>
      </nav>
    </div>
  </header>
  <main id="main">${body}</main>
  <footer class="site-footer">
    <div class="shell footer-row">
      <span>© 2026 Dotchi</span>
      <div class="footer-links">${l.footer.map(([href,label]) => `<a href="${localPrefix}${href}">${label}</a>`).join("")}</div>
      <a href="mailto:dotchi.app@gmail.com">dotchi.app@gmail.com</a>
    </div>
  </footer>
  <script src="${assetPrefix}assets/site.js" defer></script>
</body>
</html>`;
}

const card = (icon, title, text) => `<article class="card"><span class="icon" aria-hidden="true">${icon}</span><h3>${title}</h3><p>${text}</p></article>`;

function home(localeKey) {
  const pt = localeKey === "pt";
  const body = pt ? `
  <section class="shell hero">
    <div><p class="eyebrow">Editor de pixel art local-first</p><h1>Transforme imagens em pixel art de verdade.</h1>
    <p class="lead">Converta, edite, anime e exporte sprites — com processamento local, controle de paleta e ferramentas feitas para fluxos de jogos.</p>
    <div class="actions"><a class="button primary" href="download/">Baixar para macOS</a><a class="button" href="#resultado">Ver em ação</a></div>
    <div class="trust-line"><span>Sem conta</span><span>Processamento local</span><span>Download notarizado</span></div></div>
    <div class="hero-visual"><div class="pixel-grid"></div><figure class="product-card"><img src="../assets/resultado-dotchi.png" alt="Uma criatura convertida em pixel art pelo Dotchi, exibida em tamanho ampliado"><figcaption class="product-caption"><span>Resultado real</span><span>1× e ampliado</span></figcaption></figure></div>
  </section>
  <section class="section" id="resultado"><div class="shell split"><div class="section-head"><p class="eyebrow">Pixel art, não só pixels maiores</p><h2>Um resultado que você ainda controla.</h2><p>O Dotchi parte da imagem em resolução cheia, constrói a grade e mantém o resultado editável. Paleta, camadas, frames e acabamento continuam nas suas mãos.</p></div><div class="proof card"><img src="../assets/resultado-dotchi-6x.png" alt="Pixel art real ampliada seis vezes sem suavização"></div></div></section>
  <section class="section" id="como-funciona"><div class="shell"><div class="section-head"><p class="eyebrow">Fluxo direto</p><h2>Da referência ao sprite em três passos.</h2></div><div class="grid-3 flow">${card("↥","Importe","Abra uma imagem ou adote um sprite que já é pixel art.")}${card("▦","Edite","Ajuste grade, cores, camadas, frames e retoques no mesmo editor.")}${card("→","Exporte","Gere PNGs, animações, spritesheets e saídas para seu projeto de jogo.")}</div></div></section>
  <section class="section"><div class="shell"><div class="section-head"><p class="eyebrow">Feito para jogos</p><h2>Sprites, animações, tiles e entregáveis prontos.</h2><p>Organize documentos por projeto, compare resultados e exporte sem perder o vínculo com a fonte.</p></div><div class="grid-3">${card("◎","Animação","Frames, duração, mesa de luz e GIF com tempo preservado.")}${card("#","Paletas","Controle de cores, harmonização, limpeza e acabamento de contorno.")}${card("◇","Fluxo local","QuickLook, integração MCP restrita e IA textual opcional no dispositivo.")}</div></div></section>
  <section class="section"><div class="shell split"><article class="card local"><p class="eyebrow">Local-first</p><h2>Seus arquivos continuam seus.</h2><p>O Dotchi não exige conta, não contém telemetria e não envia imagens ou projetos para APIs externas. Você escolhe onde cada projeto e exportação ficam.</p><a class="button" href="privacy/">Ler a política de privacidade</a></article><article class="card"><p class="eyebrow">Distribuição confiável</p><h2>Assinado e notarizado.</h2><p>O DMG oficial é assinado com Developer ID, notarizado pela Apple e publicado com SHA-256 para conferência.</p><a class="button primary" href="download/">Ver download e integridade</a></article></div></section>` : `
  <section class="shell hero">
    <div><p class="eyebrow">A local-first pixel art editor</p><h1>Turn images into real pixel art.</h1>
    <p class="lead">Convert, edit, animate, and export sprites—with local processing, palette control, and tools built for game workflows.</p>
    <div class="actions"><a class="button primary" href="download/">Download for macOS</a><a class="button" href="#result">See it in action</a></div>
    <div class="trust-line"><span>No account</span><span>Local processing</span><span>Notarized download</span></div></div>
    <div class="hero-visual"><div class="pixel-grid"></div><figure class="product-card"><img src="assets/resultado-dotchi.png" alt="A creature converted into pixel art by Dotchi, shown enlarged"><figcaption class="product-caption"><span>Real result</span><span>1× and enlarged</span></figcaption></figure></div>
  </section>
  <section class="section" id="result"><div class="shell split"><div class="section-head"><p class="eyebrow">Pixel art, not just bigger pixels</p><h2>A result you can still control.</h2><p>Dotchi starts from the full-resolution image, builds the grid, and keeps the result editable. Palette, layers, frames, and finishing remain in your hands.</p></div><div class="proof card"><img src="assets/resultado-dotchi-6x.png" alt="Real pixel art enlarged six times without smoothing"></div></div></section>
  <section class="section" id="workflow"><div class="shell"><div class="section-head"><p class="eyebrow">A direct workflow</p><h2>From reference to sprite in three steps.</h2></div><div class="grid-3 flow">${card("↥","Import","Open an image or adopt a sprite that is already pixel art.")}${card("▦","Edit","Tune the grid, colors, layers, frames, and retouching in one editor.")}${card("→","Export","Create PNGs, animations, spritesheets, and game-ready outputs.")}</div></div></section>
  <section class="section"><div class="shell"><div class="section-head"><p class="eyebrow">Built for games</p><h2>Sprites, animation, tiles, and practical outputs.</h2><p>Organize documents by project, compare results, and export without losing the link to the source.</p></div><div class="grid-3">${card("◎","Animation","Frames, timing, onion skin, and GIF export with preserved duration.")}${card("#","Palettes","Color control, harmonization, cleanup, and outline finishing.")}${card("◇","Local workflow","QuickLook, restricted MCP integration, and optional on-device text AI.")}</div></div></section>
  <section class="section"><div class="shell split"><article class="card local"><p class="eyebrow">Local-first</p><h2>Your files remain yours.</h2><p>Dotchi requires no account, contains no telemetry, and sends no images or projects to external APIs. You choose where every project and export lives.</p><a class="button" href="privacy/">Read the privacy policy</a></article><article class="card"><p class="eyebrow">Trusted distribution</p><h2>Signed and notarized.</h2><p>The official DMG is signed with Developer ID, notarized by Apple, and published with its SHA-256 checksum.</p><a class="button primary" href="download/">View download and integrity</a></article></div></section>`;
  return layout(localeKey, "", {
    title: pt ? "Dotchi — Pixel art de verdade" : "Dotchi — Real pixel art",
    description: pt ? "Converta, edite, anime e exporte sprites com processamento local." : "Convert, edit, animate, and export sprites with local processing.", body
  });
}

function page(localeKey, route, title, description, content) {
  return layout(localeKey, route, { title: `${title} — Dotchi`, description, body: `<div class="shell"><header class="page-hero"><p class="eyebrow">Dotchi</p><h1>${title}</h1><p>${description}</p></header><article class="prose">${content}</article></div>` });
}

function releaseBox(pt) {
  const labels = pt ? ["Versão","Sistema","Arquitetura","Arquivo","Tamanho","SHA-256"] : ["Version","System","Architecture","File","Size","SHA-256"];
  const values = [release.version, release.platform, release.architecture, release.file, release.size, release.sha256];
  return `<dl class="release-box">${labels.map((label,i) => `<div class="release-row"><dt>${label}</dt><dd>${esc(values[i])}${label === "SHA-256" ? `<button class="copy" type="button" data-copy="${release.sha256}">${pt ? "Copiar" : "Copy"}</button>` : ""}</dd></div>`).join("")}</dl>`;
}

const pages = {
  en: {
    download: ["Download", "Get the current Apple Silicon build and verify its integrity.", `${releaseBox(false)}<div class="actions"><a class="button primary" href="${release.downloadUrl}">Download ${release.file}</a><a class="button" href="${release.releaseUrl}">View release</a></div><h2>Install</h2><ol><li>Download the DMG.</li><li>Compare its SHA-256 checksum with the value above.</li><li>Open the DMG and drag Dotchi to Applications.</li><li>Eject the image and open Dotchi from Applications.</li></ol><p class="notice">Dotchi is currently distributed for Apple Silicon. The minimum macOS version will be declared with the release candidate. Do not bypass Gatekeeper if installation fails; use the help page instead.</p>`],
    privacy: ["Privacy", "How Dotchi handles your files and the few network connections around distribution.", `<h2>Local processing</h2><p>Dotchi requires no account, contains no telemetry or advertising, and does not send images or projects to external APIs. Preferences, projects, and exports remain on your device or in locations you choose.</p><h2>Optional local AI</h2><p>The optional text assistant uses a Qwen model downloaded once with integrity verification and then run on your device. It does not generate images.</p><h2>External services</h2><p>GitHub serves this website and application downloads. Those services may keep technical access records such as IP address and time. Dotchi does not receive those logs. Optional support payments are not active yet; this page will be updated before they become available.</p><h2>Contact</h2><p>Privacy questions: <a href="mailto:dotchi.app@gmail.com">dotchi.app@gmail.com</a>. Do not attach private projects or images unless they are necessary and safe to share.</p>`],
    terms: ["Terms", "The license for the distributed Dotchi binary.", `<p>Copyright © 2026 Luan Martins. All rights reserved.</p><p>Dotchi is proprietary software. Downloading grants a personal, non-exclusive, non-transferable license to install and use the binary published in this repository.</p><p>Without prior written permission, the license does not allow redistribution, modification, sublicensing, sale, commercial exploitation, reverse engineering, or creation of derivative works, except where a restriction cannot legally apply.</p><p>The source code, internal documentation, and <code>.dotchi</code> file format remain the author's property. The software is provided as-is, without express or implied warranties, to the extent permitted by law.</p>`],
    help: ["Help", "Installation help, feedback, and safe ways to ask for support.", `<h2>Installation</h2><p>Verify the DMG checksum, install Dotchi in Applications, and open it normally. Do not disable Gatekeeper or remove quarantine attributes.</p><h2 id="feedback">Send feedback</h2><p>Email <a href="mailto:dotchi.app@gmail.com?subject=Dotchi%20feedback">dotchi.app@gmail.com</a> or open a public <a href="https://github.com/itsmeluan/dotchi-releases/issues/new">GitHub issue</a>. Include the Dotchi version, macOS version, steps to reproduce, expected result, and what happened.</p><p class="notice">Never publish passwords, 2FA codes, recovery keys, private keys, certificates, confidential projects, or images that cannot be public.</p><h2>Download problems</h2><p>Include the exact error message and the SHA-256 you calculated. Dotchi has no automatic updater in this version.</p>`],
    changelog: ["Changelog", "What changed in each public Dotchi build.", `<h2>Version ${release.version}</h2><p>First public Apple Silicon distribution.</p><ul><li>Deterministic image-to-pixel-art conversion.</li><li>Sprite editor with layers, frames, palettes, and finishing tools.</li><li>PNG, animation, tile, and game workflow exports.</li><li>QuickLook for <code>.dotchi</code> documents.</li><li>Optional local Qwen text AI.</li><li>Restricted local MCP integration.</li></ul><p>The DMG is signed, notarized, stapled, and published with its SHA-256 checksum.</p>`],
    support: ["Support Dotchi", "Dotchi is free and complete. Optional support will help sustain its development.", `<p>Support is voluntary and does not unlock features, priority, influence, or a different edition. The payment channels below remain deliberately inactive until the public recipient details and accounting guidance are confirmed.</p><div class="support-grid"><article class="card placeholder"><span class="status">Coming soon</span><h2>Brazil — Pix</h2><p>A random Pix key and public recipient name will appear here only after final confirmation.</p><span class="button" aria-disabled="true">Pix unavailable</span></article><article class="card placeholder"><span class="status">Coming soon</span><h2>International — PayPal</h2><p>The official PayPal Business payment link will appear here only after final confirmation.</p><span class="button" aria-disabled="true">PayPal unavailable</span></article></div><p class="notice">There is no active payment link, Pix key, QR code, or recipient identity on this site today. If someone presents one as official, do not pay.</p>`],
  },
  pt: {
    download: ["Baixar", "Obtenha a versão atual para Apple Silicon e confira sua integridade.", `${releaseBox(true)}<div class="actions"><a class="button primary" href="${release.downloadUrl}">Baixar ${release.file}</a><a class="button" href="${release.releaseUrl}">Ver Release</a></div><h2>Instalar</h2><ol><li>Baixe o DMG.</li><li>Compare o SHA-256 com o valor acima.</li><li>Abra o DMG e arraste o Dotchi para Aplicativos.</li><li>Ejete a imagem e abra o Dotchi pela pasta Aplicativos.</li></ol><p class="notice">O Dotchi é distribuído hoje para Apple Silicon. A versão mínima do macOS será declarada no release candidate. Não contorne o Gatekeeper se a instalação falhar; use a página de ajuda.</p>`],
    privacy: ["Privacidade", "Como o Dotchi trata seus arquivos e as poucas conexões ligadas à distribuição.", `<h2>Processamento local</h2><p>O Dotchi não exige conta, não contém telemetria ou publicidade e não envia imagens ou projetos para APIs externas. Preferências, projetos e exportações permanecem no dispositivo ou nos locais que você escolher.</p><h2>IA local opcional</h2><p>O assistente textual opcional usa um modelo Qwen baixado uma vez com integridade verificada e depois executado no dispositivo. Ele não gera imagens.</p><h2>Serviços externos</h2><p>O GitHub serve este site e os downloads. Esses serviços podem manter registros técnicos de acesso, como endereço IP e horário. O Dotchi não recebe esses registros. Pagamentos opcionais de apoio ainda não estão ativos; esta página será atualizada antes de sua disponibilização.</p><h2>Contato</h2><p>Dúvidas de privacidade: <a href="mailto:dotchi.app@gmail.com">dotchi.app@gmail.com</a>. Não anexe projetos ou imagens privadas sem necessidade.</p>`],
    terms: ["Termos", "A licença do binário distribuído do Dotchi.", `<p>Copyright © 2026 Luan Martins. Todos os direitos reservados.</p><p>O Dotchi é software proprietário. O download concede licença pessoal, não exclusiva e intransferível para instalar e usar o binário publicado neste repositório.</p><p>Sem autorização prévia e expressa, a licença não permite redistribuir, modificar, sublicenciar, vender, explorar comercialmente, fazer engenharia reversa ou criar trabalhos derivados, salvo onde uma restrição não puder ser aplicada por lei.</p><p>O código-fonte, a documentação interna e o formato <code>.dotchi</code> permanecem propriedade do autor. O software é fornecido no estado em que se encontra, sem garantias expressas ou implícitas, dentro dos limites legais.</p>`],
    help: ["Ajuda", "Instalação, feedback e formas seguras de pedir suporte.", `<h2>Instalação</h2><p>Confira o SHA-256 do DMG, instale o Dotchi em Aplicativos e abra normalmente. Não desative o Gatekeeper nem remova atributos de quarentena.</p><h2 id="feedback">Enviar feedback</h2><p>Escreva para <a href="mailto:dotchi.app@gmail.com?subject=Feedback%20do%20Dotchi">dotchi.app@gmail.com</a> ou abra uma <a href="https://github.com/itsmeluan/dotchi-releases/issues/new">Issue pública no GitHub</a>. Inclua a versão do Dotchi, a versão do macOS, os passos para reproduzir, o resultado esperado e o que ocorreu.</p><p class="notice">Nunca publique senhas, códigos 2FA, chaves de recuperação, chaves privadas, certificados, projetos confidenciais ou imagens que não possam ser públicas.</p><h2>Problemas no download</h2><p>Inclua a mensagem de erro exata e o SHA-256 calculado. O Dotchi não possui atualização automática nesta versão.</p>`],
    changelog: ["Novidades", "O que mudou em cada versão pública do Dotchi.", `<h2>Versão ${release.version}</h2><p>Primeira distribuição pública para Apple Silicon.</p><ul><li>Conversão determinística de imagens em pixel art.</li><li>Editor de sprites com camadas, frames, paletas e acabamento.</li><li>Exportações de PNG, animação, tiles e fluxos de jogos.</li><li>QuickLook para documentos <code>.dotchi</code>.</li><li>IA textual Qwen local e opcional.</li><li>Integração MCP local e restrita.</li></ul><p>O DMG é assinado, notarizado, grampeado e publicado com SHA-256.</p>`],
    support: ["Apoie o Dotchi", "O Dotchi é gratuito e completo. O apoio opcional ajudará a sustentar seu desenvolvimento.", `<p>O apoio é voluntário e não libera recursos, prioridade, influência ou uma edição diferente. Os canais abaixo permanecem inativos até a confirmação final dos dados públicos do recebedor e da orientação contábil.</p><div class="support-grid"><article class="card placeholder"><span class="status">Em preparação</span><h2>Brasil — Pix</h2><p>Uma chave Pix aleatória e o nome público do recebedor aparecerão aqui somente depois da confirmação final.</p><span class="button" aria-disabled="true">Pix indisponível</span></article><article class="card placeholder"><span class="status">Em preparação</span><h2>Internacional — PayPal</h2><p>O link oficial de pagamento do PayPal Business aparecerá aqui somente depois da confirmação final.</p><span class="button" aria-disabled="true">PayPal indisponível</span></article></div><p class="notice">Hoje não existe neste site link de pagamento, chave Pix, QR Code ou identidade do recebedor. Se alguém apresentar um desses dados como oficial, não pague.</p>`],
  }
};

await rm(out, { recursive: true, force: true });
await mkdir(resolve(out, "assets"), { recursive: true });
await cp(resolve(here, "styles.css"), resolve(out, "assets/styles.css"));
await cp(resolve(here, "site.js"), resolve(out, "assets/site.js"));
await cp(resolve(here, "../../dotchi/src/assets/dotchi-logo.png"), resolve(out, "assets/dotchi-logo.png"));
await cp(resolve(here, "../../dotchi/docs/provas-carimbo-por-confianca/candlestag-concept-0-1x.png"), resolve(out, "assets/resultado-dotchi.png"));
await cp(resolve(here, "../../dotchi/docs/provas-carimbo-por-confianca/candlestag-concept-0-6x.png"), resolve(out, "assets/resultado-dotchi-6x.png"));

for (const localeKey of ["en", "pt"]) {
  const base = localeKey === "pt" ? resolve(out, "pt-br") : out;
  await mkdir(base, { recursive: true });
  await writeFile(resolve(base, "index.html"), home(localeKey));
  for (const [route, [title, description, content]] of Object.entries(pages[localeKey])) {
    const dir = resolve(base, route);
    await mkdir(dir, { recursive: true });
    await writeFile(resolve(dir, "index.html"), page(localeKey, route, title, description, content));
  }
}

await writeFile(resolve(out, ".nojekyll"), "");
await writeFile(resolve(out, "404.html"), layout("en", "", {
  title: "Page not found — Dotchi", description: "This page does not exist.",
  body: `<div class="shell"><header class="page-hero"><p class="eyebrow">404</p><h1>Page not found.</h1><p><a class="button" href="./">Return to Dotchi</a></p></header></div>`
}));

console.log(`Built ${Object.keys(pages.en).length * 2 + 2} pages in ${out}`);
