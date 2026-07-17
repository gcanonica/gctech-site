(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initReveal() {
    var targets = document.querySelectorAll(
      ".section h2, .section-sub, .card, .steps li, .chip, .faq details, .cta-final .btn"
    );
    if (!targets.length) return;

    targets.forEach(function (el) { el.classList.add("reveal"); });

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach(function (el) { observer.observe(el); });
  }

  function initCardTilt() {
    if (prefersReducedMotion) return;
    var cards = document.querySelectorAll(".card");

    cards.forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        if (e.pointerType === "touch") return;
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var px = x / rect.width;
        var py = y / rect.height;
        var rotateY = (px - 0.5) * 10;
        var rotateX = (0.5 - py) * 10;

        card.style.setProperty("--mx", x + "px");
        card.style.setProperty("--my", y + "px");
        card.style.transform =
          "perspective(900px) rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" +
          rotateY.toFixed(2) + "deg) translateY(-3px)";
      });

      card.addEventListener("pointerleave", function () {
        card.style.transform = "";
      });
    });
  }

  function initHeroCanvas() {
    var canvas = document.getElementById("hero-canvas");
    if (!canvas || prefersReducedMotion) return;

    var hero = canvas.closest(".hero");
    var ctx = canvas.getContext("2d");
    var width, height, particles, rafId, resizeTimer;
    var linkDistance = 130;

    function resize() {
      width = canvas.width = hero.clientWidth;
      height = canvas.height = hero.clientHeight;
      var count = Math.min(70, Math.round((width * height) / 18000));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35
        });
      }
    }

    function step() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(125, 178, 255, 0.6)";

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();

        for (var j = i + 1; j < particles.length; j++) {
          var q = particles[j];
          var dx = p.x - q.x;
          var dy = p.y - q.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDistance) {
            ctx.strokeStyle = "rgba(77, 138, 239, " + (0.25 * (1 - dist / linkDistance)) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      rafId = requestAnimationFrame(step);
    }

    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(step);
      }
    });

    resize();
    rafId = requestAnimationFrame(step);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initReveal();
    initCardTilt();
    initHeroCanvas();
  });
})();
