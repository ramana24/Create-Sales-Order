/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/core/Fragment","cus/sd/so/create/auto/xtrctns1/ext/controller/Utils"],function(F,U){"use strict";var t={oExtensionAPI:null,onPressShowLog:function(e){t.oExtensionAPI=this;t.oResourceBundle=this.getModel("i18n").getResourceBundle();t.uploadAppLogPromise=t.uploadAppLogPromise||t.oExtensionAPI.loadFragment({id:"AppLogDialog",name:"cus.sd.so.create.auto.xtrctns1.ext.Fragments.ApplicationLog",controller:t});var l=e.getModel().bindProperty(e.sPath+"/SalesOrderRequestLogHandle").requestValue();l.then(t._onFetchLogHandleComplete);},onLogButtonClose:function(e){var d=e.getSource().getParent();d.close();t.oExtensionAPI.removeDependent(d);},_onFetchLogHandleComplete:function(l){t.uploadAppLogPromise.then(function(d){t.oExtensionAPI.addDependent(d);});t.logHandle=l;t.uploadAppLogPromise.then(t._loadContent);},_loadContent:function(d){var l=U.getObjectById("AppLogDialog","LogMessagesControlContainer");l.setComponent(t.oComp);t.oComp.setLogHandle(t.logHandle);t.oComp.refresh();d.open();}};return t;});
