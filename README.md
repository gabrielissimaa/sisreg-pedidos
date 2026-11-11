# Pedidos SISREG / SER

PWA de uma página que monta o texto de solicitações para o SISREG e o SER (Rio de Janeiro), seguindo os critérios dos protocolos de regulação. Nada é salvo nem enviado: os dados ficam só na tela.

## Arquivos
- `index.html`: interface (lista → critérios → perguntas → texto para copiar)
- `protocolos.js`: gerado automaticamente a partir dos 26 Protocolos de Regulação Ambulatorial da SMS-Rio (2023–2025) — indicações, priorização por cor, emergências, o que não encaminhar e o que o pedido deve conter.
- `catalogo.js`: itens feitos à mão (avisos do Complexo Regulador, Manual 2026, Enfermagem, Obesidade, fluxos por e-mail) e a regra que faz cada protocolo novo substituir o item antigo equivalente.
- `gerador.js`: monta o texto do pedido
- `sw.js`, `manifest.json`, `icon.svg`: funcionamento offline e instalação no celular

## Publicar de graça no GitHub Pages
1. Crie um repositório (ex.: `sisreg-pedidos`) e envie estes arquivos para a raiz.
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `/root`.
3. Acesse `https://SEU-USUARIO.github.io/sisreg-pedidos/` e, no celular, use “Adicionar à tela inicial”.

## Fontes
Protocolos de Regulação Ambulatorial SMS-Rio: Alergologia/Imunologia, Angiologia, Cardiologia, Exames em Cardiologia, Cirurgia de Cabeça e Pescoço, Cirurgia Geral (parte 1), Cirurgia Pediátrica, Cirurgia Plástica, Cirurgia Vascular, Eletroneuromiografia, Endocrinologia, Endoscopia e Colonoscopia, Ginecologia e Mastologia, Nefrologia, Neurologia, Oftalmologia, Oncologia, Ortopedia, Otorrinolaringologia e Exames, PADI, Pré-natal de Alto Risco, Psiquiatria e Saúde Mental Adulto, Reabilitação, Ressonância Magnética, Reumatologia, Urologia (2023–2025); Manual de Regulação Ambulatorial SMS-Rio 2026 (versão preliminar); Programa de Controle da Obesidade (SMS-Rio, 03/2026); Guia Profissional de Regulação Ambulatorial (SUBGERAL, 2022); Protocolo para o Regulador SISREG v1.4 (SUBPAV, 2015); avisos do Complexo Regulador SMS-Rio (out/2026); Carteira de Serviços APS-Rio (2021). Nomenclaturas mudam: confira sempre no sistema.
