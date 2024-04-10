/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
	"sap/ui/core/Fragment",
	"cus/sd/so/create/auto/xtrctns1/ext/controller/Utils"
],
function (Fragment, Utils) {
	"use strict";

	var that = {
		oExtensionAPI: null,
		onPressShowChangeDoc: function (oEvent) {
			that.sSalesOrderRequestId = that._padSalesOrderRequestID(oEvent.getObject().SalesOrderRequest);
			that.sCreationTime = oEvent.getObject().CreationDateTime;
			that.oExtensionAPI = this;
			that.oResourceBundle = this.getModel("i18n").getResourceBundle();
			that.changeDocPromise = that.changeDocPromise || that.oExtensionAPI.loadFragment({
				id: "ChangeDocDialog",
				name: "cus.sd.so.create.auto.xtrctns1.ext.Fragments.ChangeDoc",
				controller: that
			});
			that.changeDocPromise.then(function (dialog) {
				that.oExtensionAPI.addDependent(dialog);
			});
			that.changeDocPromise.then(that._loadContent);
		},
		onChangDocButtonClose: function (oEvent) {
			var oDialog = oEvent.getSource().getParent();
			oDialog.close();
			that.oExtensionAPI.removeDependent(oDialog);
		},
		_loadContent: function (dialog) {
			var oLogContainter = Utils.getObjectById("ChangeDocDialog", "ChangeDocControlContainer");
			oLogContainter.setComponent(that.oComp);
			that.oComp.getObjectId()[0] = that.sSalesOrderRequestId;
			//that.oComp.setStartDate(that.sCreationTime);
			that.oComp.stRefresh();
			dialog.open();
		},
		_padSalesOrderRequestID: function (itemUniqID) {
			if (itemUniqID === "" || itemUniqID === null || itemUniqID === undefined) {
				return null;
			} else {
				if (isNaN(itemUniqID)) {
					return itemUniqID;
				} else {
					return that._pad(itemUniqID, 15);
				}
			}
		},
		_pad: function (nParam, width, zParam) {
			var z = zParam || "0";
			var n = nParam + "";
			return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
		}
	};
	return that;
});