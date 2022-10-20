sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/core/BusyIndicator",
    'sap/m/MessageToast',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, BusyIndicator, MessageToast) {
        "use strict";

        return Controller.extend("sp.smartpacking.controller.vMain", {
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            onInit() {
                var fechaActual = new Date();
                this.getView().byId("pickerDespacho1").setDateValue(fechaActual);
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
            btnOpenVolcado: function () {
                
                var v_items_seleccionados = this.getView().byId('List_table_Volcado').getSelectedContexts();
                console.log('v_items_seleccionados');	
                console.log(v_items_seleccionados);	

                console.log('e');	

                var T_BINES = [];
                
                var v_turno = this.byId("cmb_registro_volcado_turno").getSelectedKey(); 
                var v_hora = this.byId("timepicker_registro_volcado_hora").getProperty("value");
                var v_fecha = this.byId("datepicker_registro_volcado_fecha").getProperty("value");

                console.log('v_turno');
                console.log(v_turno);
                console.log('v_hora');
                console.log(v_hora);
                console.log('v_fecha');
                console.log(v_fecha);
                
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

                T_BINES = JSON.stringify(T_BINES);
                
                var url;            
                console.log('a');
                //url = "https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/BV/20221014/1101/0040/0";
                url = "https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/CV/20221014/1101/0040/0";
                console.log('url1');
                console.log(url);

                console.log('T_BINES');
                console.log(T_BINES);

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
                                
                                url = "https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/BV/20221014/1101/0040/0";
                                console.log('url2: ');
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
                                        
                                        var data = {value: result.ITAB[0].TI_VOLC};
                                        console.log('data');
                                        console.log(data);
                                        var oModel = new sap.ui.model.json.JSONModel();
                                        oModel.setData(data);
                                        this.getView().byId("table_volcados_generados").setModel(oModel, "Model_Table_List_Volcado_Generados");

                                        this.getSplitAppObj().to(this.createId("page_vista_volcado"));
                                        this.byId("dialog_registro_volcado").close();  
                                        
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


                /*
                $.ajax({
                    type: "GET",
                    url: url,
                    timeout: 0,
                    data: T_BINES;
                    headers: { "Authorization": "Basic Y29uc3VsdG9yOlJjb20yMDIyKio=" },
                    success: function (result) 
                    {            
                        BusyIndicator.hide();    
                        console.log('result');
                        console.log(result);
                        
                        var data = {value: result.ITAB[0].TI_VOLC};

                        console.log(data);
                        
                        var oModel = new sap.ui.model.json.JSONModel();
                        oModel.setData(data);
                        
                        this.getView().byId("table_volcados_generados").setModel(oModel, "Model_Table_List_Volcado_Generados");
                        
                    }.bind(this),
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        BusyIndicator.hide();
                        MessageToast.show("No se encontraron registros ("+ textStatus + "_" + errorThrown + "_" + XMLHttpRequest.status + ")");
                        console.log("Status: " + textStatus);
                        console.log("Error: " + errorThrown);
                        console.log(XMLHttpRequest);
                    }
                });

                this.getSplitAppObj().to(this.createId("page_vista_volcado"));
                this.byId("dialog_registro_volcado").close();  
                */

                              
            },
            btnListGR: function () {
                this.getSplitAppObj().to(this.createId("page_vista_volcado"));
            },
            rowSelectionChangeVolcadosGenerados: function () {
                var url;            
                console.log('a');
                url = "https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/DV/20221014/1101/0040/VL00001";
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
            onPress_buscar_volcado: function() {
                var url;            
                console.log('a');
                url = "https://dsap.lacalera.com.pe/sap/bc/zsagw_smart/Smart/BV/20221014/1101/0040/0";
                //url = "sap/bc/zsagw_smart/Smart/DV/20221014/1101/0040/VL00001";
                //url = "sap/bc/zsagw_smart/Smart/BV/20221014/1101/0040/0";
                //url = "sap/bc/zsagw_smart/Smart/BV/20221014/1101/0040/0";

                /*
                var v_Sociedad = this.byId("cmb_sede_AS_portal_cli").getProperty("value"); 
                var v_Fecha_Entrega_Desde = this.byId("txt_fecha_entrega_desde_AS_portal_cli").getProperty("value");
                var v_Fecha_Entrega_Hasta = this.byId("txt_fecha_entrega_hasta_AS_portal_cli").getProperty("value");
                
                var v_Cod_Cli = this.byId("txt_codigo_cliente_AS_portal_cli").getProperty("value");
                var v_Nro_Pedido = this.byId("txt_nro_pedido_AS_portal_cli").getProperty("value");
                var v_Nro_Entrega = this.byId("txt_nro_entrega_portal_cli").getProperty("value");
                var v_Puerto_Embarque = this.byId("txt_puerto_embarque_AS_portal_cli").getProperty("value");
                var v_Puerto_Destino = this.byId("txt_puerto_destino_AS_portal_cli").getProperty("value");
                
                var v_soc_filtro;
                var v_cod_cli_filtro;
                var v_nro_pedido_filtro;
                var v_nro_entrega_filtro;
                var v_pto_embarque_filtro;
                var v_pto_destino_filtro;
                
                if(v_Fecha_Entrega_Desde == '' || v_Fecha_Entrega_Desde.length != 10)
                {
                    MessageToast.show("La fecha de entrega (Desde) es obligatoria para la búsqueda en portal de clientes");
                    return;
                }
                if(v_Fecha_Entrega_Hasta == '' || v_Fecha_Entrega_Hasta.length != 10)
                {
                    MessageToast.show("La fecha de entrega (Hasta) es obligatoria para la búsqueda en portal de clientes");
                    return;
                }

                
                if(v_Sociedad == "") {v_soc_filtro = "0"}
                else {v_soc_filtro = v_Sociedad;}

                if(v_Cod_Cli == "") {v_cod_cli_filtro = "0"}
                else 
                {
                    v_cod_cli_filtro = v_Cod_Cli.padStart(10, 0);
                } 

                if(v_Nro_Pedido == "") {v_nro_pedido_filtro = "0"}
                else {v_nro_pedido_filtro = v_Nro_Pedido;}

                if(v_Nro_Entrega == "") {v_nro_entrega_filtro = "0"}
                else 
                {
                    v_nro_entrega_filtro = v_Nro_Entrega.padStart(10, 0);
                }

                if(v_Puerto_Embarque == "") {v_pto_embarque_filtro = "0"}
                else {v_pto_embarque_filtro = v_Puerto_Embarque;}

                if(v_Puerto_Destino == "") {v_pto_destino_filtro = "0"}
                else {v_pto_destino_filtro = v_Puerto_Destino;}

                var v_fecha_desde_dia = v_Fecha_Entrega_Desde.substr(0,2);
                var v_fecha_desde_mes = v_Fecha_Entrega_Desde.substr(3,2);
                var v_fecha_desde_anio = v_Fecha_Entrega_Desde.substr(6,4);
                var v_fecha_hasta_dia = v_Fecha_Entrega_Hasta.substr(0,2);
                var v_fecha_hasta_mes = v_Fecha_Entrega_Hasta.substr(3,2);
                var v_fecha_hasta_anio = v_Fecha_Entrega_Hasta.substr(6,4);
                
                //url = "http://nvirlmodevqa.viru.com.pe:8020/sap/bc/zdm_ent/Entre/LIS/0/20190101/20211231?sap-client=200";
                //url = "sap/bc/zdm_ent/Entre/LIS/0/20190101/20211231?sap-client=200"; //QAS S4 200

                //url = "http://nvirlmodevqa.viru.com.pe:8020/sap/bc/zdm_ent/Entre/LIS/" + v_soc_filtro + "/" + v_cod_cli_filtro + "/" + v_nro_pedido_filtro + "/" + v_nro_entrega_filtro + "/" + v_pto_embarque_filtro + "/" + v_pto_destino_filtro + "/" + v_fecha_desde_anio + v_fecha_desde_mes + v_fecha_desde_dia + "/" + v_fecha_hasta_anio + v_fecha_hasta_mes + v_fecha_hasta_dia + "?sap-client=250";//QAS S4 250
               

                
                if(v_despliegue == 'QAS250')
                {
                    url = "sap/bc/zdm_ent/Entre/LIS/" + v_soc_filtro + "/" + v_cod_cli_filtro + "/" + v_nro_pedido_filtro + "/" + v_nro_entrega_filtro + "/" + v_pto_embarque_filtro + "/" + v_pto_destino_filtro + "/" + v_fecha_desde_anio + v_fecha_desde_mes + v_fecha_desde_dia + "/" + v_fecha_hasta_anio + v_fecha_hasta_mes + v_fecha_hasta_dia + "?sap-client=250";//QAS S4 250    
                }
                else if(v_despliegue == 'QAS200')
                {
                    url = "sap/bc/zdm_ent/Entre/LIS/" + v_soc_filtro + "/" + v_cod_cli_filtro + "/" + v_nro_pedido_filtro + "/" + v_nro_entrega_filtro + "/" + v_pto_embarque_filtro + "/" + v_pto_destino_filtro + "/" + v_fecha_desde_anio + v_fecha_desde_mes + v_fecha_desde_dia + "/" + v_fecha_hasta_anio + v_fecha_hasta_mes + v_fecha_hasta_dia + "?sap-client=200";//QAS S4 200    
                }
                else if(v_despliegue == 'PRD300')
                {
                    url = "sap/bc/zdm_ent/Entre/LIS/" + v_soc_filtro + "/" + v_cod_cli_filtro + "/" + v_nro_pedido_filtro + "/" + v_nro_entrega_filtro + "/" + v_pto_embarque_filtro + "/" + v_pto_destino_filtro + "/" + v_fecha_desde_anio + v_fecha_desde_mes + v_fecha_desde_dia + "/" + v_fecha_hasta_anio + v_fecha_hasta_mes + v_fecha_hasta_dia + "?sap-client=300";//PRD S4 300
                }
                else
                {
                    url = "sap/bc/zdm_ent/Entre/LIS/" + v_soc_filtro + "/" + v_cod_cli_filtro + "/" + v_nro_pedido_filtro + "/" + v_nro_entrega_filtro + "/" + v_pto_embarque_filtro + "/" + v_pto_destino_filtro + "/" + v_fecha_desde_anio + v_fecha_desde_mes + v_fecha_desde_dia + "/" + v_fecha_hasta_anio + v_fecha_hasta_mes + v_fecha_hasta_dia + "?sap-client=300";//PRD S4 300
                }*/
                
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
                         
                        var data = {value: result.ITAB[0].TI_SAL_BV};

                        console.log(data);
                        
                        var oModel = new sap.ui.model.json.JSONModel();
                        oModel.setData(data);
                        
                        this.getView().byId("List_table_Volcado").setModel(oModel, "Model_Table_List_Volcado");
                        
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
        });
    });
