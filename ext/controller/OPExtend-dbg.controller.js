/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/mvc/ControllerExtension",
	"sap/m/MessageToast",
	"cus/sd/so/create/auto/xtrctns1/ext/controller/ApplicationLogController",
	"cus/sd/so/create/auto/xtrctns1/ext/controller/ChangeDocController"
], function (
	ControllerExtension,
	MessageToast,
	ApplicationLogController,
	ChangeDocController
) {
	"use strict";
	return ControllerExtension.extend("cus.sd.so.create.auto.xtrctns1.ext.controller.OPExtend", {
		// this section allows to extend lifecycle hooks or override public methods of the base controller
		override: {
			extension: {
				// viewState: {
				// 	retrieveAdditionalStates: function (mAdditionalStates) {
				// 		mAdditionalStates.sCurrentCompanyCode = "0001";
				// 	},
				// 	applyAdditionalStates: function (mAdditionalStates) {
				// 		if (mAdditionalStates.sCurrentCompanyCode) {

				// 		}
				// 	}
				// }
				// intentBasedNavigation: {
				// 	adaptNavigationContext: function(oSelectionVariant, sSemanticObject, sAction) {
				// 		Log.info(
				// 			"adaptNavigationContext extension called with semantic object: " + sSemanticObject + " and action: " + sAction
				// 		);
				// 		oSelectionVariant.removeSelectOption("HasDraftEntity");
				// 	}
				// }
			},
			// Provide own onInit which is executed after the original onInit
			onInit: function () {
				// just for demo reasons
				//this.uiModel = this.base.getExtensionAPI().getModel("ui");
				// var oAppComponent = this.base.getAppComponent();
				if (ApplicationLogController.oComp === undefined) {
					ApplicationLogController.oComp = sap.ui.getCore().createComponent({
						name: "sap.nw.core.applogs.lib.reuse.applogs",
						id: sap.ui.core.Fragment.createId("appLogFragment", "LogMessagesControlComponent"),
						settings: {
							"persistencyKey": "ApplicationLog",
							"showHeader": false,
							"showFilterBar": false,
							"logDataServiceUrl": "/sap/opu/odata/sap/APL_LOG_MANAGEMENT_SRV/"
						}
					});
				}

				//Exit and return to the app again, the reuse component will be create again.That results an error
				if (ChangeDocController.oComp === undefined) {
					var oDate = new Date();
					oDate.setDate(1);
					oDate.setMonth(1);

					ChangeDocController.oComp = sap.ui.getCore().createComponent({
						name: "sap.nw.core.changedocs.lib.reuse.changedocscomponent",
						id: sap.ui.core.Fragment.createId("changDocFragment", "ChangeDocControlComponent"),
						settings: {
							"objectClass": ["SD_SLSORDREQ"],
							"objectId": [],
							"startDate": oDate,
							"stIsAreaVisible": true
						}
					});
					ChangeDocController.oComp.init();
				}

			},
			// Try to replace a private method tagged as not final -> This is currently not allowed
			onPageReady: function () {}
		}
	});
});