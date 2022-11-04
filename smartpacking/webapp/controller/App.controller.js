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
            var oModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel("myParam", oModel);

            var v_centro_principal = this.byId("cmb_planta_centro_principal").getSelectedKey();
            console.log("v_centro_principal",v_centro_principal); 
            console.log("myParam", this.getView().getModel("myParam"));
            if(this.getView().getModel("myParam") != undefined) { this.getView().getModel("myParam").setProperty("/centro_principal", v_centro_principal); }
            this.importData(v_centro_principal);
        },
        f_change_centro_principal() {
            var v_centro_principal = this.byId("cmb_planta_centro_principal").getSelectedKey();
            this.getView().getModel("myParam").setProperty("/centro_principal", v_centro_principal); 
            // console.log("f_change_centro_principal",v_centro_principal);
            this.importData(v_centro_principal);
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

        // importar data de campos
        importData: async function (v_centro_principal) {
            console.log("importData");   
            console.log("centro_principal", v_centro_principal);

            // importando data de MATERIAL
            let res_material = await this._data_material(v_centro_principal);
            console.log("Material_data_material", res_material);
            this.getView().getModel("myParam").setProperty("/Model_cmb_material", res_material);    
            // importando data de ALMACEN
            let res_almacen = await this._data_almacen(v_centro_principal);
            console.log("Material_data_almacen", res_almacen);
            this.getView().getModel("myParam").setProperty("/Model_cmb_almacen", res_almacen);    

        }, 
        _data_almacen: function (cp) {
            let url =`https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/HALM/0/${cp}/0/0`; 
            return new Promise(function(resolver, rechazar){
                $.ajax({ 
                    type: "GET",
                    url: url,
                    timeout: 0,
                    headers: { "Authorization": "Basic Y29uc3VsdG9yOlJjb20yMDIyKio=" }, 
                    success : function(data){resolver(data.ITAB)}.bind(this),
                    error : function(error){rechazar(`ERROR  dataVolcado ${error}`)}.bind(this)
                });   
            }); 
        },
        _data_material: function (cp) {
            let url = `https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/HMAT/0/${cp}/0/0`; 
            return new Promise(function(resolver, rechazar){
                $.ajax({ 
                    type: "GET",
                    url: url,
                    timeout: 0,
                    headers: { "Authorization": "Basic Y29uc3VsdG9yOlJjb20yMDIyKio=" }, 
                    success : function(data){resolver(data.ITAB)}.bind(this),
                    error : function(error){rechazar(`ERROR  dataVolcado ${error}`)}.bind(this)
                });   
            }); 
        },
      });
    }
  );
  