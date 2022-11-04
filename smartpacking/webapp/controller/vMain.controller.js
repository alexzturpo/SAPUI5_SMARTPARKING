sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/core/BusyIndicator",
    'sap/m/MessageToast',
    "sap/ui/export/Spreadsheet"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, BusyIndicator, MessageToast, Spreadsheet) {
        "use strict";

        return Controller.extend("sp.smartpacking.controller.vMain", {
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            onInit() {
                
                
            },
            onAfterRendering: async function () {
                var oModel = this.getView().getModel("myParam");  
                let v_centro_principal = oModel.getProperty("/centro_principal");

                var fechaActual = new Date();
                this.getView().byId("cmb_date_buscar_volcado").setDateValue(fechaActual);
                // var url = '';

                //carga material
                let url = `https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/HMAT/0/${v_centro_principal}/0/0`;
                BusyIndicator.show(0);
                $.ajax({
                    type: "GET",
                    url: url,
                    timeout: 0,
                    headers: { "Authorization": "Basic Y29uc3VsdG9yOlJjb20yMDIyKio=" },
                    success: function (result) 
                    {            
                        console.log(result);
                        var oModel = new sap.ui.model.json.JSONModel();
                        var respuesta = result.ITAB;
                        console.log("respuesta Model_cmb_material",respuesta);
                        this.getView().getModel("myParam").setProperty("/Model_cmb_material", respuesta);    
                        if(respuesta.length > 0)
                        {
                            this.byId("cmb_material_buscar_volcado").setSelectedKey(respuesta[0].MATNR);
                        }
                        
                        //carga almacen
                        url = `https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/HALM/0/${v_centro_principal}/0/0`;
                        BusyIndicator.show(0);
                        $.ajax({
                            type: "GET",
                            url: url,
                            timeout: 0,
                            headers: { "Authorization": "Basic Y29uc3VsdG9yOlJjb20yMDIyKio=" },
                            success: function (result) 
                            {            
                                BusyIndicator.hide();    
                                console.log(result);
                                var oModel = new sap.ui.model.json.JSONModel();
                                var respuesta = result.ITAB;
                                console.log("respuesta Model_cmb_almacen",respuesta);
                                this.getView().getModel("myParam").setProperty("/Model_cmb_almacen", respuesta);   
                                if(respuesta.length > 0)
                                {
                                    this.byId("cmb_almacen_buscar_volcado").setSelectedKey(respuesta[0].LGORT);
                                    this.f_buscar_volcado();
                                }                               

                            }.bind(this),
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                BusyIndicator.hide();
                                MessageToast.show("No se encontraron registros ("+ textStatus + "_" + errorThrown + "_" + XMLHttpRequest.status + ")");
                                console.log("Status: " + textStatus);
                                console.log("Error: " + errorThrown);
                                console.log(XMLHttpRequest);
                            }
                        });
                        
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
            f_buscar_volcado: function() {
                var url;            
                console.log('a');
                
                var v_fecha = this.byId("cmb_date_buscar_volcado").getValue();
                var v_material = this.byId("cmb_material_buscar_volcado").getSelectedKey();
                var v_almacen = this.byId("cmb_almacen_buscar_volcado").getSelectedKey();

                var v_centro_principal = this.getView().getModel("myParam").getProperty("/centro_principal");

                console.log(v_fecha);
                console.log(v_material);
                console.log(v_almacen);
                console.log(v_centro_principal);

                if(v_fecha == '')
                {
                    MessageToast.show("La fecha es obligatoria");
                }
                else if(v_material == '')
                {
                    MessageToast.show("El material es obligatorio");
                }
                else if(v_almacen == '')
                {
                    MessageToast.show("El almacén es obligatorio");
                }
                else if(v_centro_principal == '')
                {
                    MessageToast.show("El centro principal es obligatorio");
                }
                else
                { 
                    url = "https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/BV/" + v_fecha + "/"+v_centro_principal+"/" + v_almacen + "/" + v_material;
                    console.log(url);

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
                            
                            var data = {value: result.ITAB[0].TI_SAL_BV};
                            var data2 = {value: result.ITAB[0].TI_VOLC};

                            console.log("data",data);
                            console.log("data2",data2);
                            
                            var oModel = new sap.ui.model.json.JSONModel();
                            oModel.setData(data);
                            this.getView().byId("List_table_Volcado").setModel(oModel, "Model_Table_List_Volcado");

                            // const oModel = {}
                            // this.getView().setModel(new JSONModel(oModel), "Model_Table_List_Volcado") 
                            // (this.getView().getModel("Model_Table_List_Volcado")).setData(data);

                            // const oModel2 = {}
                            // this.getView().setModel(new JSONModel(oModel2), "Model_Table_List_Volcado_Generados") 
                            // (this.getView().getModel("Model_Table_List_Volcado_Generados")).setData(data2);

                            var oModel2 = new sap.ui.model.json.JSONModel();
                            oModel2.setData(data2);
                            this.getView().byId("table_volcados_generados").setModel(oModel2, "Model_Table_List_Volcado_Generados");
                            
                        }.bind(this),
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            BusyIndicator.hide();
                            MessageToast.show("No se encontraron registros ("+ textStatus + "_" + errorThrown + "_" + XMLHttpRequest.status + ")");
                            console.log("Status: " + textStatus);
                            console.log("Error: " + errorThrown);
                            console.log(XMLHttpRequest);
                        }
                    });
                }

            },
            onApp: function () {
                this.getRouter().getTargets().display("TargetApp");
            },
            onModeloRFQ: function () {
                this.getRouter().getTargets().display("Target_vRFQ");
            },
            getSplitAppObj: function () {
                var result = this.byId("SplitAppDemo");
                if (!result) {
                    jQuery.sap.log.info("SplitApp object can't be found");
                }
                return result;
            },
            cancelarVolcado: function () {
                this.getSplitAppObj().to(this.createId("detail0"));
            },
            
            btnOpenAgregarVolcado: function () {
                
                var v_items_seleccionados = this.getView().byId('List_table_Volcado').getSelectedContexts();
                console.log('v_items_seleccionados');	
                console.log(v_items_seleccionados);	

                console.log('e');	
                
                var T_BINES_ARR = {};
                var T_BINES = [];
                var T_BINES_RES = [];
                
                var v_turno = this.byId("cmb_registro_volcado_turno").getSelectedKey(); 
                var v_hora = this.byId("timepicker_registro_volcado_hora").getProperty("value");
                var v_fecha = this.byId("datepicker_registro_volcado_fecha").getProperty("value");

                var v_material = this.byId("cmb_material_buscar_volcado").getSelectedKey();
                var v_almacen = this.byId("cmb_almacen_buscar_volcado").getSelectedKey();
                var v_centro_principal = this.getView().getModel("myParam").getProperty("/centro_principal");

                console.log('v_turno');
                console.log(v_turno);
                console.log('v_hora');
                console.log(v_hora);
                console.log('v_fecha');
                console.log(v_fecha);
                
                console.log('v_material');
                console.log(v_material);
                console.log('v_almacen');
                console.log(v_almacen);
                console.log('v_centro_principal');
                console.log(v_centro_principal);
                

                for (var i = 0; i < v_items_seleccionados.length; i++) {
                    var row = {};
                    
                    var obj_selected = v_items_seleccionados[i].getObject();

                    console.log(obj_selected);
                    console.log(obj_selected.CHARG);   
                    row.matnr = obj_selected.MATNR;
                    row.charg = obj_selected.CHARG;
                    row.clabs = obj_selected.LABST;
                    row.turno = v_turno;
                    row.hora = v_hora;
                    row.fecha = v_fecha;

                    T_BINES.push(row);  
                }

                T_BINES_ARR.VOLCADO = T_BINES;
                T_BINES_RES = JSON.stringify(T_BINES_ARR);
                
                var  url = "https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/CV/" + v_fecha + "/" + v_centro_principal + "/" + v_almacen + "/0";
                console.log('url3');
                console.log(url);

                console.log('T_BINES_RES');
                console.log(T_BINES_RES);

                BusyIndicator.show(0);
               /* $.ajax({
                    type: "GET",
                    async: false,
                    url: url,
                    headers: { "Authorization": "Basic Y29uc3VsdG9yOlJjb20yMDIyKio=" },
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("X-CSRF-Token", "fetch");
                    },
                    complete: function(xhr) {
                        console.log('xhr');
                        console.log(xhr);
                        var token = xhr.getResponseHeader("X-CSRF-Token");
                        console.log('token');
                        console.log(token);
                        */

                        
                        /*$.ajax({
                            type: "POST",
                            data: T_BINES,
                            url: url,
                            headers: { "Authorization": "Basic Y29uc3VsdG9yOlJjb20yMDIyKio=" },                    
                            //beforeSend: function(xhr) { xhr.setRequestHeader("X-CSRF-Token", token); },
                            success: function (result) {          
                                BusyIndicator.hide();    
                                console.log('result');
                                console.log(result);   
                                */
                                
                                url = "https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/CV/" + v_fecha + "/" + v_centro_principal + "/" + v_almacen + "/0";
                                console.log('url2_: ');
                                console.log(url);
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
                                        console.log(result);
                                        
                                        /*var data = {value: result.ITAB[0].TI_VOLC};
                                        console.log('data actual');
                                        console.log(data);
                                        var oModel = new sap.ui.model.json.JSONModel();
                                        oModel.setData(data);
                                        this.getView().byId("table_volcados_generados").setModel(oModel, "Model_Table_List_Volcado_Generados");
                                        */    
                                        this.getSplitAppObj().to(this.createId("page_vista_volcado"));
                                        this.byId("dialog_registro_volcado").close();
                                        
                                        this.f_buscar_volcado();
                                        
                                    }.bind(this),
                                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                                        BusyIndicator.hide();
                                        MessageToast.show("No se encontraron registros ("+ textStatus + "_" + errorThrown + "_" + XMLHttpRequest.status + ")");
                                        console.log("Status: " + textStatus);
                                        console.log("Error: " + errorThrown);
                                        console.log(XMLHttpRequest);
                                    }
                                });

                                
                                
                        /*
                            }.bind(this),
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                BusyIndicator.hide();
                                MessageToast.show("No se encontraron registros ("+ textStatus + "_" + errorThrown + "_" + XMLHttpRequest.status + ")");
                                console.log("Status: " + textStatus);
                                console.log("Error: " + errorThrown);
                                console.log(XMLHttpRequest);
                            }    
                        });
                        */


                    /*    
                    }
                });
                */
                              
            },
            btnListGR: function () {
                this.getSplitAppObj().to(this.createId("page_vista_volcado"));
            },
            rowSelectionChangeVolcadosGenerados: function (e) {
                // var url;            
                // console.log('a');
                // url = "https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/DV/20221014/1101/0040/VL00001";
                // console.log(url);

                var oTable = this.getView().byId("table_volcados_generados")
                var idx = e.getParameter('rowIndex');
                var cxt = oTable.getContextByIndex(idx);
                var path = cxt.sPath;
                var obj = oTable.getModel("Model_Table_List_Volcado_Generados").getProperty(path);
                console.log(obj.ZCOD_VOL);
                
                

                var oModel = this.getView().getModel("myParam");  
                let v_centro_principal = oModel.getProperty("/centro_principal");
                var v_fecha = this.byId("cmb_date_buscar_volcado").getValue(); 
                // var v_fecha = "20221014"; 
                var v_almacen = this.byId("cmb_almacen_buscar_volcado").getSelectedKey();
                var url;            
                console.log('a');
                url = `https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/DV/${v_fecha}/${v_centro_principal}/${v_almacen}/${obj.ZCOD_VOL}`;
                console.log(url);

                BusyIndicator.show(0);
                $.ajax({
                    type: "GET",
                    url: url,
                    timeout: 0,
                    headers: { "Authorization": "Basic Y29uc3VsdG9yOlJjb20yMDIyKio=" },
                    success: function (result) 
                    {            
                        BusyIndicator.hide();    
                        console.log(result);
                         
                        var data = {value: result.ITAB};

                        console.log(data);
                        
                        var oModel = new sap.ui.model.json.JSONModel();
                        oModel.setData(data);
                        
                        this.getView().byId("table_detalle_volcado").setModel(oModel, "Model_Table_List_Detalle_Volcado_Generados");
                        
                    }.bind(this),
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        BusyIndicator.hide();
                        MessageToast.show("No se encontraron registros ("+ textStatus + "_" + errorThrown + "_" + XMLHttpRequest.status + ")");
                        console.log("Status: " + textStatus);
                        console.log("Error: " + errorThrown);
                        console.log(XMLHttpRequest);
                    }
                });
 


                this.getSplitAppObj().to(this.createId("page_detalle_volcado"));
                console.log("nuevo");
            },
            btnCrearVolcado: function () {

                var v_items_seleccionados = this.getView().byId('List_table_Volcado').getSelectedContexts();
                if(v_items_seleccionados.length == 0)
                {
                    MessageToast.show("Seleccione al menos 1 valor");
                }
                else
                {
                    var oView = this.getView();
                    if (!this.dialog_registro_volcado) {
                        this.dialog_registro_volcado = Fragment.load({ 
                            id: oView.getId(), 
                            name: "sp.smartpacking.view.fragments.CrearVolcado", 
                            controller: this}).then(function (oDialog) { 
                            oView.addDependent(oDialog);
                            return oDialog;
                        });
                    }
                    
                    this.dialog_registro_volcado.then(function (oDialog) { oDialog.open(); });
                    // this.getRouter().getTargets().display("TargetvMain");
                }
                
            },
            onCancelarVolcado: function () {
                //var oModel = this.getView().getModel("myParam"); 
                console.log("cancelar dialog_registro_volcado");
                this.byId("dialog_registro_volcado").close();
            },
            // onPress_buscar_volcado: function() {
            //     var oModel = this.getView().getModel("myParam");  
            //     let v_centro_principal = oModel.getProperty("/centro_principal"); 
            //     var v_fecha = "20221014"; 
            //     var v_almacen = this.byId("cmb_almacen_buscar_volcado").getSelectedKey();
            //     var url;            
            //     console.log('a');
            //     url = `https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/BV/${v_fecha}/${v_centro_principal}/${v_almacen}/0`;
            //     console.log(url);

            //     BusyIndicator.show(0);
            //     $.ajax({
            //         type: "GET",
            //         url: url,
            //         timeout: 0,
            //         headers: { "Authorization": "Basic Y29uc3VsdG9yOlJjb20yMDIyKio=" },
            //         success: function (result) 
            //         {            
            //             BusyIndicator.hide();    
            //             console.log("result",result);
                         
            //             var data = {value: result.ITAB[0].TI_SAL_BV};

            //             console.log("data",data);
                        
            //             var oModel = new sap.ui.model.json.JSONModel();
            //             oModel.setData(data);
                        
            //             this.getView().byId("List_table_Volcado").setModel(oModel, "Model_Table_List_Volcado");
                        
            //         }.bind(this),
            //         error: function (XMLHttpRequest, textStatus, errorThrown) {
            //             BusyIndicator.hide();
            //             MessageToast.show("No se encontraron registros ("+ textStatus + "_" + errorThrown + "_" + XMLHttpRequest.status + ")");
            //             console.log("Status: " + textStatus);
            //             console.log("Error: " + errorThrown);
            //             console.log(XMLHttpRequest);
            //         }
            //     });
                
            // }

            // descargar datos de la tabla  
            
            onDownloadTable: function () {
                console.log("onDownloadTable");
                var oCols, OTablaDowload, oSettings, oSheet;
                var nombreArchivo = new Date().toLocaleString("es-ES");  
                
                oCols = this.createColumnConfig(); 
                OTablaDowload = this.getView().byId("table_volcados_generados").getModel("Model_Table_List_Volcado_Generados").getData(); 
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
                    label: 'Código',
                    property: 'ZCOD_VOL',
                    type: 'string'
                });
                oCols.push({
                    label: 'Descripción',
                    property: 'CHARG',
                    type: 'string'
                });
                oCols.push({
                    label: 'Cantidad',
                    property: 'MENGE',
                    type: 'string'
                }); 
    
                return oCols;
            }, 

             // descargar datos de la tabla  
            onDownloadTableGenerado: function () {
                console.log("onDownloadTable");
                var oCols, OTablaDowload, oSettings, oSheet;
                var nombreArchivo = new Date().toLocaleString("es-ES");  
                
                oCols = this.createColumnConfigGenerado(); 
                OTablaDowload = this.getView().byId("table_detalle_volcado").getModel("Model_Table_List_Detalle_Volcado_Generados").getData(); 
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
    
            createColumnConfigGenerado: function () { 
                var oCols = [];
    
                oCols.push({
                    label: 'Código de Volcado',
                    property: 'ZCOD_VOL',
                    type: 'string'
                });
                oCols.push({
                    label: 'Cód. de Material',
                    property: 'MATNR',
                    type: 'string'
                });
                oCols.push({
                    label: 'Descripción',
                    property: 'CHARG',
                    type: 'string'
                }); 
                oCols.push({
                    label: 'Cantidad',
                    property: 'MENGE',
                    type: 'string'
                }); 
                oCols.push({
                    label: 'Lote',
                    property: 'WERKS',
                    type: 'string'
                });  
                return oCols;
            },
        });
    });
