/*
 * flash: shows the success message after an order is submitted (?submitted=1).
 * Rails: replaced by flash[:notice] rendered in the layout.
 */
CIM.register("flash", (element) => {
  if (new URLSearchParams(window.location.search).get("submitted") === "1") {
    element.hidden = false;
  }
});
