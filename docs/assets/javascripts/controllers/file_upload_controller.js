/*
 * file-upload: drag & drop for the customer's Purchase Order PDF.
 * Rails: Active Storage (has_one_attached :purchase_order_pdf) +
 * app/javascript/controllers/file_upload_controller.js
 */
CIM.register("file-upload", (element) => {
  const input = element.querySelector('input[type="file"]');
  const fileName = CIM.target(element, "file-upload", "name");
  const maxBytes = 10 * 1024 * 1024;

  function show(file) {
    if (!file) {
      element.classList.remove("has-file");
      return;
    }
    if (file.type !== "application/pdf") {
      CIM.toast("Please upload a PDF file.");
      input.value = "";
      return;
    }
    if (file.size > maxBytes) {
      CIM.toast("The PDF must be 10 MB or smaller.");
      input.value = "";
      return;
    }
    fileName.textContent = `${file.name} (${(file.size / 1024).toFixed(0)} KB)`;
    element.classList.add("has-file");
  }

  input.addEventListener("change", () => show(input.files[0]));
  ["dragenter", "dragover"].forEach((type) =>
    element.addEventListener(type, () => element.classList.add("is-dragover"))
  );
  ["dragleave", "drop"].forEach((type) =>
    element.addEventListener(type, () => element.classList.remove("is-dragover"))
  );
});
