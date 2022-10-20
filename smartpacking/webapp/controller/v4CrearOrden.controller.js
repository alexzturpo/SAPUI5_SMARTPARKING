sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment) {
        "use strict";

        return Controller.extend("sp.smartpacking.controller.v4CotizacionInfo", {
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            onInit() { 
                // this.oProcessFlow2 = oView.byId("processflow2");
                var fechaActual = new Date();
                this.getView().byId("pickerDespacho1").setDateValue(fechaActual);
            },
            onAfterRendering() {
                // this.onHeaderPress();
            },
            onZoomIn: function () {
                this.getView().byId("processflow2").zoomIn(); 
            },
            onZoomOut: function () {
                this.getView().byId("processflow2").zoomOut(); 
            },
            onvAdministrarC: function () {
                this.getRouter().getTargets().display("Target_vAdministrarC");
            },
            onCrear: function () {
                this.getRouter().getTargets().display("Target_vAdministrarC");
            },
            FragmentPublicarRFQ: function () {
                var oView = this.getView();
                if (!this.d1RFQ) {
                    this.d1RFQ = Fragment.load({
                        id: oView.getId(),
                        name: "sp.smartpacking.view.fragments.publicarRFQ",
                        controller: this
                    }).then(function (oDialog) { 
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this.d1RFQ.then(function (oDialog) {
                    oDialog.open(); 
                });
                // this.getRouter().getTargets().display("TargetvMain");
            },
            onAceptarD1: function () { 
                console.log("PUBLICAR");
                this.byId("d1PublicarRFQ").close();
            },
            onCancelarD1: function () {
                // var oModel = this.getView().getModel("myParam"); 
                this.byId("d1PublicarRFQ").close();
            },
            onPublicar: function () {
                console.log("PUBLICAR");
            },
            onApp: function () {
                this.getRouter().getTargets().display("TargetApp");
            }
        });
    });
