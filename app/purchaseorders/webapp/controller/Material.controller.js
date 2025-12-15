sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
 return Controller.extend("com.ust.purchaseorders.controller.Material", {
    onInit(){},
  onBack() {
   this.getOwnerComponent().getRouter().navTo("RouteCard");
  }
 });
});
