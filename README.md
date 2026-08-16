# Dotchi — canal público

O Dotchi é um aplicativo que transforma imagens em pixel art e
oferece ferramentas para editar sprites, animações, tiles e exportações para
fluxos de desenvolvimento de jogos.

O processamento principal acontece localmente no Mac. O aplicativo não exige
conta, assinatura ou serviço pago.

## Baixar

Baixe a versão mais recente na página de
[Releases](https://github.com/itsmeluan/dotchi-releases/releases/latest).

A versão 1.0 é para Macs com Apple Silicon (`arm64`) e exige macOS 13.3 ou
posterior. Cada Release declara o SHA-256 do DMG para conferência de
integridade.

## Instalar

1. baixe o arquivo `.dmg` da Release;
2. abra o DMG com duplo clique;
3. arraste `Dotchi.app` para a pasta **Aplicativos**;
4. ejete a imagem e abra o Dotchi pela pasta **Aplicativos**.

O DMG é assinado com Developer ID, notarizado pela Apple e leva o ticket da
notarização. Não desative o Gatekeeper nem remova atributos de segurança. Se o
macOS recusar a abertura, confira o SHA-256 e abra um chamado em
[Issues](https://github.com/itsmeluan/dotchi-releases/issues).

Para conferir o arquivo no Terminal:

```bash
shasum -a 256 ~/Downloads/Dotchi_1.0.0_aarch64.dmg
```

## Site, privacidade e suporte

O site bilíngue é gerado a partir de `site/` e publicado pelo GitHub Pages a
partir de `docs/`:

```bash
node site/build.mjs
node site/test.mjs
```

- [Privacidade](PRIVACIDADE.md)
- [Suporte](SUPORTE.md)
- [Termos do binário](TERMOS.md)

Os canais de apoio financeiro permanecem inativos e podem ser habilitados no
site depois, sem mudar o aplicativo. Este repositório não deve receber chave
Pix, QR Code, identidade civil do recebedor nem credencial antes dessa decisão.

Este repositório é somente o canal público dos binários. O código-fonte e o
formato `.dotchi` permanecem proprietários e não são publicados aqui. O
repositório não compila, assina ou notariza o aplicativo e não contém
certificados, perfis ou segredos.
