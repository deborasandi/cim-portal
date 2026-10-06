/*
 * line-items: estimate lines (Estimate.Line[] -> SalesItemLineDetail).
 * Only items allowed for the current customer are listed.
 * Rails: app/javascript/controllers/line_items_controller.js (Stimulus);
 * the allowed items list will be rendered by the server.
 */
CIM.register("line-items", (element) => {
  const data = window.CIM_MOCK;
  const allowedIds = data.allowedItemIdsFor(data.currentCustomerId);
  const items = data.items.filter((item) => allowedIds.includes(item.Id));

  const body = CIM.target(element, "line-items", "body");
  const template = CIM.target(element, "line-items", "template");
  const subtotalEl = CIM.target(element, "line-items", "subtotal");
  const totalEl = CIM.target(element, "line-items", "total");
  const addButton = CIM.target(element, "line-items", "add");

  function fillProductOptions(select) {
    select.innerHTML = '<option value="">Select a product…</option>';
    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.Id;
      option.textContent = `${item.Sku} — ${item.Name}`;
      select.appendChild(option);
    });
  }

  function renumber() {
    body.querySelectorAll("tr").forEach((row, index) => {
      row.querySelector("[data-line-number]").textContent = index + 1;
    });
  }

  function recalc() {
    let subtotal = 0;
    body.querySelectorAll("tr").forEach((row) => {
      const qty = parseFloat(row.querySelector('[name$="[qty]"]').value) || 0;
      const price = parseFloat(row.querySelector('[name$="[unit_price]"]').value) || 0;
      const amount = qty * price;
      row.querySelector("[data-line-amount]").textContent = CIM.money(amount);
      subtotal += amount;
    });
    subtotalEl.textContent = CIM.money(subtotal);
    totalEl.textContent = CIM.money(subtotal);
  }

  function addLine(line) {
    const index = body.querySelectorAll("tr").length;
    const html = template.innerHTML.replaceAll("NEW_INDEX", index);
    body.insertAdjacentHTML("beforeend", html);
    const row = body.lastElementChild;
    fillProductOptions(row.querySelector('[name$="[item_id]"]'));
    if (line) {
      const set = (name, value) => (row.querySelector(`[name$="[${name}]"]`).value = value ?? "");
      set("item_id", line.itemId);
      set("description", line.description);
      set("customer_item_number", line.customerItemNumber);
      set("qty", line.qty);
      set("unit_price", line.unitPrice.toFixed(2));
      set("service_date", line.serviceDate);
    }
    renumber();
    recalc();
  }

  body.addEventListener("change", (event) => {
    if (!event.target.matches('[name$="[item_id]"]')) return;
    const row = event.target.closest("tr");
    const item = items.find((i) => i.Id === event.target.value);
    row.querySelector('[name$="[unit_price]"]').value = item ? item.UnitPrice.toFixed(2) : "";
    row.querySelector('[name$="[description]"]').value = item ? item.Description : "";
    recalc();
  });

  body.addEventListener("input", recalc);

  body.addEventListener("click", (event) => {
    const button = event.target.closest('[data-action="line-items#remove"]');
    if (!button) return;
    if (body.querySelectorAll("tr").length === 1) {
      CIM.toast("An order needs at least one line.");
      return;
    }
    button.closest("tr").remove();
    renumber();
    recalc();
  });

  addButton.addEventListener("click", () => addLine());

  if (items.length === 0) {
    CIM.target(element, "line-items", "empty").hidden = false;
    addButton.disabled = true;
  } else if (element.dataset.mode === "edit") {
    const estimate = data.findEstimate(new URLSearchParams(window.location.search).get("id"));
    estimate.lines.forEach((line) => addLine(line));
  } else {
    addLine();
  }
});
