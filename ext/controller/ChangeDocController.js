/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/core/Fragment","cus/sd/so/create/auto/xtrctns1/ext/controller/Utils"],function(F,U){"use strict";var t={oExtensionAPI:null,onPressShowChangeDoc:function(e){t.sSalesOrderRequestId=t._padSalesOrderRequestID(e.getObject().SalesOrderRequest);t.sCreationTime=e.getObject().CreationDateTime;t.oExtensionAPI=this;t.oResourceBundle=this.getModel("i18n").getResourceBundle();t.changeDocPromise=t.changeDocPromise||t.oExtensionAPI.loadFragment({id:"ChangeDocDialog",name:"cus.sd.so.create.auto.xtrctns1.ext.Fragments.ChangeDoc",controller:t});t.changeDocPromise.then(function(d){t.oExtensionAPI.addDependent(d);});t.changeDocPromise.then(t._loadContent);},onChangDocButtonClose:function(e){var d=e.getSource().getParent();d.close();t.oExtensionAPI.removeDependent(d);},_loadContent:function(d){var l=U.getObjectById("ChangeDocDialog","ChangeDocControlContainer");l.setComponent(t.oComp);t.oComp.getObjectId()[0]=t.sSalesOrderRequestId;t.oComp.stRefresh();d.open();},_padSalesOrderRequestID:function(i){if(i===""||i===null||i===undefined){return null;}else{if(isNaN(i)){return i;}else{return t._pad(i,15);}}},_pad:function(a,w,b){var z=b||"0";var n=a+"";return n.length>=w?n:new Array(w-n.length+1).join(z)+n;}};return t;});
