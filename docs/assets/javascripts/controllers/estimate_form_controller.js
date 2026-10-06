/*
 * estimate-form: fills customer data coming from QuickBooks and fakes the submit.
 * With data-mode="edit" on the form it loads the order from ?id=<estimate id>.
 * Rails: EstimatesController#create builds the Estimate and calls the
 * QuickBooks API (POST /v3/company/{realmId}/estimate) in a background job.
 */
CIM.register("estimate-form", (element) => {
  const data = window.CIM_MOCK;
  const customer = data.customers.find((c) => c.Id === data.currentCustomerId);

  const shipVia = element.querySelector('[name="estimate[ship_method]"]');
  data.shipMethods.forEach((method) => {
    const option = document.createElement("option");
    option.textContent = method;
    shipVia.appendChild(option);
  });

  const fill = (name, value) => {
    const field = element.querySelector(`[name="${name}"]`);
    if (field) field.value = value ?? "";
  };

  fill("estimate[customer_name]", customer.DisplayName);
  fill("estimate[bill_email]", customer.PrimaryEmailAddr);
  fill("estimate[sales_term]", customer.SalesTermRef.name);
  fill("estimate[txn_date]", new Date().toISOString().slice(0, 10));
  fill("estimate[ship_addr][line1]", customer.ShipAddr.Line1);
  fill("estimate[ship_addr][city]", customer.ShipAddr.City);
  fill("estimate[ship_addr][state]", customer.ShipAddr.CountrySubDivisionCode);
  fill("estimate[ship_addr][postal_code]", customer.ShipAddr.PostalCode);
  fill("estimate[ship_addr][country]", customer.ShipAddr.Country);

  const editing = element.dataset.mode === "edit";
  const estimate = editing ? data.findEstimate(new URLSearchParams(window.location.search).get("id")) : null;

  if (editing) {
    const s = estimate.shipAddr;
    fill("estimate[po_number]", estimate.poNumber);
    fill("estimate[po_revision]", estimate.poRevision);
    fill("estimate[txn_date]", estimate.txnDate);
    fill("estimate[contact_name]", estimate.contactName);
    fill("estimate[bill_email]", estimate.billEmail);
    fill("estimate[ship_addr][name]", s.name);
    fill("estimate[ship_addr][attn]", s.attn);
    fill("estimate[ship_addr][line1]", s.line1);
    fill("estimate[ship_addr][city]", s.city);
    fill("estimate[ship_addr][state]", s.state);
    fill("estimate[ship_addr][postal_code]", s.postalCode);
    fill("estimate[ship_addr][country]", s.country);
    fill("estimate[ship_addr][phone]", s.phone);
    fill("estimate[ship_addr][email]", s.email);
    fill("estimate[ship_method]", estimate.shipMethod);
    fill("estimate[carrier_account]", estimate.carrierAccount);
    fill("estimate[fob]", estimate.fob);
    fill("estimate[customer_memo]", estimate.memo);

    document.title = `Edit order ${estimate.poNumber} · CIM Portal`;
    element.ownerDocument.querySelectorAll("[data-po-number]").forEach((el) => (el.textContent = estimate.poNumber));
    element.ownerDocument.querySelectorAll("[data-show-link]").forEach((el) => (el.href = `show.html?id=${estimate.id}`));

    // The PDF already sent stays attached unless the customer uploads a new one
    const dropzone = element.querySelector(".dropzone");
    CIM.target(dropzone, "file-upload", "name").textContent = `${estimate.pdf} (current file, drop a new PDF to replace it)`;
    dropzone.classList.add("has-file");
  }

  const billAddr = CIM.target(element, "estimate-form", "billAddr");
  const b = customer.BillAddr;
  billAddr.innerHTML = `${customer.DisplayName}<br>${b.Line1}<br>${b.City}, ${b.CountrySubDivisionCode} ${b.PostalCode}<br>${b.Country}`;

  element.addEventListener("submit", (event) => {
    event.preventDefault();
    const pdf = element.querySelector('[name="estimate[purchase_order_pdf]"]');
    if (!pdf.files.length && !editing) {
      CIM.toast("Please attach your Purchase Order PDF.");
      pdf.closest(".dropzone").scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!element.reportValidity()) return;
    window.location.href = editing ? `show.html?id=${estimate.id}&updated=1` : "index.html?submitted=1";
  });
});
