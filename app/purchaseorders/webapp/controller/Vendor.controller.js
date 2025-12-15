sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
 return Controller.extend("com.ust.purchaseorders.controller.Vendor", {
  onBack: function () {
   this.getOwnerComponent().getRouter().navTo("RouteCard");
  }
 });
});
