/* =====================================================================
   BATAL — camada de dados compartilhada entre o site (index.html)
   e o painel (admin.html).

   Hoje os dados ficam no localStorage do navegador.
   QUANDO TIVER BANCO DE DADOS: troque apenas as funções
   BatalDB.load() e BatalDB.save() por chamadas à sua API.
   ===================================================================== */
(function () {
  const KEY = 'batal:data:v1';

  const DEFAULT_DATA = {
    version: 1,
    business: {
      name: 'Batal',
      slogan: '',
      whatsapp: '',      // só números, com DDI+DDD. Ex.: 5511999999999
      address: '',
      hours: '',
      instagram: '',
      deliveryFee: 0,
      minOrder: 0,
      open: true,
    },
    categories: ['Burgers', 'Executivos', 'Árabes', 'Porções'],
    // Preços e textos FICTÍCIOS (provisórios)
    dishes: [
      {
        id: 'burger', active: true, cat: 'Burgers', name: 'Batal Burger',
        title: ['Suculento', 'em cada mordida'],
        desc: 'Pão brioche selado na manteiga, blend bovino grelhado, cebola roxa, tomate, alface americana e molho especial da casa.',
        tagline: ['Feito na brasa,', 'servido com vontade'],
        img: 'pratos/hamburguer.png',
        colors: ['#ffb24a', '#ff7417', '#9c3300'],
        optLabel: 'Escolha o peso do blend:',
        options: [ { label: '120g', price: 29.9 }, { label: '160g', price: 34.9 }, { label: '200g', price: 39.9 } ],
      },
      {
        id: 'executivo', active: true, cat: 'Executivos', name: 'Executivo à Milanesa',
        title: ['Almoço de', 'verdade'],
        desc: 'Bife empanado e crocante com molho rústico, batata frita sequinha, salada de alface com tomate e um toque de limão.',
        tagline: ['Prato cheio,', 'sabor de casa'],
        img: 'pratos/executivo.png',
        colors: ['#8be09b', '#2f9e52', '#0b3a1f'],
        optLabel: 'Escolha a porção:',
        options: [ { label: '1p', price: 32.9 }, { label: '2p', price: 59.9 }, { label: '3p', price: 84.9 } ],
      },
      {
        id: 'beirute', active: true, cat: 'Árabes', name: 'Beirute Tradicional',
        title: ['Crocante por fora,', 'derretendo por dentro'],
        desc: 'Pão sírio tostado, recheio de carne temperada com especiarias árabes, queijo derretido e ervas frescas.',
        tagline: ['Tradição árabe', 'em cada fatia'],
        img: 'pratos/beirute.png',
        colors: ['#ffd56b', '#e39b12', '#6e3600'],
        optLabel: 'Escolha o tamanho:',
        options: [ { label: 'M', price: 36.9 }, { label: 'G', price: 44.9 }, { label: 'GG', price: 54.9 } ],
      },
      {
        id: 'shawarma', active: true, cat: 'Árabes', name: 'Shawarma Batal',
        title: ['Enrolado', 'na hora'],
        desc: 'Pão folha tostado na chapa, recheio temperado à moda árabe e folhas de hortelã fresca. Servido quentinho no papel.',
        tagline: ['Quentinho,', 'do jeito certo'],
        img: 'pratos/shawarma.png',
        colors: ['#ff8a9b', '#d11f58', '#4a0420'],
        optLabel: 'Escolha o recheio:',
        options: [ { label: 'Frango', price: 26.9 }, { label: 'Carne', price: 29.9 }, { label: 'Misto', price: 31.9 } ],
      },
      {
        id: 'porcao', active: true, cat: 'Porções', name: 'Porção da Casa',
        title: ['Feita para', 'compartilhar'],
        desc: 'Descrição provisória — adicione aqui os ingredientes da porção. Coloque a foto em pratos/porcao.png.',
        tagline: ['Pra dividir', '(ou não)'],
        img: 'pratos/porcao.png',
        colors: ['#c9a6ff', '#7c3aed', '#2a0d63'],
        optLabel: 'Serve quantas pessoas:',
        options: [ { label: '2', price: 39.9 }, { label: '4', price: 69.9 }, { label: '6', price: 94.9 } ],
      },
    ],
    coupons: [],
  };

  const clone = o => JSON.parse(JSON.stringify(o));

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d && Array.isArray(d.dishes)) {
          d.business = Object.assign(clone(DEFAULT_DATA.business), d.business || {});
          d.categories = d.categories || [];
          d.coupons = d.coupons || [];
          return d;
        }
      }
    } catch (e) { /* navegador bloqueou ou dado corrompido: usa padrão */ }
    return clone(DEFAULT_DATA);
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false; // provável: limite de espaço (fotos muito grandes)
    }
  }

  function reset() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    return clone(DEFAULT_DATA);
  }

  // "preço de" riscado: usa o informado ou calcula +28%
  function oldPrice(opt) {
    return opt.old && opt.old > opt.price ? opt.old : Math.ceil(opt.price * 1.28) - 0.1;
  }

  window.BatalDB = { KEY, DEFAULT_DATA, load, save, reset, oldPrice };
})();
