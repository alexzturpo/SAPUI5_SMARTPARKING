sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/core/BusyIndicator", 
    "sap/ui/model/json/JSONModel",
    'sap/m/MessageToast',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, BusyIndicator,JSONModel,MessageToast) {
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
            onAfterRendering: function () {
                console.log("onAfterRendering"); 
                var datos = {value: []};    
                this.getView().setModel(new JSONModel(datos), "Model_Table_RecepcionMP")
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
            },


            // DATOS  

            onCompararC2: function () {
                var oModel = this.getView().getModel("myParam");                           
                // VARIALES POST 
                var v_fecha = this.byId("pickerDespacho1").getProperty("value"); 
                var v_material = this.byId("idMaterial").getSelectedKey();
                var v_almacen = this.byId("idVolcado").getSelectedKey();
                let v_centro_principal = oModel.getProperty("/centro_principal");
                let obj = {
                    v_centro_principal,
                    v_fecha,
                    v_almacen,
                    v_material
                }
                console.log(obj);
 
                console.log('btnOpenAgregarVolcado');	  
                var T_BINES_ARR = {};
                var T_BINES = [];
                var T_BINES_RES = [];
                
                var v_fechaf = this.byId("pickerDespacho1").getProperty("value");  
                var v_pedido = this.byId("idMaterial").getSelectedKey(); 
                var v_volcado = this.byId("idVolcado").getSelectedKey();  

                var row = {};  
                row.fecha = v_fechaf;
                row.pedido = v_pedido;
                row.volcado = v_volcado; 

                T_BINES.push(row);    
                T_BINES_ARR.VOLCADO = T_BINES;
                T_BINES_RES = JSON.stringify(T_BINES_ARR);  

                BusyIndicator.show(0); 
                let url = `https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/RMPE/${v_fecha}/${v_centro_principal}/${v_almacen}/0`;
                console.log('url2: ', url); 
                BusyIndicator.show(0);
                $.ajax({
                    type: "GET",
                    data: T_BINES_RES,
                    url: url,
                    timeout: 0,
                    headers: { "Authorization": "Basic Y29uc3VsdG9yOlJjb20yMDIyKio=" },
                    success: function (result) 
                    {            
                        BusyIndicator.hide();    
                        console.log("result",result);
                        
                        var data = {value: result.ITAB};
                        console.log('data actual',data);
                        // console.log(data);
                        var oModel = new sap.ui.model.json.JSONModel();
                        oModel.setData(data); 
                        this.getView().byId("table01comparar_recepcionMP").setModel(oModel, "Model_Table_RecepcionMP"); 
                        // this.byId("d2CompararID").close();  
                        
                        // BusyIndicator.hide();    
                        // console.log("result",result);
                        // var data = {value: result.ITAB};
                        // console.log('data actual',data);
                        // var oModel = new sap.ui.model.json.JSONModel(); 
                        // oModel.setData(data); 
                        // this.getView().byId("table01comparar").setModel(oModel, "Model_Table_Registro_ProduccionPT"); 
                        
                    }.bind(this),
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        BusyIndicator.hide();
                        MessageToast.show("No se encontraron registros ("+ textStatus + "_" + errorThrown + "_" + XMLHttpRequest.status + ")");
                        console.log("Status: " + textStatus);
                        console.log("Error: " + errorThrown);
                        console.log(XMLHttpRequest);
                    }
                });  
                
                

            },
        });
    });
