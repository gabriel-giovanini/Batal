# Batal — Site do Restaurante

Site de página única (`index.html`) que abre com dois cliques, sem build. Tailwind CSS (CDN) + GSAP (CDN).
Referência visual: `../Referencias/` (layout estilo "Jacket Masters": prato central flutuando, fundo em degradê radial vibrante).

## Regras de conteúdo
- **Nome real:** Batal. **Fotos reais:** as que estão em `pratos/`.
- Todo o resto (preços, descrições, endereço, horários, textos "sobre") é **provisório/fictício** até o dono enviar os dados reais. Não inventar fatos sobre o restaurante; usar textos de exemplo claramente marcados.

## Estrutura
```
SiteRestaurante/
├── index.html        # site público: só a tela inicial (hero/carrossel)
├── admin.html        # painel SaaS: login, cardápio, categorias, pedidos, clientes, cupons, pagamentos, config, plano
├── dados.js          # camada de dados compartilhada (localStorage) + DEFAULT_DATA
├── CLAUDE.md         # este arquivo
└── pratos/           # fotos dos pratos (PNG com fundo transparente, ~1200px quadrado)
```
- Os pratos vêm de `BatalDB.load()` (dados.js). O painel salva com `BatalDB.save()` e o site recarrega sozinho (evento `storage`).
- **Para ligar o banco de dados:** trocar só `load()`/`save()` em `dados.js` por chamadas à API.
- O que ainda é demonstração (marcado com selo "Atualização em breve"): login real, pedidos em tempo real, clientes, pagamento online, cupons no carrinho, cobrança do plano, upload na nuvem.
- Já funciona de verdade: cadastro/edição/exclusão de pratos, preços, cores, fotos (upload salvo no navegador), ordem do carrossel, categorias, cupons salvos, dados do restaurante, backup JSON, e o botão "Finalizar pedido" do site envia a sacola pelo WhatsApp configurado.
- O painel deve seguir a mesma tipografia e linguagem visual do hero (Montserrat 800 tracking-tight, DM Sans, pílulas brancas, vidro fosco, degradê radial do prato, molas GSAP).
- Se a imagem de `pratos/` não existir, o site gera automaticamente um **placeholder SVG** bonito com a cor do prato e o nome do arquivo esperado. Basta salvar a foto com esse nome.

## Skills / Diretrizes de Engenharia Visual (obrigatórias)

### 1. Efeito 3D flutuante central
- O prato principal fica no centro da tela.
- Levitação contínua e suave no eixo Y via `@keyframes` (wrapper `.float`).
- Sombra radial separada no "chão" (`radial-gradient` + `blur`) que **diminui e clareia quando o prato sobe** e **aumenta e escurece quando desce** — mesma duração/curva da levitação, para profundidade 3D realista.
- Inclinação 3D (tilt) acompanhando o mouse (`rotationX/rotationY` com `perspective`, via `gsap.quickTo`), com leve parallax na sombra e na marca d'água.
- Nunca aplicar a animação CSS e o GSAP no mesmo elemento (um sobrescreve o `transform` do outro): CSS no wrapper, GSAP no filho.

### 2. Transição de cor de fundo dinâmica
- Cada prato tem 3 cores (`colors: [claro, médio, escuro]`) usadas num degradê radial vibrante.
- Setas `<` `>` (e teclado ← →, swipe no celular, miniatura e menu) trocam o prato:
  - prato atual sai deslizando + girando; o novo entra com **física de mola** (`elastic.out`);
  - o fundo interpola as variáveis CSS `--c1/--c2/--c3` suavemente;
  - título, descrição, preço e opções atualizam com **slide** (máscara `overflow:hidden` + `yPercent`).

### 3. Layout fiel à referência
- **Topo:** logo à esquerda; menu central em pílula com vidro fosco (glassmorphism) com as categorias (Burgers, Executivos, Árabes, Porções) e indicador branco deslizante; sacola à direita com contador.
- **Esquerda:** setas `<` `>`, título forte e apetitoso, descrição curta dos ingredientes, botão branco arredondado **"Pedir Agora >"** (anima o prato voando até a sacola).
- **Direita:** preço promocional grande com preço antigo riscado embaixo; seletores redondos interativos (tamanho/peso do blend/recheio) que mudam o valor na hora com contagem animada.
- **Canto inferior direito:** miniatura flutuante do próximo prato, funcionando como botão de prévia/avançar.
- **Rodapé do hero:** redes sociais à esquerda, frase curta centralizada.

### Padrões gerais
- Animações fluidas: animar apenas `transform` e `opacity`; usar GSAP timelines.
- Respeitar `prefers-reduced-motion`.
- Responsivo: no celular o layout empilha (prato em cima, textos e preço abaixo).
- Fontes: Montserrat (títulos) e DM Sans (texto).
