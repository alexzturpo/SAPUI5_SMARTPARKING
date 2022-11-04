sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment", 
    "sap/ui/core/BusyIndicator", 
    "sap/ui/model/json/JSONModel",
    'sap/m/MessageToast',
    "sap/ui/export/Spreadsheet"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, BusyIndicator,JSONModel,MessageToast,Spreadsheet) {
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
                var v_fecha = this.byId("pickerTb1").getProperty("value"); 
                var v_almacen = this.byId("idAlmacentb").getSelectedKey();

                if(v_fecha !== "" && v_almacen !== ""){
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
                }else{ 
                    MessageToast.show("Ingrese la  fecha y seleccione un almacen correctamente");
                };
            },
            onD2Cancelar: function () {
                var oModel = this.getView().getModel("myParam"); 
                console.log("cancelar D2");
                this.byId("d2CompararID").close();
            },

            // DATOS CARGA 
            onAfterRendering: function () {
                console.log("onAfterRendering"); 
                var datos = {value: []};    
                this.getView().setModel(new JSONModel(datos), "Model_Table_Registro_Cotizacion");
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
                // let url = `https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/BV/20221014/1101/0040/0`; 
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
                // var v_volcado = this.byId("idVolcado").getSelectedKey(); 
                var v_lote = this.byId("idLote").getProperty("value");
                var v_autoClave = this.byId("idAutoclave").getProperty("value");
                var v_batch = this.byId("idBatch").getProperty("value");
                var v_turno = this.byId("idTurno").getProperty("value");
                var v_hora = this.byId("idHora").getProperty("value");
                var v_etiqueta = this.byId("idEtiqueta").getSelectedKey(); 
                var v_total = this.byId("idTotal").getProperty("value");

                var row = {};  
                row.fecha = v_fechaf;
                row.material = v_material;
                row.lote = v_lote;
                row.autoClave = v_autoClave;
                row.batch = v_batch; 
                row.turno = v_turno; 
                row.hora = v_hora; 
                row.etiqueta = v_etiqueta; 
                row.total = v_total; 

                T_BINES.push(row);    

                T_BINES_ARR.VOLCADO = T_BINES;
                T_BINES_RES = JSON.stringify(T_BINES_ARR);  

                BusyIndicator.show(0);  
                // https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/BSTE/20221023/1102/0034/0
                let url = `https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/BSTE/${v_fecha}/${v_centro_principal}/${v_almacen}/0`; 
                // console.log('url2: ', url); 
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
                        // this.getView().byId("table01comparar_Cotizacion").setModel(oModel, "Model_Table_Registro_Cotizacion"); 
                        
                        
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

                // https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/BSTE/20221023/1102/0034/0
                let url = `https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/BSTE/${v_fecha}/${v_cp}/${v_almacen}/0`;
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
                        this.getView().byId("table01comparar_Cotizacion").setModel(oModel, "Model_Table_Registro_Cotizacion"); 
                                              

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
            // descargar datos de la tabla  
            onDownloadTable: function () {
                console.log("onDownloadTable");
                var oCols, OTablaDowload, oSettings, oSheet;
                var nombreArchivo = new Date().toLocaleString("es-ES");  
                
                oCols = this.createColumnConfig(); 
                OTablaDowload = this.getView().byId("table01comparar_Cotizacion").getModel("Model_Table_Registro_Cotizacion").getData(); 
                console.log("OTablaDowload 2",OTablaDowload.value);  
    
                oSettings = {
                    workbook: {
                        columns: oCols
                    },
                    dataSource: OTablaDowload.value,
                    fileName: `Activos ${nombreArchivo}`
                };
    
                oSheet = new Spreadsheet(oSettings);
                oSheet.build()
                    .then(function () {
                        this.getView().setBusy(false);
                        sap.m.MessageToast.show("Se realizó la exportación con éxito.");
                    }.bind(this))
                    .finally(function () {
                        this.getView().setBusy(false);
                        oSheet.destroy();
                    }.bind(this));
            },
    
            createColumnConfig: function () { 
                var oCols = [];
    
                oCols.push({
                    label: 'PRODUCTO INTERMEDIO',
                    property: 'MATNR',
                    type: 'string'
                });
                oCols.push({
                    label: 'LOTE',
                    property: 'ZCOD_VOL',
                    type: 'string'
                });
                oCols.push({
                    label: 'BATCH',
                    property: 'WERKS',
                    type: 'string'
                });
                oCols.push({
                    label: 'AUTOCLAVE',
                    property: 'WERKS',
                    type: 'string'
                });
                oCols.push({
                    label: 'TURNO',
                    property: 'WERKS',
                    type: 'string'
                });
                oCols.push({
                    label: 'HORA',
                    property: 'WERKS',
                    type: 'string'
                });
                oCols.push({
                    label: 'PALLET',
                    property: 'WERKS',
                    type: 'string'
                });
                oCols.push({
                    label: 'ETIQUETA',
                    property: 'WERKS',
                    type: 'string'
                });
    
                return oCols;
            },
    });
});