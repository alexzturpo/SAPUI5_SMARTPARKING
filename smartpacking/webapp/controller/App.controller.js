sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("sp.smartpacking.controller.controller.App", {
        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },
        onInit() {
        },
        onVmain: function () {
            this.getRouter().getTargets().display("TargetvMain");
        },
        onVmain2: function () {
            this.getRouter().getTargets().display("Target_v4ACrearOrden");
        },
        onVproveedores: function () {
            this.getRouter().getTargets().display("Target_vProveedorRFQ");
        },
        onComparar: function () {
            this.getRouter().getTargets().display("Target_vCompararCotizacion");
        },
        onComparar2: function () {
            this.getRouter().getTargets().display("Target_vProveedorRFQ");
        },
        onAdministrarC: function () {
            this.getRouter().getTargets().display("Target_vAdministrarC");
        },
        onProducTerminado: function () {
            this.getRouter().getTargets().display("Target_vAplicarCotizacion");
        },
        onCSV: function () {
            this.getRouter().getTargets().display("Target_vRFQ");
        },
        onImprimir: function () {
            this.getRouter().getTargets().display("Target_v4CotizacionInfo");
        },
      });
    }
  );
  