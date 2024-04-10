/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/core/format/NumberFormat"],function(N){"use strict";return{buildExpressionForCriticality:function(c){switch(c){case"2":return"Warning";case"3":return"Success";default:return"None";}},buildDisplayText:function(n,s,c){if(n===undefined||s===undefined||c===undefined){return"";}var f=parseFloat(n);if(isNaN(f)||s.trim().length===0){return"";}else{return N.getFloatInstance({showMeasure:false}).format(n)+" "+c;}}};});
