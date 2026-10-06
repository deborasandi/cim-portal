/*
 * product-groups: list of product groups + "New group" dialog.
 * Rails: Admin::ProductGroupsController#index / #new / #create
 */
CIM.register("product-groups", (element) => {
  const data = window.CIM_MOCK;
  const body = CIM.target(element, "product-groups", "body");
  const dialog = document.getElementById("new-group-dialog");
  const escape = (value) =>
    String(value ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  body.innerHTML = data.productGroups.map((g) => {
    const items = g.itemIds.map((id) => data.items.find((i) => i.Id === id));
    const customers = data.customersInGroup(g.id).length;
    return `
      <tr class="row-link" data-href="show.html?id=${g.id}">
        <td>
          <a href="show.html?id=${g.id}"><strong>${escape(g.name)}</strong></a>
          <div class="text-small text-muted">${escape(g.description)}</div>
        </td>
        <td>
          <div class="text-small">${items.slice(0, 3).map((i) => escape(i.Name)).join(", ")}${items.length > 3 ? ` <span class="text-muted">+${items.length - 3} more</span>` : ""}</div>
        </td>
        <td class="num">${items.length}</td>
        <td class="num">${customers}</td>
      </tr>`;
  }).join("");

  body.addEventListener("click", (event) => {
    const row = event.target.closest("[data-href]");
    if (row && !event.target.closest("a")) window.location.href = row.dataset.href;
  });

  element.querySelector("[data-new-group]").addEventListener("click", () => {
    dialog.querySelector("form").reset();
    dialog.showModal();
  });
  dialog.querySelector("[data-dialog-close]").addEventListener("click", () => dialog.close());
  dialog.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.target;
    if (!form.reportValidity()) return;
    const params = new URLSearchParams({ new: "1", name: form.elements.name.value.trim(), description: form.elements.description.value.trim() });
    window.location.href = `show.html?${params}`;
  });

  if (new URLSearchParams(window.location.search).get("deleted") === "1") CIM.toast("Group deleted.");
});
