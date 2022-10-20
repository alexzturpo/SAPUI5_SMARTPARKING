sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/core/Core"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, Core) {
        "use strict";

        return Controller.extend("sp.smartpacking.controller.vProveedorRFQ", {
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            onInit() {
                
                
            },
            onApp: function () {
                this.getRouter().getTargets().display("TargetApp");
            },
            onCotizacion: function () {
                this.getRouter().getTargets().display("Target_vAplicarCotizacion");
            },
            onCompararC2: function () {
                var oView = this.getView();
                if (!this.d2Comparar) {
                    this.d2Comparar = Fragment.load({
                        id: oView.getId(),
                        name: "sp.smartpacking.view.fragments.compararCotizacion2",
                        controller: this
                    }).then(function (oDialog) { 
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this.d2Comparar.then(function (oDialog) {
                    oDialog.open(); 
                });
                var fechaActual = new Date();
                Core.byId("picker2").setDateValue(fechaActual);
                // this.getRouter().getTargets().display("TargetvMain");
            },
            onD2Cancelar: function () {
                var oModel = this.getView().getModel("myParam"); 
                console.log("cancelar D2");
                this.byId("d2CompararID").close();
            }
            // FragmentPublicarRFQ: function () {
            //     var oView = this.getView();
            //     if (!this.d1RFQ) {
            //         this.d1RFQ = Fragment.load({
            //             id: oView.getId(),
            //             name: "sp.smartpacking.view.fragments.publicarRFQ",
            //             controller: this
            //         }).then(function (oDialog) { 
            //             oView.addDependent(oDialog);
            //             return oDialog;
            //         });
            //     }
            //     this.d1RFQ.then(function (oDialog) {
            //         oDialog.open(); 
            //     });
            //     this.getRouter().getTargets().display("TargetvMain");
            // },
            // onAceptarD1: function () { 
            //     console.log("PUBLICAR");
            //     this.byId("d1PublicarRFQ").close();
            // },
            // onCancelarD1: function () {
            //     var oModel = this.getView().getModel("myParam"); 
            //     this.byId("d1PublicarRFQ").close();
            // },
            // onPublicar: function () {
            //     console.log("PUBLICAR");
            // },
        });
    });