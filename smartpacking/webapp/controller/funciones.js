sap.ui.define([
	'sap/m/MessageBox'
], function (MessageBox) {
	"use strict";

	var oMessageTemplate = new sap.m.MessagePopoverItem({
		type: '{type}',
		title: '{title}',
		// description: '{description}',
		subtitle: '{subtitle}',
		counter: '{counter}',
		groupName: '{group}'
			// link: oLink
	});

	var Formato = {

		filtrar_peso: function (peso_guia, peso_recepcion) {
			var oModelmyParam = this.getModel("myParam");
			var TIPO_PESO = oModelmyParam.getProperty("/TIPO_NOTIFICACION");
			switch (TIPO_PESO) {
			case "G":
				return peso_guia;
			case "B":
				return peso_recepcion;
			}
		},
		fnCalcularFechaActual: function () {
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1;
			var yyyy = today.getFullYear();
			dd = (dd < 10 ? '0' : '') + dd;
			mm = (mm < 10 ? '0' : '') + mm;
			var FECHA = dd + "/" + mm + "/" + yyyy;
			return FECHA;
		},
		fnCalcularJuliano: function (FECHA) {
			var sMes = parseInt(FECHA.substring(5, 7)) - 1;
			var lv_date = new Date(FECHA.substring(0, 4), sMes, FECHA.substring(8, 10));
			var lv_date_ini = new Date(lv_date.getFullYear(), '00', '01');
			const diffTime = Math.abs(lv_date.getTime() - lv_date_ini.getTime());
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			var v_i = diffDays + 1;
			var v_julian = String(lv_date.getFullYear()).substring(3, 4) + '' + v_i;
			return v_julian;
		},
		fnTransformarFecha: function (FECHA, sTipo) {
			var fecha;
			if (FECHA != "" && FECHA != undefined) {
				switch (sTipo) {
				case 0: //	FECHA	2019-07-26		->	dd/mm/aaaa
					fecha = FECHA.substring(8, 10) + "/" + FECHA.substring(5, 7) + "/" + FECHA.substring(0, 4);
					break;
				case 1: //	FECHA	2019-07-26		->	aaaammdd
					fecha = FECHA.substring(0, 4) + FECHA.substring(5, 7) + FECHA.substring(8, 10);
					break;
				case 2: //	FECHA	dd/mm/aaaa		->	aaaammdd
					fecha = FECHA.substring(6, 10) + FECHA.substring(3, 5) + FECHA.substring(0, 2);
					break;
				}
			} else {

			}
			return fecha;

		},
		fnAjaxPOST: function (that, T_CARGA, ID, F1, F2, F3, F4, F5, F6, F7) {
			var result;
			var oModel = that.getView().getModel("myParam");
			var texto = "/DEV/sap/bc/ZSDWS_CL_SIST_DESPACHO" + ID + "/" + F1 + "/" + F2 + "/" + F3 + "/" + F4 + "/" + F5 + "/" + F6 + "/" + F7;
			$.ajax(texto, {
				type: 'GET',
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {
					var token = xhr.getResponseHeader("X-CSRF-Token");
					$.ajax(texto, {
						type: 'POST',
						data: T_CARGA,
						async: false,
						beforeSend: function (xhr) {
							xhr.setRequestHeader('X-CSRF-Token', token);
						},
						success: function (response) {
							oModel.setProperty("/RESPONSE", response);
							result = "PS";
						},
						error: function (response) {
							oModel.setProperty("/ERROR_RESPONSE", response.responseJSON.ITAB);
							result = "PE";
						}
					});
				},
				success: function (response) {},
				error: function (response) {
					oModel.setProperty("/ERROR_RESPONSE", response.responseText);
					result = "GE";
				}
			});
			return result;
		},
		fnAjaxGet: function (that, ID, F1, F2, F3, F4, F5, F6, F7) {
			var oModel = that.getView().getModel("myParam");
			var result;
			var texto = "/DEV/sap/bc/ZSDWS_CL_SIST_DESPACHO" + ID + "/" + F1 + "/" + F2 + "/" + F3 + "/" + F4 + "/" + F5 + "/" + F6 + "/" + F7;
			console.log(texto);
			$.ajax(texto, {
				type: 'GET',
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {},
				success: function (response) {
					// console.log(response);
					oModel.setProperty("/RESPONSE", response);
					result = "GS";
				},
				error: function (response) {
					console.log(response);
					oModel.setProperty("/ERROR_RESPONSE", response.responseJSON.ITAB);
					result = "GE";
				}
			});
			return result
		},
		fnMessageBoxInfo: function (that, StringMessage, StringCabecera) {
			var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.information(
				StringMessage, {
					title: StringCabecera,
					styleClass: bCompact ? "sapUiSizeCompact" : ""
				}
			);
		},
		fnMessageBoxSuccess: function (that, StringMessage, StringCabecera) {
			var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.success(
				StringMessage, {
					title: StringCabecera,
					styleClass: bCompact ? "sapUiSizeCompact" : ""
				}
			);
		},
		fnError: function (that) {
			// var vthis = that;
			var oModelp = that.getView().getModel("myParam");
			var errormsg = {};
			var objetoA = [];
			var nerror = oModelp.getProperty("/ERROR_RESPONSE/length");

			oModelp.setProperty("/mockdata", objetoA);
			var verror;
			for (var i = 0; i < nerror; i++) {
				errormsg = {};
				if (oModelp.getProperty("/ERROR_RESPONSE/" + i + "/TYPE") == "E") {
					verror = "Error";
				} else {
					verror = "Warning";
				}
				errormsg.type = verror;
				errormsg.title = oModelp.getProperty("/ERROR_RESPONSE/" + i + "/ID") + " - NUMBER: " + oModelp.getProperty("/ERROR_RESPONSE/" + i +
					"/NUMBER");
				errormsg.subtitle = oModelp.getProperty("/ERROR_RESPONSE/" + i + "/MESSAGE");
				errormsg.description = oModelp.getProperty("/ERROR_RESPONSE/" + i + "/MESSAGE");
				errormsg.group = oModelp.getProperty("/ERROR_RESPONSE/" + i + "/TYPE");
				objetoA.push(errormsg);
			}
			oModelp.setProperty("/mockdata", objetoA);
			this.fnDialogMessage(that);
		},
		fnErrorMsjSimple: function (that) {
			// var vthis = that;
			var oModelp = that.getView().getModel("myParam");
			var errormsg = {};
			var objetoA = [];
			var nerror = oModelp.getProperty("/ERROR_RESPONSE/length");
			var sMensaje = "";
			oModelp.setProperty("/mockdata", objetoA);
			var verror;
			for (var i = 0; i < nerror; i++) {
				errormsg = {};
				if (oModelp.getProperty("/ERROR_RESPONSE/" + i + "/TYPE") == "E") {
					verror = "Error";
				} else {
					verror = "Warning";
				}
				errormsg.type = verror;
				errormsg.title = oModelp.getProperty("/ERROR_RESPONSE/" + i + "/ID") + " - NUMBER: " + oModelp.getProperty("/ERROR_RESPONSE/" + i +
					"/NUMBER");
				errormsg.subtitle = oModelp.getProperty("/ERROR_RESPONSE/" + i + "/MESSAGE");
				sMensaje = sMensaje + oModelp.getProperty("/ERROR_RESPONSE/" + i + "/MESSAGE");
				errormsg.description = oModelp.getProperty("/ERROR_RESPONSE/" + i + "/MESSAGE");
				errormsg.group = oModelp.getProperty("/ERROR_RESPONSE/" + i + "/TYPE");
				objetoA.push(errormsg);
			}
			return sMensaje;
		},
		fnDialogMessage: function (that) {
			// var that = this;
			// this.oMessageView.navigateBack();
			// this.oDialog.open();
			var oModel = that.getView().getModel("myParam");

			var oBackButton = new sap.m.Button({
				icon: sap.ui.core.IconPool.getIconURI("nav-back"),
				visible: false,
				press: function () {
					that.oMessageView.navigateBack();
					that.setVisible(false);
				}
			});
			//PROBAR
			that.oMessageView = new sap.m.MessageView({
				showDetailsPageHeader: false,
				itemSelect: function () {
					oBackButton.setVisible(true);
				},
				items: {
					path: '/mockdata',
					template: oMessageTemplate
				},
				groupItems: true
			});

			that.oMessageView.setModel(oModel);

			that.oDialog = new sap.m.Dialog({
				content: that.oMessageView,
				contentHeight: "440px",
				contentWidth: "640px",
				endButton: new sap.m.Button({
					text: "Close",
					press: function () {
						that.oDialog.close();
					}.bind(that)
				}),
				customHeader: new sap.m.Bar({
					contentMiddle: [
						new sap.m.Text({
							text: "Error en Guardar Nuevo Lote Proceso"
						})
					],
					contentLeft: [oBackButton]
				}),
				verticalScrolling: false
			});

			that.oDialog.open();
		}
	};

	return Formato;

}, /* bExport= */ true);