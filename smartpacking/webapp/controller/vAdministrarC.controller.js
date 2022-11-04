sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/core/BusyIndicator", 
    "sap/ui/model/json/JSONModel",
    'sap/m/MessageToast',
    "sap/ui/export/Spreadsheet",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, BusyIndicator,JSONModel,MessageToast,Spreadsheet,Filter, FilterOperator) {
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
                let url = `https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/BPTE/${v_fecha}/${v_centro_principal}/${v_almacen}/0`; 
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

                // https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/BPTE/20221023/1102/0170/0
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
             // descargar datos de la tabla  
             onDownloadTable: function () {
                console.log("onDownloadTable");
                var oCols, OTablaDowload, oSettings, oSheet;
                var nombreArchivo = new Date().toLocaleString("es-ES");  
                
                oCols = this.createColumnConfig(); 
                OTablaDowload = this.getView().byId("table01comparar_ProduccionPT").getModel("Model_Table_ProduccionPT").getData(); 
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
                    label: 'MATERIAL',
                    property: 'MATNR',
                    type: 'string'
                });
                oCols.push({
                    label: 'VARIEDAD',
                    property: 'ZCOD_VOL',
                    type: 'string'
                });
                oCols.push({
                    label: 'CLIENTE',
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

            // input de lotes  funciones 
            onF4PaletNotificacionMP: async function (oEvent) {  
                var that = this;
                var res_palets ;

                var oDialogF4NotificacionMP = new sap.ui.commons.Dialog({ closed: function () { oDialogF4NotificacionMP.destroy(); } });
                oDialogF4NotificacionMP.setTitle("Ayuda de busqueda");
                console.log('a01');
                
                var oFlexBox_nombre = new sap.m.FlexBox({ alignItems: sap.m.FlexAlignItems.Start, justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                     items:
                     [
                         new sap.ui.commons.TextView({ text: "Campo 1: " }), new sap.m.Input({ id: "txt_campo1", width: "400px" }),
                         new sap.ui.commons.TextView({ text: "Campo 2: " }), new sap.m.Input({ id: "txt_campo2", width: "400px" })
                     ]
                });
                oDialogF4NotificacionMP.addContent(oFlexBox_nombre);
                
                // create a button to trigger the upload
                var btn_buscar_f4 = new sap.ui.commons.Button({
                    text: 'Buscar',
                    press: async function () {
                        var  v_campo1 = oFlexBox_nombre.getItems()[1].getValue();
                        if(v_campo1 == "")
                        {
                            MessageToast.show("Ingrese un campo");
                            return;
                        }
                        var    v_campo2 = oFlexBox_nombre.getItems()[3].getValue();
                        if(v_campo2 == "")
                        {
                            MessageToast.show("Ingrese un campo");
                            return;
                        }
                        // consulta oDAta
                        // let v_centro_principal = this.getView().getModel("myParam").getProperty("/centro_principal");
                        res_palets = await that._data_palet("1101");
                        console.log("Material_data_palet", res_palets);
                        // that.getView().getModel("myParam").setProperty("/listaPalets", res_palets); 
                        // lista
                            var oTable = new sap.ui.table.Table("Table_Modal_Palets", {
                                selectionMode: sap.ui.table.SelectionMode.None,
                                selectionBehavior: sap.ui.table.SelectionBehavior.RowOnly,
                                enableColumnReordering: false,
                                cellClick: function (e) {
                                    var idx = e.getParameter('rowIndex');
                                    // console.log(idx);
                                    // var idx_col = e.getParameter('columnIndex'); 
                                    // console.log(idx_col);
                                    var cxt = oTable.getContextByIndex(idx);
                                    var path = cxt.sPath;
                                    var obj = oTable.getModel().getProperty(path); 
                                    console.log(obj);

                                    that.byId("productInput").setValue(obj.LGORT);
                                    that.getView().getModel("myParam").setProperty("/listaPaletsSelect", obj);  
                                    oDialogF4NotificacionMP.close();
                                }
                            });
                            oTable.addColumn(new sap.ui.table.Column({ 
                                width: 'auto',
                                label: new sap.ui.commons.Label({ text: "Sociedad" }),
                                template: new sap.ui.commons.TextView({ text: "{LGORT}" }),
                                resizable: true
                            }));
                            oTable.addColumn(new sap.ui.table.Column({
                                width: 'auto',
                                label: new sap.ui.commons.Label({ text: "Material" }),
                                template: new sap.ui.commons.TextView({ text: "{LGOBE}" }),
                                resizable: true
                            }));
                            var oModel = new sap.ui.model.json.JSONModel();
                            // console.log("res_palets",res_palets)
                            oModel.setData(res_palets); 
                            oTable.setModel(oModel);
                            oTable.bindRows("/"); 
                            oTable.setVisibleRowCount(10); 
                            oDialogF4NotificacionMP.addContent(oTable); 

                    }
                });
                oDialogF4NotificacionMP.addContent(btn_buscar_f4);
                
                var btn_cancelar_f4 = new sap.ui.commons.Button({
                    text: 'Cerrar',
                    press: function () { 
                        oDialogF4NotificacionMP.close();
                    }
                }); 
                oDialogF4NotificacionMP.addContent(btn_cancelar_f4);
    
                oDialogF4NotificacionMP.setModal(true);
                oDialogF4NotificacionMP.open();
                return;
            },  
            _data_palet: function (cp) {
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

            onAgregarPalet: function () {
                console.log("onAgregarPalet");
                var oModel = this.getView().getModel("myParam");
                var aDataPaletSelect = oModel.getProperty("/listaPaletsSelect");
                console.log("aDataaDataPaletSelectPalet",aDataPaletSelect)
                
                var aDataPalet = oModel.getProperty("/dataPalet"); 

                aDataPalet.push(aDataPaletSelect);
                console.log("aDataPalet PUSH",aDataPalet)
                oModel.setProperty("/dataPalet", aDataPalet);
                this.byId("productInput").setValue("");
                
            },
        });
    });
