/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/m/MessageBox", "sap/ui/core/library", "sap/ui/model/resource/ResourceModel",
		"sap/suite/ui/commons/MicroProcessFlow", "sap/suite/ui/commons/MicroProcessFlowItem"
	],
	function (MessageBox, coreLibrary, ResourceModel, MicroProcessFlow, MicroProcessFlowItem) {
		"use strict";
		var requestIcon = "sap-icon://request";
		var inspectionIcon = "sap-icon://inspection";
		var salesorderIcon = "sap-icon://sales-order";
		var oResourceBundle = new ResourceModel({
			bundleName: "cus.sd.so.create.auto.xtrctns1.i18n.i18n"
		}).getResourceBundle();

		var getPopoverContent = function (sIcon, oItem) {
			var sState = oItem.getState();
			switch (sIcon) {
			case requestIcon: //Extraction Status
				switch (sState) {
				case "Success":
					return [oResourceBundle.getText("extractionPopoverTitle"),
						oResourceBundle.getText("extractionSuccessContentTitle"),
						oResourceBundle.getText("extractionSuccessContentDesc")
					];
				case "None": //In Process
					return [oResourceBundle.getText("extractionPopoverTitle"),
						oResourceBundle.getText("extractionInprocessContentTitle"),
						oResourceBundle.getText("extractionInprocessContentDesc")
					];
				case "Error":
					var sApplicationLogHandler = oItem.getBindingContext().getObject("SalesOrderRequestLogHandle");
					var oRespData;
					var mMessages = oItem.getBindingContext().getModel().mMessages;
					if (mMessages instanceof Array) {
						for (var i = 0; i < mMessages.length; i++) {
							if (mMessages[i].logHanlde === sApplicationLogHandler) {
								return [oResourceBundle.getText("extractionPopoverTitle"),
									oResourceBundle.getText("extractionFailedContentTitle"),
									mMessages[i].Message
								];
							}
						}
					}
					if (sApplicationLogHandler) {
						var sUrl =
							"/sap/opu/odata/sap/APL_LOG_MANAGEMENT_SRV/ApplicationLogHeaderSet('" +
							sApplicationLogHandler +
							"')/ApplicationLogMessageSet?$filter=Type eq 'E'&$select=Type,Text,Timestamp,HasDetailText,HasLongText&$inlinecount=allpages";
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.loadData(sUrl, null, false, "GET", false, false, null);
						oRespData = oModel.getData();
					}

					if (oRespData && oRespData.d && oRespData.d.results.length > 0) {
						// Cache Loghandle and messsage
						if (mMessages instanceof Array){
							oItem.getBindingContext().getModel().mMessages.push({"logHanlde": sApplicationLogHandler, "Message": oRespData.d.results[0].Text});
						}else{
							oItem.getBindingContext().getModel().mMessages = [{"logHanlde": sApplicationLogHandler, "Message": oRespData.d.results[0].Text}];
						}
						return [oResourceBundle.getText("extractionPopoverTitle"),
							oResourceBundle.getText("extractionFailedContentTitle"),
							oRespData.d.results[0].Text
						];
					} else {
						return [oResourceBundle.getText("extractionPopoverTitle"),
							oResourceBundle.getText("extractionFailedContentTitle"),
							oResourceBundle.getText("extractionFailedContentDesc")
						];
					}
				}
				break;
			case inspectionIcon: //Completeness Status
				switch (sState) {
				case "Success":
					return [oResourceBundle.getText("cmpltnsPopoverTitle"),
						oResourceBundle.getText("cmpltnsSuccessContentTitle"),
						oResourceBundle.getText("cmpltnsSuccessContentDesc")
					];
				case "None": //In Processs
					return [oResourceBundle.getText("cmpltnsPopoverTitle"),
						oResourceBundle.getText("cmpltnsInprocessContentTitle"),
						oResourceBundle.getText("cmpltnsInprocessContentDesc")
					];
				case "Error":
					return [oResourceBundle.getText("cmpltnsPopoverTitle"),
						oResourceBundle.getText("cmpltnsFailedContentTitle"),
						oResourceBundle.getText("cmpltnsFailedContentDesc")
					];
				}
				break;
			case salesorderIcon: //Creation Status
				switch (sState) {
				case "Success":
					return [oResourceBundle.getText("creationPopoverTitle"),
						oResourceBundle.getText("creationSuccessContentTitle"),
						oResourceBundle.getText("creationSuccessContentDesc")
					];
				case "Error":
					return [oResourceBundle.getText("creationPopoverTitle"),
						oResourceBundle.getText("creationFailedContentTitle"),
						oResourceBundle.getText("creationFailedContentDesc")
					];
				}
				break;
			}
		};

		var getPopoverClose = function () {
			return oResourceBundle.getText("close");
		};
		return {

			itemPress: function (oEvent) {
				var oItem = oEvent.getSource();
				var sIcon = oItem.getIcon();
				var oMicroProcessFlowItem = new MicroProcessFlowItem({
					state: oItem.getState(),
					icon: sIcon
				});
				if (sIcon) {
					var oPopover = new sap.m.Popover({
						contentWidth: "300px",
						title: getPopoverContent(sIcon, oItem)[0],
						content: [
							new sap.m.HBox({
								alignItems: "Start",
								items: [
									new MicroProcessFlow({
										content: oMicroProcessFlowItem
									}).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginEnd "),
									new sap.m.FlexBox({
										width: "100%",
										renderType: "Bare",
										direction: "Column",
										items: [new sap.m.Title({
											level: sap.ui.core.TitleLevel.H1,
											text: getPopoverContent(sIcon, oItem)[1]
										}), new sap.m.Text({
											text: getPopoverContent(sIcon, oItem)[2]
										}).addStyleClass("sapUiSmallMarginBottom sapUiSmallMarginTop")]
									}).addStyleClass("sapUiTinyMarginTop")
								]
							}).addStyleClass("sapUiTinyMargin")
						],
						footer: [
							new sap.m.Toolbar({
								content: [
									new sap.m.ToolbarSpacer(),
									new sap.m.Button({
										text: getPopoverClose(),
										press: function () {
											oPopover.close();
										}
									})
								]
							})
						]
					});
					if (oPopover && oEvent.getParameter("item")) {
						oPopover.openBy(oEvent.getParameter("item"));
					}
				}
			},

			setExtractionStatus: function (status) {
				switch (status) {
				case "A":
					return "None";
				case "B":
					return "Success";
				case "C":
					return "Error";
				default:
					return null;
				}
			},

			setCompletenessStatus: function (status) {
				switch (status) {
				case "P":
					return "None";
				case "S":
					return "Success";
				case "E":
					return "Error";
				default:
					return null;
				}
			},

			setCreationStatus: function (status) {
				switch (status) {
				case "S":
					return "Success";
				case "F":
					return "Error";
				default:
					return null;
				}
			},

			setExtractionIcon: function (status) {
				if (status) {
					return requestIcon;
				}
				return null;
			},

			setCompletenessIcon: function (status) {
				if (status) {
					return inspectionIcon;
				}
				return null;
			},

			setCreationIcon: function (status) {
				if (status) {
					return salesorderIcon;
				}
				return null;
			}
		};
	});