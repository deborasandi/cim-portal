/*
 * product-group: one group (?id=g1) with its products and the customers that have it.
 * Changing the group's products changes what every customer in it can order.
 * Rails: Admin::ProductGroupsController#show / #update / #destroy, with nested
 * product_group_items and customer_product_groups.
 */
CIM.register("product-group", (element) => {
  const data = window.CIM_MOCK;
  const params = new URLSearchParams(window.location.search);
  const t = (name) => CIM.target(element, "product-group", name);
  const escape = (value) =>
    String(value ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  let group;
  if (params.get("new") === "1") {
    group = { id: "new", name: params.get("name") || "New group", description: params.get("description") || "", itemIds: [] };
    data.productGroups.push(group);
    CIM.toast("Group created. Now add products and customers.");
  } else {
    group = data.productGroups.find((g) => g.id === params.get("id")) || data.productGroups[0];
  }

  function renderHeader() {
    document.title = `${group.name} · CIM Portal`;
    element.querySelectorAll("[data-group-name]").forEach((el) => (el.textContent = group.name));
    t("description").textContent = group.description || "No description.";
  }

  function renderProducts() {
    const items = group.itemIds.map((id) => data.items.find((i) => i.Id === id)).filter(Boolean)
      .sort((a, b) => a.Sku.localeCompare(b.Sku));
    element.querySelectorAll("[data-products-badge]").forEach((el) => (el.textContent = items.length));
    t("products").innerHTML = items.length ? items.map((i) => `
      <tr>
        <td class="mono">${escape(i.Sku)}</td>
        <td>${escape(i.Name)}<div class="text-small text-muted">${escape(i.Category)}</div></td>
        <td class="num">${CIM.money(i.UnitPrice)}</td>
        <td class="text-right"><button type="button" class="btn btn--ghost" data-remove-item="${i.Id}" aria-label="Remove ${escape(i.Name)}">✕</button></td>
      </tr>`).join("")
      : '<tr><td colspan="4" class="table-empty">No products in this group yet.</td></tr>';
  }

  function renderCustomers() {
    const all = data.customersInGroup(group.id);
    const term = t("customerSearch").value.trim().toLowerCase();
    const list = all.filter((c) => `${c.DisplayName} ${c.PrimaryEmailAddr} ${c.Id}`.toLowerCase().includes(term));
    element.querySelectorAll("[data-customers-badge]").forEach((el) => (el.textContent = all.length));
    t("customers").innerHTML = list.length ? list.map((c) => `
      <tr>
        <td><a href="../customers/show.html?id=${c.Id}"><strong>${escape(c.DisplayName)}</strong></a>
          <div class="text-small text-muted">${escape(c.PrimaryEmailAddr)}</div></td>
        <td class="mono">${c.Id}</td>
        <td class="text-right"><button type="button" class="btn btn--ghost" data-remove-customer="${c.Id}" aria-label="Remove ${escape(c.DisplayName)} from the group">✕</button></td>
      </tr>`).join("")
      : `<tr><td colspan="3" class="table-empty">${all.length ? "No customers match your search." : "No customers have this group yet."}</td></tr>`;
  }

  function render() {
    renderHeader();
    renderProducts();
    renderCustomers();
  }

  t("addProducts").addEventListener("click", () => {
    CIM.openPicker({
      title: `Add products to "${group.name}"`,
      description: "Every customer in this group will be able to order them.",
      searchPlaceholder: "Search by SKU or name",
      filterLabel: "categories",
      items: data.items.filter((i) => !group.itemIds.includes(i.Id)).map((i) => ({
        id: i.Id, title: i.Name, subtitle: i.Sku, meta: CIM.money(i.UnitPrice), filter: i.Category
      })),
      confirmLabel: (n) => (n ? `Add ${n} ${n === 1 ? "product" : "products"}` : "Add products"),
      onConfirm(ids) {
        group.itemIds.push(...ids);
        render();
        CIM.toast(`${ids.length} ${ids.length === 1 ? "product" : "products"} added to the group.`);
      }
    });
  });

  t("addCustomers").addEventListener("click", () => {
    CIM.openPicker({
      title: `Add customers to "${group.name}"`,
      description: "They will be able to order every product in this group.",
      searchPlaceholder: "Search customers",
      items: data.customers.filter((c) => !data.accessFor(c.Id).groupIds.includes(group.id)).map((c) => ({
        id: c.Id, title: c.DisplayName, subtitle: c.PrimaryEmailAddr, meta: `QB #${c.Id}`
      })),
      confirmLabel: (n) => (n ? `Add ${n} ${n === 1 ? "customer" : "customers"}` : "Add customers"),
      onConfirm(ids) {
        ids.forEach((id) => data.accessFor(id).groupIds.push(group.id));
        render();
        CIM.toast(`${ids.length} ${ids.length === 1 ? "customer" : "customers"} added to the group.`);
      }
    });
  });

  element.addEventListener("click", (event) => {
    const removeItem = event.target.closest("[data-remove-item]");
    if (removeItem) {
      group.itemIds = group.itemIds.filter((id) => id !== removeItem.dataset.removeItem);
      render();
      CIM.toast("Product removed from the group.");
    }
    const removeCustomer = event.target.closest("[data-remove-customer]");
    if (removeCustomer) {
      const access = data.accessFor(removeCustomer.dataset.removeCustomer);
      access.groupIds = access.groupIds.filter((id) => id !== group.id);
      render();
      CIM.toast("Customer removed from the group.");
    }
  });

  t("customerSearch").addEventListener("input", renderCustomers);

  // Edit name / description
  const editDialog = document.getElementById("edit-group-dialog");
  t("edit").addEventListener("click", () => {
    editDialog.querySelector('[name="name"]').value = group.name;
    editDialog.querySelector('[name="description"]').value = group.description;
    editDialog.showModal();
  });
  editDialog.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.target.reportValidity()) return;
    group.name = event.target.elements.name.value.trim();
    group.description = event.target.elements.description.value.trim();
    editDialog.close();
    render();
    CIM.toast("Group updated.");
  });

  // Delete
  const deleteDialog = document.getElementById("delete-group-dialog");
  t("delete").addEventListener("click", () => {
    deleteDialog.querySelector("[data-delete-count]").textContent = data.customersInGroup(group.id).length;
    deleteDialog.showModal();
  });
  deleteDialog.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    window.location.href = "index.html?deleted=1";
  });

  document.querySelectorAll("dialog [data-dialog-close]").forEach((button) =>
    button.addEventListener("click", () => button.closest("dialog").close()));

  render();
});
