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
        onPressShowLog: function (oEvent) {
            // that.oParentController = this._controller;
            that.oExtensionAPI = this;
            that.oResourceBundle = this.getModel("i18n").getResourceBundle();
            that.uploadAppLogPromise = that.uploadAppLogPromise || that.oExtensionAPI.loadFragment({
                id: "AppLogDialog",
                name: "cus.sd.so.create.auto.xtrctns1.ext.Fragments.ApplicationLog",
                controller: that
            });
            var logHandlePromise = oEvent.getModel().bindProperty(oEvent.sPath + "/SalesOrderRequestLogHandle").requestValue();
            logHandlePromise.then(that._onFetchLogHandleComplete);
        },
        onLogButtonClose: function (oEvent) {
            var oDialog = oEvent.getSource().getParent();
            oDialog.close();
            that.oExtensionAPI.removeDependent(oDialog);
        },
        _onFetchLogHandleComplete: function (logHandle) {
            that.uploadAppLogPromise.then(function (dialog) {
                that.oExtensionAPI.addDependent(dialog);
            });
            that.logHandle = logHandle;
            that.uploadAppLogPromise.then(that._loadContent);
        },
        _loadContent: function (dialog) {
            var oLogContainter = Utils.getObjectById("AppLogDialog", "LogMessagesControlContainer");
            oLogContainter.setComponent(that.oComp);
            that.oComp.setLogHandle(that.logHandle);
            // that.oComp.updateModel();
            that.oComp.refresh();
            dialog.open();
        }
    };
    return that;
});