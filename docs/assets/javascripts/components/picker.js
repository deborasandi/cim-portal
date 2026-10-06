/*
 * CIM.openPicker: searchable selection dialog (products, groups, customers).
 *   CIM.openPicker({
 *     title, description, confirmLabel,
 *     items: [{ id, title, subtitle, meta, filter }],
 *     filterLabel: "Category",   // optional select built from item.filter values
 *     multiple: true,            // false = pick one (radio)
 *     onConfirm(ids) {}
 *   })
 * Rails: a Turbo Frame modal whose list is searched and paginated on the server.
 */
(function () {
  let dialog;

  function build() {
    dialog = document.createElement("dialog");
    dialog.className = "dialog dialog--wide picker";
    dialog.innerHTML = `
      <form method="dialog">
        <div class="dialog__body">
          <h2 data-picker="title"></h2>
          <p data-picker="description"></p>
          <div class="toolbar picker__toolbar">
            <label class="search">
              <span class="sr-only">Search</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              <input class="input" type="search" placeholder="Search" data-picker="search">
            </label>
            <select class="select picker__filter" data-picker="filter"></select>
          </div>
          <div class="picker__list" data-picker="list" role="listbox"></div>
        </div>
        <div class="dialog__actions">
          <span class="picker__count" data-picker="count"></span>
          <button type="button" class="btn btn--secondary" data-picker="cancel">Cancel</button>
          <button type="submit" class="btn btn--primary" data-picker="confirm"></button>
        </div>
      </form>`;
    document.body.appendChild(dialog);
    dialog.querySelector('[data-picker="cancel"]').addEventListener("click", () => dialog.close());
  }

  const escape = (value) =>
    String(value ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  CIM.openPicker = function (options) {
    if (!dialog) build();
    const multiple = options.multiple !== false;
    const selected = new Set();
    const $ = (name) => dialog.querySelector(`[data-picker="${name}"]`);
    const search = $("search");
    const filter = $("filter");
    const list = $("list");
    const confirm = $("confirm");

    $("title").textContent = options.title;
    $("description").textContent = options.description || "";
    search.value = "";
    search.placeholder = options.searchPlaceholder || "Search";

    const filters = Array.from(new Set(options.items.map((i) => i.filter).filter(Boolean))).sort();
    filter.hidden = filters.length === 0;
    filter.innerHTML = `<option value="">All ${escape((options.filterLabel || "categories").toLowerCase())}</option>` +
      filters.map((f) => `<option>${escape(f)}</option>`).join("");

    function updateFooter() {
      const n = selected.size;
      $("count").textContent = multiple ? `${n} selected` : "";
      confirm.disabled = n === 0;
      confirm.textContent = typeof options.confirmLabel === "function" ? options.confirmLabel(n) : options.confirmLabel;
    }

    function render() {
      const term = search.value.trim().toLowerCase();
      const visible = options.items.filter((item) =>
        (!filter.value || item.filter === filter.value) &&
        `${item.title} ${item.subtitle || ""}`.toLowerCase().includes(term));

      list.innerHTML = visible.length ? visible.map((item) => `
        <label class="picker__item">
          <input type="${multiple ? "checkbox" : "radio"}" name="picker" value="${escape(item.id)}" ${selected.has(item.id) ? "checked" : ""}>
          <span class="picker__text">
            <span class="picker__title">${escape(item.title)}</span>
            ${item.subtitle ? `<span class="picker__subtitle">${escape(item.subtitle)}</span>` : ""}
          </span>
          ${item.meta ? `<span class="picker__meta">${escape(item.meta)}</span>` : ""}
        </label>`).join("")
        : `<p class="picker__empty">${escape(options.emptyText || "Nothing found.")}</p>`;
    }

    list.onchange = (event) => {
      if (!multiple) selected.clear();
      event.target.checked ? selected.add(event.target.value) : selected.delete(event.target.value);
      updateFooter();
    };
    search.oninput = render;
    filter.onchange = render;
    dialog.querySelector("form").onsubmit = (event) => {
      event.preventDefault();
      if (!selected.size) return;
      dialog.close();
      options.onConfirm(Array.from(selected));
    };

    render();
    updateFooter();
    dialog.showModal();
    search.focus();
  };
})();
