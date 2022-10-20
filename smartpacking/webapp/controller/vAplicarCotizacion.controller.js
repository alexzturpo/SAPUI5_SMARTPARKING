sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment) {
        "use strict";

        return Controller.extend("sp.smartpacking.controller.vAplicarCotizacion", {
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            onInit() {
            },
            onApp: function () {
                this.getRouter().getTargets().display("TargetApp");
            },
            onAceptarAplicarCotizacion: function () {
                this.getRouter().getTargets().display("TargetApp");
            },
            onCompararC2: function () {
                var oView = this.getView();
                if (!this.d2Comparar) {
                    this.d2Comparar = Fragment.load({
                        id: oView.getId(),
                        name: "sp.smartpacking.view.fragments.publicarRFQ",
                        controller: this
                    }).then(function (oDialog) { 
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this.d2Comparar.then(function (oDialog) {
                    oDialog.open(); 
                });
                // this.getRouter().getTargets().display("TargetvMain");
            },
            onD2Cancelar: function () {
                var oModel = this.getView().getModel("myParam"); 
                console.log("cancelar D2");
                this.byId("d2CompararID").close();
            }
    });
});