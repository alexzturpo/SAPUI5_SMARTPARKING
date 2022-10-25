sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/core/BusyIndicator", 
    "sap/ui/model/json/JSONModel",
    'sap/m/MessageToast'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, BusyIndicator,JSONModel,MessageToast) {
        "use strict";

        return Controller.extend("sp.smartpacking.controller.vAdministrarC", {
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            onInit() {
            },
            onApp: function () {
                this.getRouter().getTargets().display("TargetApp");
            },
            onIngresar: function () {
                this.getRouter().getTargets().display("Target_v4CotizacionInfo");
            },
            onCrearOrden: function () {
                this.getRouter().getTargets().display("Target_v4ACrearOrden");
            },
            onCompararC2: function () {
                var v_fecha = this.byId("pickerTb1").getProperty("value"); 
                var v_almacen = this.byId("idAlmacentb").getSelectedKey();

                if(v_fecha !== "" && v_almacen !== ""){
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
                }else{ 
                    MessageToast.show("Ingrese la  fecha y seleccione un almacen correctamente");
                };
                // this.getRouter().getTargets().display("TargetvMain");
            },
            onD2Cancelar: function () {
                var oModel = this.getView().getModel("myParam"); 
                console.log("cancelar D2");
                this.byId("d2CompararID").close();
            },

            // DATOS
            onAfterRendering: function () {
                console.log("onAfterRendering"); 
                var datos = {value: []};    
                this.getView().setModel(new JSONModel(datos), "Model_Table_ProduccionPT")
            },
            // funcion cada ves q cammbian la fecha trae la data de volcado
            handleChange: async function () {
                var oModel = this.getView().getModel("myParam"); 
                console.log("handleChange");                         
                // VARIALES POST 
                var v_fecha = this.byId("picker2").getProperty("value"); 
                var v_almacen = this.byId("idAlmacentb").getSelectedKey();
                let v_centro_principal = oModel.getProperty("/centro_principal");
                
                let datos = await this._data_volcado(v_fecha,v_centro_principal,v_almacen);
                console.log("handleChange data",datos); 
                oModel.setProperty("/listMaterial", datos); //inserta en el modelo para la lista de data de volcado
            }, 
            _data_volcado: function (v_fecha,v_centro_principal,v_almacen) { 
                console.log("FUNCION _data_volcado"); 
                let url = `https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/BV/${v_fecha}/${v_centro_principal}/${v_almacen}/0`; 
                console.log("_data_volcado URL",url); 

                return new Promise(function(resolver, rechazar){
                    $.ajax({ 
                        type: "GET",
                        url: url,
                        timeout: 0,
                        headers: { "Authorization": "Basic Y29uc3VsdG9yOlJjb20yMDIyKio=" }, 
                        success : function(data){resolver(data.ITAB[0].TI_SAL_BV)}.bind(this),
                        error : function(error){rechazar(`ERROR  dataVolcado ${error}`)}.bind(this)
                    });   
                });
            
            },

            onD2GuardarProducto: function () {
                var oModel = this.getView().getModel("myParam");                          
                // VARIALES POST 
                var v_fecha = this.byId("pickerTb1").getProperty("value"); 
                var v_almacen = this.byId("idAlmacentb").getSelectedKey();
                let v_centro_principal = oModel.getProperty("/centro_principal");
                let obj = {
                    v_centro_principal,
                    v_fecha,
                    v_almacen
                }
                console.log(obj);
 
                console.log('btnOpenAgregarVolcado');	  
                var T_BINES_ARR = {};
                var T_BINES = [];
                var T_BINES_RES = [];
                
                var v_fechaf = this.byId("picker2").getProperty("value");  
                var v_material = this.byId("idMaterial").getSelectedKey(); 
                var v_lote = this.byId("idLotePRD").getSelectedKey(); 
                var v_responsable = this.byId("responsable").getProperty("value");
                var v_cliente = this.byId("cliente").getProperty("value");
                var v_turno = this.byId("turno").getProperty("value");
                var v_etiqueta = this.byId("idEtiqueta").getSelectedKey(); 
                var v_total = this.byId("total").getProperty("value");

                var row = {};  
                row.fecha = v_fechaf;
                row.material = v_material;
                row.lote = v_lote;
                row.responsable = v_responsable;
                row.cliente = v_cliente; 
                row.turno = v_turno; 
                row.etiqueta = v_etiqueta; 
                row.total = v_total; 

                T_BINES.push(row);    
                T_BINES_ARR.VOLCADO = T_BINES;
                T_BINES_RES = JSON.stringify(T_BINES_ARR); 
                BusyIndicator.show(0); 
                // let url = "https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/BV/20221014/1101/0040/0";
                let url = `https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/BV/${v_fecha}/${v_centro_principal}/${v_almacen}/0`; 
                console.log('url2: ', url); 
                BusyIndicator.show(0);
                $.ajax({
                    type: "POST",
                    data: T_BINES_RES,
                    url: url,
                    timeout: 0,
                    headers: { "Authorization": "Basic Y29uc3VsdG9yOlJjb20yMDIyKio=" },
                    success: function (result) 
                    {            
                        BusyIndicator.hide();    
                        // console.log("result",result);
                        
                        // var data = {value: result.ITAB[0].TI_VOLC};
                        // console.log('data actual',data);
                        // // console.log(data);
                        // var oModel = new sap.ui.model.json.JSONModel();
                        // oModel.setData(data); 
                        // this.getView().byId("table01comparar_ProduccionPT").setModel(oModel, "Model_Table_ProduccionPT"); 
                        this.byId("d2CompararID").close();   
                        this.OnBuscarResgistro();

                        
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
            OnBuscarResgistro:function(){
                console.log("OnBuscarResgistro");
                var oModel = this.getView().getModel("myParam");                          
                let v_cp = oModel.getProperty("/centro_principal") 
                var v_fecha = this.byId("pickerTb1").getProperty("value");  
                var v_almacen = this.byId("idAlmacentb").getSelectedKey(); 

                let obj = {
                    v_cp,
                    v_fecha,
                    v_almacen
                }
                console.log(obj);


                let url = `https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/BPTE/${v_fecha}/${v_cp}/${v_almacen}/0`;
                console.log("URL GET BUSCAR", url);
                BusyIndicator.show(0);
                $.ajax({
                    type: "GET",
                    url: url,
                    timeout: 0,
                    headers: { "Authorization": "Basic Y29uc3VsdG9yOlJjb20yMDIyKio=" },
                    success: function (result) 
                    {            
                        BusyIndicator.hide();    
                        console.log("result",result);
                        var data = {value: result.ITAB};
                        console.log('data actual',data);
                        var oModel = new sap.ui.model.json.JSONModel(); 
                        oModel.setData(data); 
                        this.getView().byId("table01comparar_ProduccionPT").setModel(oModel, "Model_Table_ProduccionPT"); 
                                              

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
