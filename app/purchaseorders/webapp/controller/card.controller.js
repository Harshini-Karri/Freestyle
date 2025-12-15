sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("purchaseorders.controller.card", {

        onInit() {
            // Initialization code can be placed here



         } ,// End of onInit function
         goVendor(){
            this.getOwnerComponent().getRouter().navTo("Vendor");
        },

        goMaterial() {
            this.getOwnerComponent().getRouter().navTo("Material");
        },

        goPOHeader() {
            this.getOwnerComponent().getRouter().navTo("POHeader");
        },

        goPOItem() {
            this.getOwnerComponent().getRouter().navTo("POItem");
        },
        goInvoice() {
            this.getOwnerComponent().getRouter().navTo("Invoice");
        },
        goGRHeader() {
            this.getOwnerComponent().getRouter().navTo("GR");
        }

        

    });
});



