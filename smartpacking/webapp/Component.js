sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "sp/smartpacking/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("sp.smartpacking.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                var oData = { 
                    "datavRFQItems":[
                        {"ITEM_SOLPED": "",
                        "AREA_FUNCIONAL": "",
                        "CEGE": "",
                        "POS_PRESUP":"",
                        "SOCIEDAD":"",
                        "VERSION":"",
                        "CECO":"",
                        "MES":"",
                        "VALOR":"",
                        "FONDO":"",
                        "ESTADO_PAC":"2222",
                        "ANIO_PAC":""}
                        
                    ],
                    "licitadores":[],

                    "FRQpublicados":[],

                    "FRQpublicados2":[{
                        "RFQ": "70000823",
                        "RFQdesc": "100",
                        "codigoCompania": "2270",
                        "oCompra": "Mandarina",
                        "grupoCompra": "Mandarina Tipo 1",
                        "valorObj": "100 000.00",
                        "fechaLimite": "01/06/2022",
                        "estado": "Publicado"
                    },
                    {
                        "RFQ": "70000824",
                        "RFQdesc": "200",
                        "codigoCompania": "2270",
                        "oCompra": "Mandarina",
                        "grupoCompra": "Mandarina Tipo 2",
                        "valorObj": "100 000.00",
                        "fechaLimite": "01/06/2022",
                        "estado": "Publicado"
                    },
                    {
                        "RFQ": "70000825",
                        "RFQdesc": "200",
                        "codigoCompania": "2270",
                        "oCompra": "Mandarina",
                        "grupoCompra": "Mandarina Tipo 3",
                        "valorObj": "100 000.00",
                        "fechaLimite": "01/06/2022",
                        "estado": "Publicado"
                    },
                    {
                        "RFQ": "70000826",
                        "RFQdesc": "200",
                        "codigoCompania": "2270",
                        "oCompra": "Mandarina",
                        "grupoCompra": "Mandarina",
                        "valorObj": "100 000.00",
                        "fechaLimite": "01/06/2022",
                        "estado": "Publicado"
                    }],
                    "FRQvolcados2":[{
                        "RFQ": "VL000823",
                        "RFQdesc": "100",
                        "lote": "2272",
                        "oCompra": "Mandarina",
                        "grupoCompra": "Mandarina Tipo 1",
                        "valorObj": "100 000.00",
                        "fechaLimite": "01/06/2022",
                        "estado": "Publicado"
                    },
                    {
                        "RFQ": "VL000824",
                        "RFQdesc": "200",
                        "lote": "2273",
                        "oCompra": "Mandarina",
                        "grupoCompra": "Mandarina Tipo 2",
                        "valorObj": "100 000.00",
                        "fechaLimite": "01/06/2022",
                        "estado": "Publicado"
                    }],
                    "FRQvolcados3":[{
                        "RFQ": "VL000823",
                        "RFQdesc": "200",
                        "lote": "2272",
                        "oCompra": "70000824",
                        "grupoCompra": "Mandarina Tipo 1",
                        "valorObj": "100 000.00",
                        "fechaLimite": "01/06/2022",
                        "estado": "Publicado"
                    },
                    {
                        "RFQ": "VL000823",
                        "RFQdesc": "200",
                        "lote": "2273",
                        "oCompra": "70000825",
                        "grupoCompra": "Mandarina Tipo 2",
                        "valorObj": "100 000.00",
                        "fechaLimite": "01/06/2022",
                        "estado": "Publicado"
                    },
                    {
                        "RFQ": "VL000823",
                        "RFQdesc": "200",
                        "lote": "2273",
                        "oCompra": "70000826",
                        "grupoCompra": "Mandarina Tipo 2",
                        "valorObj": "100 000.00",
                        "fechaLimite": "01/06/2022",
                        "estado": "Publicado"
                    }],
                    "aplicarCotizacion":[
                        {"articulo":"10", "fecha":"01/06/2022","text":"acido fosforico","material":"acido fosforico","articuloRFQ":"70000823/10","cotsolicitado":"1000","cantidadCot":"1000","cantidadOto":"0.00","precioPedido":"80","valorCot":"80000"},
                        {"articulo":"11","fecha":"01/06/2022","text":"adaptador 2 UPR","material":"adaptador 2 UPR","articuloRFQ":"70000823/11","cotsolicitado":"1000","cantidadCot":"1000","cantidadOto":"0.00","precioPedido":"80","valorCot":"80000"}
                    ],
                    "tbCotizacion":[
                        {"citaProvT":"cotizacion interna","citaProvC":"700105","citaT":"articulo 105","citaC":"105","valorNeto":"80000","estado":"entregado","diaEntrega":"12/01/2022","creadoPor":"Siv Mandowara","finComer":"no","nombreCreador":"Siv Mandowara","creadoEn":"11/18/2021","pais":"PER","tipoDoc":"cotizacion interna","nombre":"Acido A","RFQ":"70000819"},
                        {"citaProvT":"cotizacion interna","citaProvC":"700108","citaT":"articulo 108","citaC":"108","valorNeto":"60000","estado":"entregado","diaEntrega":"12/10/2022","creadoPor":"Siv Mandowara","finComer":"no","nombreCreador":"Siv Mandowara","creadoEn":"11/19/2021","pais":"PER","tipoDoc":"cotizacion interna","nombre":"Acido A","RFQ":"70000820"}
                    ],
                    "dataComparar":[
                        {"citaProv":"8000015","provedor":"FERROSALT SA","direccion":"Los Cedros 209,San Isidro Lima","estado":"Presentado","valorTotal":"75 000.00","fechaCot":"12/21/2021","totalArt":"1000","precioArt":"75","titulo":"acido fosforico","subtitulo":"70000823/10","picIcon":"./img/acido.png","nombreProv":"FERROSALT SA","ancho":"40","altoq":"30","peso":"35"},
                        {"citaProv":"8000016","provedor":"FERRO PLAST INTERNATIONAL","direccion":"Av. 28 de Julio 878","estado":"Presentado","valorTotal":"80 000.00","fechaCot":"12/20/2021","totalArt":"1000","precioArt":"80","titulo":"acido fosforico","subtitulo":"70000823/10","picIcon":"./img/acido.png","nombreProv":"FERRO PLAST INTERNATIONAL","ancho":"40","altoq":"30","peso":"35"},
                    ],
                    "dataAdminCoti":[
                        {"cotiP":"8000015","RFQ":"abastecimiento interno (70000823)","RFQdescrip":"Demo RFQ","proveedor":"FERROSALT SA","totalCoti":"75 000.00","fechaCoti":"01/06/2022","estado":"Galardonado","fechaCotiLimite":"19/05/2022","validoDesde":"","validoHasta":"","valorObj":"0.00"}
                    ],
                    "crearOrdenData":[
                        {"articulo":"10","categoriaA":"","material":"acido fosforico","textC":"acido fosforico","grupoM":"2520003","planta":"8103","cantidadO":"1000","pecioO":"75 000.00","precioU":"75.00","valorO":"75 000.00","estado":""}
                    ],

                    // datos de grafico de proceso
                    "nodes": [
                        {
                            "id": "1",
                            "lane": "0",
                            "title": "Peticion de oferta (RFQ 70000823)",
                            "children": [ 10, 11 ],
                            "state": "Positive",
                            "stateText": "PUBLICADO",
                            "focused": true,
                            "texts": [ "Creado en: 19/05/2022", "Fecha final de cotización: 01/06/2022" ]
                        }, {
                            "id": "10",
                            "lane": "1",
                            "title": "Cotizacion del proveedor (8000015)",
                            "children": [ 20 ],
                            "state": "Positive",
                            "stateText": "ADJUDICADO",
                            "focused": false,
                            "texts": [ "Día de entrega: 30/05/2022", "Cotización: 8000015" ]
                        }, {
                            "id": "11",
                            "lane": "1",
                            "title": "Cotizacion del proveedor (8000016)",
                            "children": null,
                            "state": "Critical",
                            "stateText": "PRESENTADO",
                            "focused": false,
                            "texts": [ "Día de entrega: - ", "Cotización: - " ]
                        }, {
                            "id": "20",
                            "lane": "2",
                            "title": "Orden de compra (4500001010)",
                            "children": null,
                            "state": "Positive",
                            "stateText": "ORDEN CREADA",
                            "focused": false,
                            "texts": [ "Creado en: 19/05/2022", "Cotización: 8000015" ]
                        }
                    ],
                    "lanes": [
                        {
                            "id": "0",
                            "icon": "sap-icon://collaborate",
                            "label": "Abastecimiento",
                            "position": 0
                        }, {
                            "id": "1",
                            "icon": "sap-icon://employee-approvals",
                            "label": "Ofertas",
                            "position": 1
                        }, {
                            "id": "2",
                            "icon": "sap-icon://document-text",
                            "label": "Procesamiento de pedidos de compra",
                            "position": 2
                        }
                    ],
                    "pruebaData":[
                        {"palet":"palet 1"},
                        {"palet":"palet 2"},
                        {"palet":"palet 3"},
                        {"palet":"palet 4"},
                        {"palet":"palet 5"}
                    ],
                    "dataPalet":[]
                        
                        
                };
                var oModel = new sap.ui.model.json.JSONModel(oData);
                this.setModel(oModel);
                this.setModel(oModel, "myParam"); 
            }
        });
    }
);