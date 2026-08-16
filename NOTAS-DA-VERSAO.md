# Dotchi 1.0.0

Primeira versão estável do Dotchi para Macs com Apple Silicon (`arm64`), com
macOS 13.3 ou posterior.

## O que esta versão entrega

- conversão determinística de imagens em pixel art;
- editor de sprites com camadas, frames, paletas, histórico de cores e
  ferramentas de acabamento;
- desenho pixel-perfect, formas, simetria par/ímpar e seleções que podem
  começar fora do canvas;
- atalhos, cursores contextuais, ferramentas agrupadas e modais arrastáveis;
- exportação de PNGs, animações, tiles e formatos para fluxos de jogos;
- QuickLook para documentos `.dotchi`;
- IA textual Qwen opcional, baixada e executada localmente;
- integração MCP local e restrita ao projeto escolhido, com 17 ferramentas,
  preview/refino visual e escrita create-only explícita.

## Integridade e segurança

Arquivo: `Dotchi_1.0.0_aarch64.dmg`

Tamanho: `45.101.203 bytes`

SHA-256:

```text
1eaa83caaeb84f3bf8c7b9e3647bb3787a38fc0679cd3b4822369e6a727ec45e
```

O DMG é assinado com Developer ID, notarizado pela Apple e grampeado. O mesmo
arquivo é conferido depois de copiado para `/Applications`, sem contornar o
Gatekeeper.

## Instalação

1. baixe o DMG anexado a esta Release;
2. confira o SHA-256;
3. abra o DMG e arraste `Dotchi.app` para **Aplicativos**;
4. ejete a imagem e abra o Dotchi pela pasta **Aplicativos**.

Esta versão não possui atualização automática. Versões futuras devem ser
baixadas manualmente deste repositório.

## Limites conhecidos

- não há build oficial para Intel, Windows ou Linux nesta Release;
- a IA é textual e opcional; o modelo local ocupa aproximadamente 2,5 GB;
- o Dotchi não gera imagens e não envia projetos a serviços externos;
- apoio por Pix ou PayPal ainda não está ativo e não afeta o aplicativo.
