# Dotchi 0.1.0

Primeira distribuição pública do Dotchi para Macs com Apple Silicon (`arm64`).

## O que esta versão entrega

- conversão determinística de imagens em pixel art;
- editor de sprites com camadas, frames, paletas e ferramentas de acabamento;
- exportação de PNGs, animações, tiles e formatos para fluxos de jogos;
- QuickLook para documentos `.dotchi`;
- IA textual Qwen opcional, baixada e executada localmente;
- integração MCP local e restrita ao projeto escolhido.

## Integridade e segurança

Arquivo: `Dotchi_0.1.0_aarch64.dmg`

Tamanho: `43.180.689 bytes`

SHA-256:

```text
d439dd60995a6d9ecdb49c75247d19d7d9586d425b8045598525d5c3d71e46ac
```

O DMG é assinado com Developer ID, notarizado pela Apple e grampeado. O mesmo
arquivo foi aberto diretamente da imagem e depois de copiado para
`/Applications` em outro Mac Apple Silicon sob quarentena real, sem contornar o
Gatekeeper.

## Instalação

1. baixe o DMG anexado a esta Release;
2. confira o SHA-256;
3. abra o DMG e arraste `Dotchi.app` para **Aplicativos**;
4. ejete a imagem e abra o Dotchi pela pasta **Aplicativos**.

Esta versão não possui atualização automática. Versões futuras devem ser
baixadas manualmente deste repositório.
