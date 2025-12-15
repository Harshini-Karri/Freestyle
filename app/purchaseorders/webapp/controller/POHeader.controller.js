sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
 return Controller.extend("com.ust.purchaseorders.controller.POHeader", {
  onBack() {
   this.getOwnerComponent().getRouter().navTo("RouteCard");
  }
 });
});
