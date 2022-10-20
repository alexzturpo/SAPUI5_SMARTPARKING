sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment) {
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
            onPremiar: function () {
                var oModel = this.getView().getModel("myParam"); 
                var vetor = [
                    {"citaProv":"8000015","provedor":"FERROSALT SA","direccion":"Los Cedros 209,San Isidro Lima","estado":"Concedido","valorTotal":"75 000.00","fechaCot":"12/21/2021","totalArt":"1000","precioArt":"75","titulo":"acido fosforico","subtitulo":"70000823/10","picIcon":"./img/acido.png","nombreProv":"FERROSALT SA","ancho":"40","altoq":"30","peso":"35"},
                    {"citaProv":"8000016","provedor":"FERRO PLAST INTERNATIONAL","direccion":"Av. 28 de Julio 878","estado":"Presentado","valorTotal":"80 000.00","fechaCot":"12/20/2021","totalArt":"1000","precioArt":"80","titulo":"acido fosforico","subtitulo":"70000823/10","picIcon":"./img/acido.png","nombreProv":"FERRO PLAST INTERNATIONAL","ancho":"40","altoq":"30","peso":"35"},
                ]; 
                oModel.setProperty("/dataComparar", vetor); 
            },
            onCompararC: function () {
                var oView = this.getView();
                if (!this.d2Comparar) {
                    this.d2Comparar = Fragment.load({
                        id: oView.getId(),
                        name: "sp.smartpacking.view.fragments.compararCotizacion",
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
            onD2Aceptar: function () { 
                console.log("Aceptar D2");
                this.byId("d2CompararID").close();
            },
            onD2Cancelar: function () {
                var oModel = this.getView().getModel("myParam"); 
                console.log("cancelar D2");
                this.byId("d2CompararID").close();
            }, 
        });
    });