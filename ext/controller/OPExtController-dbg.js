/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/core/format/NumberFormat"],
	function (NumberFormat) {
		"use strict";
		return {
			buildExpressionForCriticality: function (sCriticalityCode) {
				// return sSimulationStatus === "A" && iCriticalityCode === "2" ? "Warning" : "None"
				switch(sCriticalityCode){
					case "2":
						return "Warning";
					case "3":
						return "Success";
					default:
						return "None";
				}
			},
			buildDisplayText: function(sNetAmount,sSimulationStatus,sCurrencyCode){
				if(sNetAmount === undefined || sSimulationStatus === undefined || sCurrencyCode === undefined){
					return "";
				}
				var fNetAmount = parseFloat(sNetAmount);
				if(isNaN(fNetAmount) || sSimulationStatus.trim().length === 0){
					return "";
				}else{
					return NumberFormat.getFloatInstance({showMeasure: false}).format(sNetAmount) + " " + sCurrencyCode;
				}
			}

		};
	}

);