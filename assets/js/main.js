/* Studio Caramelo 3D */
(function () {
  // ===== WhatsApp =====
  // Para trocar o número, altere só esta linha (55 + DDD + número, sem espaços).
  var WHATSAPP = "5575992051279";

  var MENSAGENS = {
    geral: "Olá, Caramelo! Vim pelo site e gostaria de fazer um orçamento para o meu projeto.",
    render: "Olá, Caramelo! Vim pelo site e gostaria de um orçamento de renderização 3D.",
    modelagem: "Olá, Caramelo! Vim pelo site e gostaria de um orçamento de modelagem 3D completa.",
    planta: "Olá, Caramelo! Vim pelo site e gostaria de um orçamento de planta baixa humanizada.",
    "360": "Olá, Caramelo! Vim pelo site e gostaria de um orçamento de imagens 360º.",
    video: "Olá, Caramelo! Vim pelo site e gostaria de um orçamento de vídeo renderizado.",
    portfolio: "Olá, Caramelo! Vi o portfólio no site e quero um orçamento para o meu projeto."
  };

  document.querySelectorAll(".wpp").forEach(function (a) {
    var msg = MENSAGENS[a.dataset.msg] || MENSAGENS.geral;
    a.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);
    a.addEventListener("click", function () {
      // Avisa o Google Tag Manager; lá o evento vira "Contact" no Pixel da Meta.
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "whatsapp_click", origem: a.dataset.msg || "geral" });
    });
  });

  // ===== Cabeçalho sólido ao rolar + botão flutuante =====
  var topo = document.getElementById("topo");
  var flutuante = document.querySelector(".flutuante");
  function aoRolar() {
    var y = window.scrollY;
    topo.classList.toggle("is-solido", y > 40);
    flutuante.classList.toggle("is-visivel", y > window.innerHeight * 0.6);
  }
  window.addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  // ===== Abas do portfólio =====
  var abas = document.querySelectorAll(".abas [role=tab]");
  function ativar(aba) {
    abas.forEach(function (b) {
      var sel = b === aba;
      b.setAttribute("aria-selected", sel);
      b.tabIndex = sel ? 0 : -1;
      document.getElementById(b.getAttribute("aria-controls")).hidden = !sel;
    });
  }
  abas.forEach(function (b, i) {
    b.addEventListener("click", function () { ativar(b); });
    b.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        var prox = abas[(i + (e.key === "ArrowRight" ? 1 : abas.length - 1)) % abas.length];
        ativar(prox); prox.focus();
      }
    });
  });

  // ===== Lightbox =====
  var dlg = document.getElementById("lightbox");
  var dlgImg = dlg.querySelector("img");
  var lista = [], atual = 0;
  function mostrar(i) {
    atual = (i + lista.length) % lista.length;
    var b = lista[atual];
    dlgImg.src = b.dataset.src;
    dlgImg.alt = b.querySelector("img").alt;
  }
  document.querySelectorAll(".g").forEach(function (b) {
    b.addEventListener("click", function () {
      lista = Array.prototype.slice.call(b.parentElement.querySelectorAll(".g"));
      mostrar(lista.indexOf(b));
      if (dlg.showModal) dlg.showModal();
    });
  });
  dlg.querySelector(".lightbox__fechar").addEventListener("click", function () { dlg.close(); });
  dlg.querySelector(".lightbox__nav--ant").addEventListener("click", function () { mostrar(atual - 1); });
  dlg.querySelector(".lightbox__nav--prox").addEventListener("click", function () { mostrar(atual + 1); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") mostrar(atual + 1);
    if (e.key === "ArrowLeft") mostrar(atual - 1);
  });
  // Arrastar no celular
  var x0 = null;
  dlg.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
    x0 = null;
  });

  // ===== Animação de entrada =====
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var alvos = document.querySelectorAll(".secao-topo, .dor__frase, .beneficios li, .servicos__lista li, .incluso, .passos__lista li, .moldura, .sobre__texto, .final__inner > *");
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visivel"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    alvos.forEach(function (el) { el.classList.add("revelar"); io.observe(el); });
  }

  // ===== Feed do Instagram (Behold) =====
  // Cole aqui o "Feed ID" gerado em behold.so depois de conectar o Instagram.
  // Enquanto estiver vazio, o site mostra só o perfil e o botão "Seguir".
  var BEHOLD_FEED_ID = "00VAGgA8O8w4HzTdkPOx";

  if (BEHOLD_FEED_ID) {
    var feed = document.getElementById("insta-feed");
    var widget = document.createElement("behold-widget");
    widget.setAttribute("feed-id", BEHOLD_FEED_ID);
    feed.appendChild(widget);
    feed.hidden = false;
    var s = document.createElement("script");
    s.type = "module";
    s.src = "https://w.behold.so/widget.js";
    document.head.appendChild(s);
  }

  document.getElementById("ano").textContent = new Date().getFullYear();
})();
