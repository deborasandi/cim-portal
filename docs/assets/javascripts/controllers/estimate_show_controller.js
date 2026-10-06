/*
 * estimate-show: renders one order (?id=<estimate id>) on the customer order page.
 *   [data-field="x"]          text filled from the view model below
 *   [data-show-when="a b"]    visible only when the status is one of a / b
 *   [data-pdf-link]           href set to the PO PDF; [data-pdf-frame] src for the preview
 *   [data-edit-link]          href set to edit.html?id=<id>
 * Other controllers change the status with element.estimate.setStatus(status, historyText, extra).
 * Rails: EstimatesController#show renders this server side.
 */
CIM.register("estimate-show", (element) => {
  const data = window.CIM_MOCK;
  const params = new URLSearchParams(window.location.search);
  const estimate = data.findEstimate(params.get("id"));
  const samples = element.dataset.samplesPath || "../assets/samples/";
  const itemRefLabel = element.dataset.itemRefLabel || "Your item #";

  const date = (value) =>
    value ? new Date(value + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
  const escape = (value) =>
    String(value || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function fields() {
    const s = estimate.shipAddr;
    return {
      po_number: estimate.poNumber,
      estimate_number: `#${estimate.id}`,
      revision: estimate.poRevision,
      txn_date: date(estimate.txnDate),
      customer_name: estimate.customer.DisplayName,
      customer_email: estimate.customer.PrimaryEmailAddr,
      sales_term: estimate.customer.SalesTermRef.name,
      contact_name: estimate.contactName || "—",
      bill_email: estimate.billEmail,
      ship_method: estimate.shipMethod + (estimate.carrierAccount ? ` · account #${estimate.carrierAccount}` : ""),
      fob: estimate.fob,
      memo: estimate.memo || "No message.",
      subtotal: CIM.money(estimate.total),
      total: CIM.money(estimate.total),
      line_count: `${estimate.lines.length} ${estimate.lines.length === 1 ? "product" : "products"}`,
      pdf_name: estimate.pdf,
      status_label: data.statusLabels[estimate.status],
      rejection_reason: estimate.rejectionReason || "",
      cancellation_reason: estimate.cancellationReason || "No reason given.",
      ship_to: [
        `<strong>${escape(s.name)}</strong>`,
        s.attn && `Attn: ${escape(s.attn)}`,
        escape(s.line1),
        `${escape(s.city)}, ${escape(s.state)} ${escape(s.postalCode)}`,
        escape(s.country),
        s.phone && escape(s.phone),
        s.email && escape(s.email)
      ].filter(Boolean).join("<br>")
    };
  }

  function render() {
    const values = fields();
    document.title = `Order ${estimate.poNumber} · CIM Portal`;

    element.querySelectorAll("[data-field]").forEach((el) => {
      const key = el.dataset.field;
      if (key === "ship_to") el.innerHTML = values.ship_to;
      else el.textContent = values[key];
    });

    element.querySelectorAll('[data-field="status_label"]').forEach((el) => {
      el.className = `badge badge--${estimate.status}`;
    });

    element.querySelectorAll("[data-show-when]").forEach((el) => {
      el.hidden = !el.dataset.showWhen.split(" ").includes(estimate.status);
    });

    element.querySelectorAll("[data-pdf-link]").forEach((el) => (el.href = samples + estimate.pdf));
    element.querySelectorAll("[data-pdf-frame]").forEach((el) => {
      if (!el.src.endsWith(estimate.pdf)) el.src = samples + estimate.pdf;
    });
    element.querySelectorAll("[data-edit-link]").forEach((el) => (el.href = `edit.html?id=${estimate.id}`));

    const lines = CIM.target(element, "estimate-show", "lines");
    lines.innerHTML = estimate.lines.map((line, index) => `
      <tr>
        <td class="text-muted">${index + 1}</td>
        <td>
          <strong>${escape(line.item.Name)}</strong>
          <div class="text-small text-muted"><span class="mono">${escape(line.item.Sku)}</span>${line.customerItemNumber ? ` · ${itemRefLabel} ${escape(line.customerItemNumber)}` : ""}</div>
          <div class="text-small">${escape(line.description)}</div>
        </td>
        <td>${date(line.serviceDate)}</td>
        <td class="num">${line.qty}</td>
        <td class="num">${CIM.money(line.unitPrice)}</td>
        <td class="num"><strong>${CIM.money(line.amount)}</strong></td>
      </tr>`).join("");

    const history = CIM.target(element, "estimate-show", "history");
    history.innerHTML = estimate.history.slice().reverse().map((entry) => `
      <li>
        <span class="timeline__text">${escape(entry.text)}</span>
        <span class="timeline__date">${escape(entry.date)}</span>
      </li>`).join("");

    renderSteps();
  }

  // Progress: Submitted -> In review -> Approved / Rejected / Cancelled -> Closed
  function renderSteps() {
    const steps = CIM.target(element, "estimate-show", "steps");
    if (!steps) return;
    const final = { pending: "Approved", accepted: "Approved", closed: "Approved", rejected: "Rejected", cancelled: "Cancelled" }[estimate.status];
    const reached = { pending: 2, accepted: 3, closed: 4, rejected: 3, cancelled: 3 }[estimate.status];
    const labels = ["Submitted", "In review", final, "Closed"];
    steps.innerHTML = labels.map((label, i) => {
      const n = i + 1;
      let state = n < reached ? "done" : n === reached ? "current" : "todo";
      if (n === 3 && (estimate.status === "rejected" || estimate.status === "cancelled")) state = "stopped";
      if (n === 4 && (estimate.status === "rejected" || estimate.status === "cancelled")) return "";
      return `<li class="steps__item steps__item--${state}"><span class="steps__dot">${state === "done" ? "✓" : state === "stopped" ? "✕" : n}</span>${label}</li>`;
    }).join("");
  }

  element.estimate = {
    data: estimate,
    setStatus(status, historyText, extra) {
      estimate.status = status;
      Object.assign(estimate, extra || {});
      const now = new Date();
      const stamp = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`;
      estimate.history.push({ date: stamp, text: historyText });
      render();
    }
  };

  render();

  if (params.get("updated") === "1") CIM.toast("Your changes were saved.");
});
