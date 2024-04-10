/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/mvc/ControllerExtension",
	"sap/m/MessageToast",
	"cus/sd/so/create/auto/xtrctns1/ext/controller/UploadController"
], function (
	ControllerExtension,
	MessageToast,
	UploadController
) {
	"use strict";
	return ControllerExtension.extend("cus.sd.so.create.auto.xtrctns1.ext.controller.LRExtend", {
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
				var oAppComponent = this.base.getAppComponent();
				this.oNavigationHandler = oAppComponent.getNavigationService();
				//this.oUploadController = UploadController;
				var oParseNavigationPromise = this.oNavigationHandler.parseNavigation();
				var that = this;
				oParseNavigationPromise.done(function (oAppData, oURLParameters, sNavType) {
					that.handleNavigationParam(oAppData, oURLParameters, sNavType);
				});

				oParseNavigationPromise.fail(function (oError) {
					//that._handleError(oError);
				});

			},
			// Try to replace a private method tagged as not final -> This is currently not allowed
			// onPageReady: function () {},
			// Try to replace a private method (not explicitly flagged) -> Not allowed
			// _getPageTitleInformation: function () {},
			// // Try to override anything in our handlers -> Not allowed
			// handlers: {
			// 	onSearch: function () {}
			// }
		},

		handleNavigationParam: function (oAppData, oURLParameters, sNavType) {
			var oUploadController = UploadController;
			if (!oAppData.oDefaultedSelectionVariant) {
				return;
			}
			
			var aCompanyCodeDefault = oAppData.oDefaultedSelectionVariant.getSelectOption("CompanyCode");
			if (aCompanyCodeDefault && aCompanyCodeDefault.length >= 1) {
				var sDefaultCompanyCode = null;
				for (var i in aCompanyCodeDefault) {
					if (aCompanyCodeDefault[i].Option === "EQ") {
						if (sDefaultCompanyCode === null) {
							sDefaultCompanyCode = aCompanyCodeDefault[i].Low;
						} else {
							sDefaultCompanyCode = null;
							oUploadController.setCurrentCompanyCode(null);
							return;
						}
					}
				}
				oUploadController.setCurrentCompanyCode(sDefaultCompanyCode);
			}
		}
	});
});