/*
 * Tiny controller registry that mimics Stimulus conventions
 * (data-controller, data-<name>-target, data-action) so each file in
 * controllers/ can later become a Stimulus controller in Rails with
 * minimal changes.
 */
(function () {
  const registry = {};

  window.CIM = {
    register(name, init) {
      registry[name] = init;
    },

    targets(element, controller, name) {
      return Array.from(element.querySelectorAll(`[data-${controller}-target="${name}"]`));
    },

    target(element, controller, name) {
      return element.querySelector(`[data-${controller}-target="${name}"]`);
    },

    money(value) {
      return Number(value || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
    },

    toast(message) {
      let toast = document.querySelector(".toast");
      if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        toast.setAttribute("role", "status");
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.classList.add("is-visible");
      clearTimeout(toast._timer);
      toast._timer = setTimeout(() => toast.classList.remove("is-visible"), 3000);
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-controller]").forEach((element) => {
      element.dataset.controller.split(" ").forEach((name) => {
        if (registry[name]) registry[name](element);
      });
    });
  });
})();
