/*
 * estimate-actions: opens a confirmation <dialog> and changes the order status.
 * Used for Cancel on the customer order page (approve / reject happen in QuickBooks).
 *   <button data-dialog-open="cancel-dialog">
 *   <dialog id="cancel-dialog" data-new-status="cancelled" data-history="Cancelled by …"
 *           data-toast="…" data-reason-field="cancellationReason">
 * Rails: form_with posting to EstimatesController#cancel.
 */
CIM.register("estimate-actions", (element) => {
  const show = element.closest('[data-controller~="estimate-show"]') || document.querySelector('[data-controller~="estimate-show"]');

  element.addEventListener("click", (event) => {
    const opener = event.target.closest("[data-dialog-open]");
    if (opener) {
      const dialog = document.getElementById(opener.dataset.dialogOpen);
      dialog.querySelector("form").reset();
      dialog.showModal();
      return;
    }
    if (event.target.closest("[data-dialog-close]")) {
      event.target.closest("dialog").close();
    }
  });

  element.querySelectorAll("dialog").forEach((dialog) => {
    const form = dialog.querySelector("form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const extra = {};
      const reason = form.querySelector("textarea");
      if (dialog.dataset.reasonField && reason) extra[dialog.dataset.reasonField] = reason.value.trim();

      show.estimate.setStatus(dialog.dataset.newStatus, dialog.dataset.history, extra);
      dialog.close();
      CIM.toast(dialog.dataset.toast);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
});
