/*
 * customer-access: one customer's page (?id=<QuickBooks customer id>).
 * Products the customer can order = products of its groups + products added individually.
 * Every change is applied right away (no "Save" button).
 * Rails: Admin::CustomersController#show, with nested resources
 * customer_product_groups (create / destroy) and customer_products (create / destroy).
 */
CIM.register("customer-access", (element) => {
  const data = window.CIM_MOCK;
  const params = new URLSearchParams(window.location.search);
  const customer = data.customers.find((c) => c.Id === params.get("id")) || data.customers.find((c) => c.Id === "58");
  const access = data.accessFor(customer.Id);

  const t = (name) => CIM.target(element, "customer-access", name);
  const escape = (value) =>
    String(value ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const date = (value) =>
    value ? new Date(value + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
  const group = (id) => data.productGroups.find((g) => g.id === id);
  const item = (id) => data.items.find((i) => i.Id === id);

  // ----- Header -----
  document.title = `${customer.DisplayName} · CIM Portal`;
  element.querySelectorAll("[data-customer-name]").forEach((el) => (el.textContent = customer.DisplayName));
  const b = customer.BillAddr;
  t("info").innerHTML = `
    <div><dt>QuickBooks #</dt><dd class="mono">${customer.Id}</dd></div>
    <div><dt>Email</dt><dd>${escape(customer.PrimaryEmailAddr)}</dd></div>
    <div><dt>Payment terms</dt><dd>${escape(customer.SalesTermRef.name)}</dd></div>
    <div><dt>Address</dt><dd>${escape(b.Line1)}, ${escape(b.City)}, ${escape(b.CountrySubDivisionCode)} ${escape(b.PostalCode)}</dd></div>
    <div><dt>Portal users</dt><dd>${customer.portalUsers}</dd></div>
    <div><dt>Last order</dt><dd>${date(customer.lastOrder)}</dd></div>`;

  // ----- Groups -----
  function renderGroups() {
    const list = t("groups");
    list.innerHTML = access.groupIds.length
      ? access.groupIds.map((id) => {
          const g = group(id);
          return `<span class="chip chip--lg">
              <a href="../product_groups/show.html?id=${g.id}">${escape(g.name)}</a>
              <span class="text-muted">· ${g.itemIds.length} products</span>
              <button type="button" class="chip__remove" data-remove-group="${g.id}" aria-label="Remove group ${escape(g.name)}">✕</button>
            </span>`;
        }).join("")
      : '<span class="text-muted">No groups yet. Assign a group to give this customer a set of products at once.</span>';
  }

  // ----- Products -----
  function rows() {
    return data.allowedItemIdsFor(customer.Id).map(item).filter(Boolean).map((i) => ({
      item: i,
      groups: access.groupIds.map(group).filter((g) => g.itemIds.includes(i.Id)),
      individual: access.itemIds.includes(i.Id)
    })).sort((a, b) => a.item.Sku.localeCompare(b.item.Sku));
  }

  function renderProducts() {
    const term = t("productSearch").value.trim().toLowerCase();
    const all = rows();
    const list = all.filter((r) => `${r.item.Sku} ${r.item.Name} ${r.item.Category}`.toLowerCase().includes(term));

    const individual = all.filter((r) => r.individual).length;
    t("productCount").textContent = `${all.length} ${all.length === 1 ? "product" : "products"} · ${individual} added individually`;
    element.querySelectorAll("[data-products-badge]").forEach((el) => (el.textContent = all.length));
    t("noProducts").hidden = all.length > 0;

    t("products").innerHTML = list.length ? list.map((r) => `
      <tr>
        <td>${r.individual ? `<input type="checkbox" value="${r.item.Id}" aria-label="Select ${escape(r.item.Name)}">` : ""}</td>
        <td class="mono">${escape(r.item.Sku)}</td>
        <td>${escape(r.item.Name)}<div class="text-small text-muted">${escape(r.item.Category)}</div></td>
        <td>
          ${r.groups.map((g) => `<span class="chip">${escape(g.name)}</span>`).join(" ")}
          ${r.individual ? '<span class="chip chip--individual">Added individually</span>' : ""}
        </td>
        <td class="num">${CIM.money(r.item.UnitPrice)}</td>
        <td class="text-right">
          ${r.individual
            ? `<button type="button" class="btn btn--ghost" data-remove-item="${r.item.Id}" aria-label="Remove ${escape(r.item.Name)}">✕</button>`
            : `<span class="text-small text-muted" title="Remove it from the group or remove the group">via group</span>`}
        </td>
      </tr>`).join("")
      : `<tr><td colspan="6" class="table-empty">${all.length ? "No products match your search." : "This customer cannot order any product yet."}</td></tr>`;
    updateBulk();
  }

  function updateBulk() {
    const n = t("products").querySelectorAll("input:checked").length;
    t("bulk").hidden = n === 0;
    t("bulkCount").textContent = `${n} selected`;
  }

  function render() {
    renderGroups();
    renderProducts();
  }

  // ----- Actions -----
  t("assignGroup").addEventListener("click", () => {
    const available = data.productGroups.filter((g) => !access.groupIds.includes(g.id));
    CIM.openPicker({
      title: "Assign product groups",
      description: `${customer.DisplayName} will be able to order every product in the selected groups.`,
      items: available.map((g) => ({ id: g.id, title: g.name, subtitle: g.description, meta: `${g.itemIds.length} products` })),
      emptyText: "This customer already has every group.",
      confirmLabel: (n) => (n > 1 ? `Assign ${n} groups` : "Assign group"),
      onConfirm(ids) {
        access.groupIds.push(...ids);
        render();
        CIM.toast(`${ids.length} ${ids.length === 1 ? "group" : "groups"} assigned.`);
      }
    });
  });

  t("addProducts").addEventListener("click", () => {
    const current = new Set(data.allowedItemIdsFor(customer.Id));
    CIM.openPicker({
      title: "Add products",
      description: "Add products this customer can order, outside of any group.",
      searchPlaceholder: "Search by SKU or name",
      filterLabel: "categories",
      items: data.items.filter((i) => !current.has(i.Id)).map((i) => ({
        id: i.Id, title: i.Name, subtitle: i.Sku, meta: CIM.money(i.UnitPrice), filter: i.Category
      })),
      emptyText: "No products found.",
      confirmLabel: (n) => (n ? `Add ${n} ${n === 1 ? "product" : "products"}` : "Add products"),
      onConfirm(ids) {
        access.itemIds.push(...ids);
        render();
        CIM.toast(`${ids.length} ${ids.length === 1 ? "product" : "products"} added.`);
      }
    });
  });

  t("copyFrom").addEventListener("click", () => {
    CIM.openPicker({
      title: "Copy products from another customer",
      description: "Their groups and individual products are added to this customer. Nothing is removed.",
      searchPlaceholder: "Search customers",
      multiple: false,
      items: data.customers.filter((c) => c.Id !== customer.Id).map((c) => ({
        id: c.Id, title: c.DisplayName, subtitle: c.PrimaryEmailAddr, meta: `${data.allowedItemIdsFor(c.Id).length} products`
      })),
      confirmLabel: "Copy products",
      onConfirm([id]) {
        const source = data.accessFor(id);
        access.groupIds = Array.from(new Set([...access.groupIds, ...source.groupIds]));
        access.itemIds = Array.from(new Set([...access.itemIds, ...source.itemIds]));
        render();
        CIM.toast(`Products copied from ${data.customers.find((c) => c.Id === id).DisplayName}.`);
      }
    });
  });

  element.addEventListener("click", (event) => {
    const removeGroup = event.target.closest("[data-remove-group]");
    if (removeGroup) {
      const g = group(removeGroup.dataset.removeGroup);
      access.groupIds = access.groupIds.filter((id) => id !== g.id);
      render();
      CIM.toast(`Group "${g.name}" removed.`);
    }
    const removeItem = event.target.closest("[data-remove-item]");
    if (removeItem) {
      access.itemIds = access.itemIds.filter((id) => id !== removeItem.dataset.removeItem);
      render();
      CIM.toast(`${item(removeItem.dataset.removeItem).Name} removed.`);
    }
  });

  t("products").addEventListener("change", updateBulk);
  t("bulkRemove").addEventListener("click", () => {
    const ids = Array.from(t("products").querySelectorAll("input:checked")).map((i) => i.value);
    access.itemIds = access.itemIds.filter((id) => !ids.includes(id));
    render();
    CIM.toast(`${ids.length} ${ids.length === 1 ? "product" : "products"} removed.`);
  });
  t("productSearch").addEventListener("input", renderProducts);

  // ----- Orders tab -----
  const orders = data.estimates.filter((e) => e.customerId === customer.Id).map((e) => data.findEstimate(e.id));
  element.querySelectorAll("[data-orders-badge]").forEach((el) => (el.textContent = orders.length));
  t("orders").innerHTML = orders.length ? orders.map((e) => `
    <tr>
      <td><strong>${escape(e.poNumber)}</strong></td>
      <td>${date(e.txnDate)}</td>
      <td class="mono">${e.id}</td>
      <td><span class="badge badge--${e.status}">${data.statusLabels[e.status]}</span></td>
      <td class="num">${CIM.money(e.total)}</td>
    </tr>`).join("")
    : '<tr><td colspan="5" class="table-empty">No orders placed through the portal yet.</td></tr>';

  render();
});
