/*
 * customers: QuickBooks customers list with search, quick filters, sorting and pagination.
 * Rails: Admin::CustomersController#index; search, filters and pagination run
 * on the server (pagy + Turbo Frame), so the page never loads every customer.
 */
CIM.register("customers", (element) => {
  const data = window.CIM_MOCK;
  const perPage = 25;
  let page = 1;
  let filter = "all";

  const search = CIM.target(element, "customers", "search");
  const sort = CIM.target(element, "customers", "sort");
  const body = CIM.target(element, "customers", "body");
  const pager = CIM.target(element, "customers", "pager");
  const summary = CIM.target(element, "customers", "summary");
  const chips = CIM.targets(element, "customers", "chip");

  const escape = (value) =>
    String(value ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const date = (value) =>
    value ? new Date(value + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  const rows = data.customers.map((c) => ({
    customer: c,
    groups: data.accessFor(c.Id).groupIds.map((id) => data.productGroups.find((g) => g.id === id)).filter(Boolean),
    products: data.allowedItemIdsFor(c.Id).length
  }));

  const filters = {
    all: () => true,
    "no-products": (r) => r.products === 0,
    "no-users": (r) => r.customer.portalUsers === 0,
    "no-group": (r) => r.groups.length === 0 && r.products > 0
  };

  chips.forEach((chip) => {
    const count = rows.filter(filters[chip.dataset.filter]).length;
    chip.querySelector("[data-count]").textContent = count;
    chip.addEventListener("click", () => {
      filter = chip.dataset.filter;
      page = 1;
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      render();
    });
  });

  function filtered() {
    const term = search.value.trim().toLowerCase();
    const list = rows.filter(filters[filter]).filter(({ customer: c }) =>
      `${c.DisplayName} ${c.PrimaryEmailAddr} ${c.Id} ${c.BillAddr.City}`.toLowerCase().includes(term));
    const sorters = {
      name: (a, b) => a.customer.DisplayName.localeCompare(b.customer.DisplayName),
      "last-order": (a, b) => (b.customer.lastOrder || "").localeCompare(a.customer.lastOrder || ""),
      products: (a, b) => a.products - b.products
    };
    return list.sort(sorters[sort.value]);
  }

  function render() {
    const list = filtered();
    const pages = Math.max(1, Math.ceil(list.length / perPage));
    page = Math.min(page, pages);
    const start = (page - 1) * perPage;
    const slice = list.slice(start, start + perPage);

    body.innerHTML = slice.length ? slice.map(({ customer: c, groups, products }) => `
      <tr class="row-link" data-href="show.html?id=${c.Id}">
        <td>
          <a href="show.html?id=${c.Id}"><strong>${escape(c.DisplayName)}</strong></a>
          <div class="text-small text-muted">${escape(c.PrimaryEmailAddr)} · ${escape(c.BillAddr.City)}, ${escape(c.BillAddr.CountrySubDivisionCode)}</div>
        </td>
        <td class="mono">${c.Id}</td>
        <td>${groups.length ? groups.map((g) => `<span class="chip">${escape(g.name)}</span>`).join(" ") : '<span class="text-muted">—</span>'}</td>
        <td class="num">${products ? products : '<span class="badge badge--rejected">0 · cannot order</span>'}</td>
        <td class="num">${c.portalUsers || '<span class="text-muted">0</span>'}</td>
        <td>${date(c.lastOrder)}</td>
      </tr>`).join("")
      : '<tr><td colspan="6" class="table-empty">No customers match your search.</td></tr>';

    summary.textContent = list.length
      ? `Showing ${start + 1}–${start + slice.length} of ${list.length} customers`
      : "0 customers";

    pager.innerHTML = "";
    const button = (label, target, opts = {}) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "pager__btn" + (opts.current ? " is-current" : "");
      b.textContent = label;
      b.disabled = !!opts.disabled;
      if (opts.current) b.setAttribute("aria-current", "page");
      b.setAttribute("aria-label", opts.label || `Page ${label}`);
      b.addEventListener("click", () => { page = target; render(); });
      pager.appendChild(b);
    };
    button("‹", page - 1, { disabled: page === 1, label: "Previous page" });
    for (let p = 1; p <= pages; p++) {
      if (p === 1 || p === pages || Math.abs(p - page) <= 1) button(String(p), p, { current: p === page });
      else if (Math.abs(p - page) === 2) pager.insertAdjacentHTML("beforeend", '<span class="pager__gap">…</span>');
    }
    button("›", page + 1, { disabled: page === pages, label: "Next page" });
  }

  body.addEventListener("click", (event) => {
    const row = event.target.closest("[data-href]");
    if (row && !event.target.closest("a")) window.location.href = row.dataset.href;
  });
  search.addEventListener("input", () => { page = 1; render(); });
  sort.addEventListener("change", render);

  const params = new URLSearchParams(window.location.search);
  const initial = chips.find((c) => c.dataset.filter === params.get("filter"));
  if (initial) initial.click(); else render();
});
