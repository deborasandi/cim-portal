/*
 * tabs: [role="tab"][aria-controls] buttons show / hide [role="tabpanel"] sections.
 * The active tab is kept in the URL hash (#orders) so it survives a reload.
 * Rails: app/javascript/controllers/tabs_controller.js (Stimulus)
 */
CIM.register("tabs", (element) => {
  const tabs = Array.from(element.querySelectorAll('[role="tab"]'));

  function select(tab) {
    tabs.forEach((t) => {
      const active = t === tab;
      t.setAttribute("aria-selected", String(active));
      t.tabIndex = active ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !active;
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      select(tab);
      history.replaceState(null, "", `#${tab.getAttribute("aria-controls")}`);
    });
    tab.addEventListener("keydown", (event) => {
      const next = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (!next) return;
      const target = tabs[(index + next + tabs.length) % tabs.length];
      target.focus();
      target.click();
    });
  });

  const fromHash = tabs.find((t) => `#${t.getAttribute("aria-controls")}` === window.location.hash);
  select(fromHash || tabs[0]);
});
