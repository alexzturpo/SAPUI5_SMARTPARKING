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
                var fechaActual = new Date();
                this.getView().byId("pickerDespacho1").setDateValue(fechaActual);
            },
            onAdministrarC: function () {
                this.getRouter().getTargets().display("TargetApp");
            },
            onCrearOrden: function () {
                this.getRouter().getTargets().display("Target_v4ACrearOrden");
            },
    });
});