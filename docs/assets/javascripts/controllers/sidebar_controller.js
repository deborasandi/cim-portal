/*
 * sidebar: collapses the sidebar on desktop (icons only) and opens it as a
 * drawer on mobile. The desktop choice is remembered per browser.
 * Rails: app/javascript/controllers/sidebar_controller.js (Stimulus)
 */
CIM.register("sidebar", (element) => {
  const toggle = CIM.target(element, "sidebar", "toggle");
  const backdrop = CIM.target(element, "sidebar", "backdrop");
  const mobile = window.matchMedia("(max-width: 900px)");
  const storageKey = "cim-portal:sidebar-collapsed";

  try {
    if (localStorage.getItem(storageKey) === "1") element.classList.add("is-collapsed");
  } catch (e) {}

  function sync() {
    const expanded = mobile.matches
      ? element.classList.contains("is-open")
      : !element.classList.contains("is-collapsed");
    toggle.setAttribute("aria-expanded", String(expanded));
  }

  toggle.addEventListener("click", () => {
    if (mobile.matches) {
      element.classList.toggle("is-open");
    } else {
      const collapsed = element.classList.toggle("is-collapsed");
      try {
        localStorage.setItem(storageKey, collapsed ? "1" : "0");
      } catch (e) {}
    }
    sync();
  });

  backdrop.addEventListener("click", () => {
    element.classList.remove("is-open");
    sync();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && element.classList.contains("is-open")) {
      element.classList.remove("is-open");
      sync();
      toggle.focus();
    }
  });

  mobile.addEventListener("change", () => {
    element.classList.remove("is-open");
    sync();
  });

  sync();
});
