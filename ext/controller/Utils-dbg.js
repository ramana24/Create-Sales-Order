/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
],
function () {
	"use strict";

	var that = {
		getObjectById: function (sFragmentId, sElementId) {
			//Remove due to $ issue
			//to-do: with this PoC the IDs are global to be checked and changed by FE
			//return sap.ui.getCore().byId(sElementId);
			return sap.ui.core.Fragment.byId(sFragmentId, sElementId);
		}
	};
	return that;
});