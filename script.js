(function () {
  var root = document.documentElement;
  var WA = "393779759723";

  /* ---------- language switch ---------- */
  function setLang(l) {
    root.setAttribute("data-lang", l);
    root.lang = l;
    try { localStorage.setItem("mc-lang", l); } catch (e) {}
    document.querySelectorAll("[data-set-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-set-lang") === l));
    });
    var q = document.getElementById("q");
    if (q) q.placeholder = l === "es" ? "pasaporte, visa, matrimonio…" : "passaporto, visto, matrimonio…";
    fillTopics();
  }
  document.querySelectorAll("[data-set-lang]").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-set-lang")); });
  });

  /* ---------- mobile menu ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("main-nav");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
  });

  /* ---------- quick links open their procedure ---------- */
  document.querySelectorAll("[data-open]").forEach(function (a) {
    a.addEventListener("click", function () {
      var d = document.getElementById("p-" + a.getAttribute("data-open"));
      if (d) d.open = true;
    });
  });

  /* ---------- procedure search ---------- */
  var procs = Array.prototype.slice.call(document.querySelectorAll(".proc"));
  var none = document.getElementById("no-results");
  function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  document.getElementById("q").addEventListener("input", function (e) {
    var q = norm(e.target.value.trim());
    var shown = 0;
    procs.forEach(function (p) {
      var hit = !q || norm(p.textContent).indexOf(q) !== -1;
      p.hidden = !hit;
      if (hit) shown++;
    });
    document.querySelectorAll(".proc-group").forEach(function (g) {
      g.hidden = !g.querySelector(".proc:not([hidden])");
    });
    none.hidden = shown !== 0;
  });

  /* ---------- WhatsApp form ---------- */
  function fillTopics() {
    var sel = document.getElementById("f-topic");
    var l = root.getAttribute("data-lang");
    var keep = sel.selectedIndex;
    sel.innerHTML = "";
    procs.forEach(function (p) {
      var t = p.querySelector('summary > [lang="' + l + '"]:not(.sub)');
      var o = document.createElement("option");
      o.textContent = t ? t.textContent.trim() : "";
      sel.appendChild(o);
    });
    var other = document.createElement("option");
    other.textContent = l === "es" ? "Envíos a Cuba" : "Spedizioni a Cuba";
    sel.appendChild(other);
    var other2 = document.createElement("option");
    other2.textContent = l === "es" ? "Otra consulta" : "Altro";
    sel.appendChild(other2);
    if (keep >= 0) sel.selectedIndex = keep;
    if (typeof updateLink === "function" && form) updateLink();
  }
  // the send button is a real link whose message follows what the visitor types
  var form = document.getElementById("wa-form");
  function updateLink() {
    var es = root.getAttribute("data-lang") === "es";
    var name = form.elements.name.value.trim();
    var text = (es ? "Hola" : "Ciao") + (name ? (es ? ", soy " : ", sono ") + name : "") + ".\n" +
      (es ? "Trámite: " : "Pratica: ") + form.elements.topic.value + "\n" + form.elements.msg.value.trim();
    document.getElementById("wa-send").href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(text.trim());
  }
  form.addEventListener("input", updateLink);
  form.addEventListener("change", updateLink);
  form.addEventListener("submit", function (e) { e.preventDefault(); });

  setLang(root.getAttribute("data-lang") || "it");
})();
