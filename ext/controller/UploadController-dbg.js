/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
		"sap/ui/core/Fragment",
		"sap/m/MessageBox",
		"sap/m/MessageToast",
		"sap/ui/unified/FileUploader",
		"sap/ui/model/json/JSONModel",
		"sap/fe/macros/DelegateUtil"
	],
	function (Fragment, MessageBox, MessageToast, FileUploader, JSONModel, DelegateUtil) {
		"use strict";

		var that = {

			oNewRequestContext: null,
			sCurrentCompanyCode: null,

			/**
			 * Function invoked when click "Upload File" button to open upload dialog
			 * @param oEvent: event parameter for the action
			 */
			onPressUploadFile: function (oEvent) {
				//that.uploadDialogSource = this._view;
				var oExtensionAPI = this;
				var oResourceBundle = this.getModel("i18n").getResourceBundle();
				var oDialog = that.getObjectById("uploadReportRawDataDialog", "dialogUploadFile");
				var uploadRawReportDialogPromise = Promise.resolve(oDialog);
				if (!oDialog) {
					uploadRawReportDialogPromise = oExtensionAPI.loadFragment({
						id: "uploadReportRawDataDialog",
						name: "cus.sd.so.create.auto.xtrctns1.ext.Fragments.FileUploadDialog",
						controller: that.createController(oExtensionAPI, oResourceBundle)
					});

					uploadRawReportDialogPromise.then(function (oDialog) {
						oExtensionAPI.addDependent(oDialog);
						var oFileUploader = that.getObjectById("uploadReportRawDataDialog", "fileUploaderRawData");
						oFileUploader.addStyleClass("sapUiNoMarginBegin");
						// fix ant copy issue
						// Ant will expand the text contains double "$" to a single "$"
						// use sIndex.length to switch the paramater value used in local env and server env
						var sIndex = "$";
						var oBindingParam = {};

						if (sIndex.length === 2) {
							oBindingParam = {
								$updateGroupId: "noSubmit",
								$groupId: "noSubmit"
							};
						} else {
							oBindingParam = {
								$$updateGroupId: "noSubmit",
								$$groupId: "noSubmit"
							};
						}
						// this now uses the company code from the entity set - this is actually wrong, it should be the parameter from the action
						// will be changed with a further patch
						var oTransientListBinding = oExtensionAPI.getModel().bindList('/SalesOrderRequest', null, [], [], oBindingParam);
						var oTransientContextBinding = oTransientListBinding.create({});

						var oCompanyInput = that.getObjectById("uploadReportRawDataDialog", "CompanyCodeInput");
						oCompanyInput.setBindingContext(oTransientContextBinding);

					});
				}

				uploadRawReportDialogPromise.then(function (oDialog) {
					oDialog.open();
					that.autoFillCompanyCode();

				});
			},

			autoFillCompanyCode: function () {
				var oCompanyInput = that.getObjectById("uploadReportRawDataDialog", "CompanyCodeInput");
				var oContext = oCompanyInput.getBindingContext();
				// Set Default or historical selected value
				if (that.sCurrentCompanyCode) {
					//oCompanyInput.setValue(that.sCurrentCompanyCode);
					oContext.setProperty("CompanyCode", that.sCurrentCompanyCode);
				}
			},

			/**
			 * Initial file upload dialog and entity meta for company code value help
			 */
			// createUploadDialog: function () {
			// 	// PLEASE NOTE: This is a PoC coding to use the FE macro and value help
			// 	// an official (and easier) method will be provided by FE
			// 	var oMetaModel = oExtensionAPI.getModel().getMetaModel(),
			// 		oPreprocessorSettings = {
			// 			bindingContexts: {
			// 				"entitySet": oMetaModel.createBindingContext('/SalesOrderRequest'),
			// 				"companyCode": oMetaModel.createBindingContext('/SalesOrderRequest/CompanyCode')
			// 			},
			// 			models: {
			// 				"entitySet": oMetaModel,
			// 				"companyCode": oMetaModel
			// 			}
			// 		};
			// 	return DelegateUtil.templateControlFragment(
			// 		'cus.sd.so.create.auto.xtrctns1.ext.Fragments.FileUploadDialog',
			// 		oPreprocessorSettings, {
			// 			controller: this
			// 		}
			// 	);
			// },

			getObjectById: function (sFragmentId, sElementId) {
				//Remove due to $ issue
				//to-do: with this PoC the IDs are global to be checked and changed by FE
				//return sap.ui.getCore().byId(sElementId);
				return sap.ui.core.Fragment.byId(sFragmentId, sElementId);
			},

			/**
			 * This function is used to find corresponding content type based on file type
			 * @param sVal: The input string
			 */
			getContentType: function (sFileName) {
				var sDocType = sFileName.slice(sFileName.lastIndexOf(".") + 1);
				switch (sDocType) {
				case "jpeg":
				case "jpg":
					return "image/jpeg";
				case "tiff":
				case "tif":
					return "image/tiff";
				case "png":
					return "image/png";
				case "pdf":
					return "application/pdf";
				default:
					return "";
				}
			},

			setCurrentCompanyCode: function (sCompanyCode) {
				that.sCurrentCompanyCode = sCompanyCode;
			},

			createController: function (oExtensionAPI, oResourceBundle) {
				return {
					/**
					 * Function invoked when the uploaded file type does not match the mimeType or fileType property in the FileUploader
					 * @param oEvent: the typeMissmatch event
					 */
					onTypeMissMatch: function (oEvent) {
						MessageBox.error(oResourceBundle.getText("fileUpldVw_fileTypeMissMatch"));
					},

					/**
					 * Function invoked when the uploaded file size is above the maximumFileSize property in the FileUploader
					 * @param oEvent: the fileSizeExceed event
					 */
					onfileSizeExceed: function (oEvent) {
						MessageBox.error(oResourceBundle.getText("fileUpldVw_fileSizeExceed"));
					},

					/**
					 * Function invoked when the uploaded file changed
					 * @param oEvent: the fileChange event
					 */
					onFilePathChange: function (oEvent) {
						var oFileUploader = that.getObjectById("uploadReportRawDataDialog", "fileUploaderRawData");
						var oCompanyInput = that.getObjectById("uploadReportRawDataDialog", "CompanyCodeInput");
						var aFiles = oFileUploader.getFocusDomRef().files;
						var sCompanyCode = this.trimStr(oCompanyInput.getValue());
						var oFileUploadBtn = that.getObjectById("uploadReportRawDataDialog", "rawReportUploadButton");
						if (!aFiles || aFiles.length !== 1 || !sCompanyCode) {
							oFileUploadBtn.setEnabled(false);
						} else {
							oFileUploadBtn.setEnabled(true);
						}
					},

					/**
					 * Function invoked when the company code changed by re-select or input  in the field
					 * @param oEvent: the field value change event
					 */
					onCompanyCodeChange: function (oEvent) {
						var oFileUploader = that.getObjectById("uploadReportRawDataDialog", "fileUploaderRawData");
						var oCompanyInput = that.getObjectById("uploadReportRawDataDialog", "CompanyCodeInput");
						var aFiles = oFileUploader.getFocusDomRef().files;

						var sCompanyCode, sRealCompanyCode, sCode;
						sCode = oCompanyInput.getValue();
						var oContext = oCompanyInput.getBindingContext();
						var oBindedCompanyCode = oContext.getObject();
						//if company code already have a valid binding code
						if (sCode) {
							if (oBindedCompanyCode.CompanyCodeName) {
								sCompanyCode = oBindedCompanyCode.CompanyCodeName + " (" + oBindedCompanyCode.CompanyCode + ")";
							} else {
								sCompanyCode = sCode;
							}
						} else {
							sCompanyCode = null;
						}

						//get real text for input

						var oCompanyInputDom = oCompanyInput.getDomRef();
						var aInnerInput = oCompanyInputDom.getElementsByTagName("input");
						if (aInnerInput.length === 1 && aInnerInput[0].value) {
							sRealCompanyCode = aInnerInput[0].value;
						}

						//sRealCompanyCode = this.trimStr(sRealCompanyCode);
						var oFileUploadBtn = that.getObjectById("uploadReportRawDataDialog", "rawReportUploadButton");
						if (!aFiles || aFiles.length !== 1 || ((sRealCompanyCode !== sCompanyCode) && (sRealCompanyCode !== sCode))) {
							oFileUploadBtn.setEnabled(false);
						} else {
							oFileUploadBtn.setEnabled(true);
						}
					},

					/**
					 * Function invoked when click "Upload" button in the file upload dialog
					 * this event will create Sales Order Request (SOR) firstly via RAP action
					 * @param oContext: the upload event in the File Uploader
					 */
					uploadFile: function (oContext) {
						//file size check
						//empty check
						var oFileUploader = that.getObjectById("uploadReportRawDataDialog", "fileUploaderRawData");
						var oCompanyInput = that.getObjectById("uploadReportRawDataDialog", "CompanyCodeInput");
						var sCompanyCode = this.trimStr(oCompanyInput.getValue());
						var aFiles = oFileUploader.getFocusDomRef().files;
						var sFileName = oFileUploader.getFocusDomRef().files[0].name;
						var FileNameRegExp = new RegExp(/[^\u0020-\u00ff]/);
						var isISO = FileNameRegExp.test(sFileName);
						if(isISO){
							var invalidChar = "";
							for (var i = 0; i < sFileName.length; i++){
								var CharisISO = FileNameRegExp.test(sFileName.charAt(i));
								if(CharisISO){
									invalidChar = invalidChar + sFileName.charAt(i);
								}
							}
							MessageBox.error(oResourceBundle.getText("FilenameError",invalidChar));
							return;
						}
						else{
							if (!sCompanyCode) {
								MessageBox.error(oResourceBundle.getText("fileUpldVw_invalidCompanyCode"));
								return;
							}
							if (!aFiles || aFiles.length !== 1) {
								MessageBox.error(oResourceBundle.getText("fileUpldVw_invalidPdf"));
								return;
							}
	
							//Store User Input for Company Code
							that.setCurrentCompanyCode(sCompanyCode);
	
							//busy
							var oDialog = that.getObjectById("uploadReportRawDataDialog", "dialogUploadFile");
							oDialog.setBusy(true);
	
							// the scope of the action is the Fiori elements Object Page Extension API
							var sActionName = "com.sap.gateway.srvd.c_slsordreqfrmextsource_sd.v0001.CreateSalesOrderRequest";
							var oModel = oExtensionAPI.getModel(),
								oListBinding = oModel.bindList("/SalesOrderRequest"),
								oActionContext = oListBinding.getHeaderContext(),
								oAction = oModel.bindContext(sActionName + "(...)", oActionContext);
	
							oAction.setParameter("ResultIsActiveEntity", true);
							oAction.setParameter("SalesOrderRequestCategory", "A");
							oAction.setParameter("CompanyCode", sCompanyCode);
	
							oAction.execute().then(this.onCreateSORComplete, this.onCreateSORFailed);
						}
					},

					/**
					 * Callback function invoked when pdf attach to SOR is completed (either successful or unsuccessful)
					 * If upload failed, will delete current SOR
					 * @param oContext: the parameter of file upload complete event
					 */
					onUploadComplete: function (oEvent) {
						var oDialog = that.getObjectById("uploadReportRawDataDialog", "dialogUploadFile");
						var oFileUploader = oEvent.getSource();
						//remove Header parameter
						oFileUploader.removeAllHeaderParameters();
						//error handling
						var sStatus = oEvent.getParameter("status") + "";
						//var bDeletedFlag = false;
						//success
						if (sStatus[0] === '2') {
							oDialog.setBusy(false);
							oFileUploader.removeAllHeaderParameters();
							oFileUploader.clear();
							//clear company code input
							var oCompanyInput = that.getObjectById("uploadReportRawDataDialog", "CompanyCodeInput");
							var oContext = oCompanyInput.getBindingContext();
							oContext.setProperty("CompanyCode", "");
							oContext.setProperty("CompanyCodeName", "");
							// oCompanyInput.setValue("");
							// oCompanyInput.setValueState("None");
							// oCompanyInput.setValueStateText("");
							// oCompanyInput.setConditions([]);
							oDialog.close();
							//that.oExtensionAPI.removeDependent(oDialog);
							// refresh whole list report page
							oExtensionAPI.refresh();
							var sSalesOrderRequest = that.oNewRequestContext.getObject().SalesOrderRequest;
							if (oEvent.getParameter("headers")["sap-messages"]) {
								try {
									var aMsgObjects = JSON.parse(oEvent.getParameter("headers")["sap-messages"]);
									var sLogHandle = that.oNewRequestContext.getObject("SalesOrderRequestLogHandle");
									var sErrorMessage = aMsgObjects[0].message;
									MessageBox.error(sErrorMessage);
									var mMessages = that.oNewRequestContext.getModel().mMessages;
									if(mMessages instanceof Array){
										that.oNewRequestContext.getModel().mMessages.push({"logHanlde": sLogHandle, "Message": sErrorMessage});
									}else{
										that.oNewRequestContext.getModel().mMessages = [{"logHanlde": sLogHandle, "Message": sErrorMessage}];	
									}
								} catch (error) {
									MessageBox.error(oResourceBundle.getText("fileUpldBiz_uploadFailed"));
								}
							} else {
								MessageToast.show(oResourceBundle.getText("fileUpldBiz_uploaded", sSalesOrderRequest));
							}

							// if (!bDeletedFlag){
							// 	
							// } 

						} else {
							//Failed, delete SOR
							that.oNewRequestContext.delete("$auto").then(this.onUploadFailed, this.onUploadFailed);
						}
					},

					/**
					 * Function invoked when click "Cancel" button in the file upload dialog to close this dialog
					 * It'll clear the value in the company code field and file uploader
					 * @param oEvent: the parameter of file upload complete event
					 */
					onUploadCancel: function (oEvent) {
						var oFileUploader = that.getObjectById("uploadReportRawDataDialog", "fileUploaderRawData");
						oFileUploader.removeAllHeaderParameters();
						oFileUploader.clear();
						var oCompanyInput = that.getObjectById("uploadReportRawDataDialog", "CompanyCodeInput");                                           
						var oContext = oCompanyInput.getBindingContext();
						oContext.setProperty("CompanyCode", "");
						oContext.setProperty("CompanyCodeName", "");
						var oInnerField = oCompanyInput.getContent().getContentEdit()[0].getAggregation("_content")[0];
						if (oInnerField.getValueState() === 'Error' && oInnerField.getValue()) {
							oInnerField.setValue('');
							//check value state also if it is not updating =>> set Value state also [but most probably value state should refresh].
						}

						var oFileUploadBtn = that.getObjectById("uploadReportRawDataDialog", "rawReportUploadButton");
						oFileUploadBtn.setEnabled(false);
						var oDialog = oEvent.getSource().getParent();
						oDialog.close();
						//that.oExtensionAPI.removeDependent(oDialog);
					},

					/**
					 * This is general error handler to handle http response errors
					 * It'll parse the response error and pop up error message
					 * @param oError: the response error object
					 * @param sMsgId: default error message
					 */
					handleImportError: function (oError, sMsgId) {
						var sErrorMessage = oResourceBundle.getText(sMsgId ? sMsgId : "fileUpldBiz_uploadFailed");
						if (typeof oError.error === "object") {
							MessageBox.error(oError.error.message ? oError.error.message : sErrorMessage);
						} else {
							try {
								var oErrorMessage = JSON.parse(oError.responseText);
							} catch (err) {
								MessageBox.error(sErrorMessage);
								return;
							}
							MessageBox.error(oErrorMessage.error && oErrorMessage.error.message && oErrorMessage.error.message.value ? oErrorMessage.error.message
								.value : sErrorMessage);
						}
					},

					/**
					 * This is call back function when create SOR via RAP action completed successfully
					 * It'll upload the selected pdf file to attach to the created SOR
					 * @param oContext: the response context object when SOR created via RAP action
					 */
					onCreateSORComplete: function (oContext) {
						that.oNewRequestContext = oContext;
						var oNewRequest = that.oNewRequestContext.getObject();

						var sFileUploadURL =
							"/sap/opu/odata4/sap/c_slsordreqfrmextsrc_srv/srvd/sap/c_slsordreqfrmextsource_sd/0001/SalesOrderRequest(SalesOrderRequest='" +
							oNewRequest.SalesOrderRequest + "',IsActiveEntity=true)/UploadFileContentBinary";

						var oFileUploader = that.getObjectById("uploadReportRawDataDialog", "fileUploaderRawData");
						var sFileName = oFileUploader.getFocusDomRef().files[0].name;

						var headerParameterContentType = new sap.ui.unified.FileUploaderParameter();
						headerParameterContentType.setName('Content-Type');
						headerParameterContentType.setValue(that.getContentType(sFileName));
						oFileUploader.addHeaderParameter(headerParameterContentType);

						var csrfToken = oFileUploader.getModel().getHttpHeaders()["X-CSRF-Token"];
						var headerParameterCSRFToken = new sap.ui.unified.FileUploaderParameter();
						headerParameterCSRFToken.setName('x-csrf-token');
						headerParameterCSRFToken.setValue(csrfToken);
						oFileUploader.addHeaderParameter(headerParameterCSRFToken);

						var headerParameterFileName = new sap.ui.unified.FileUploaderParameter();
						headerParameterFileName.setName('Content-Disposition');
						headerParameterFileName.setValue('filename="' + encodeURIComponent(sFileName) + '"');
						oFileUploader.addHeaderParameter(headerParameterFileName);

						oFileUploader.setUploadUrl(sFileUploadURL);
						oFileUploader.upload();
					},

					/**
					 * This is call back function when create SOR via RAP action completed unsuccessfully
					 * It'll pop up error message
					 * @param sError: the response error object when RAP action failed
					 */
					onCreateSORFailed: function (oError) {
						var oDialog = that.getObjectById("uploadReportRawDataDialog", "dialogUploadFile");
						oDialog.setBusy(false);
						//failed to create sales order via external source
						//this.handleImportError(oError, "fileUpldBiz_sorCreateFailed");
						var sErrorMessage = oResourceBundle.getText("fileUpldBiz_uploadFailed");
						if (typeof oError.error === "object") {
							MessageBox.error(oError.error.message ? oError.error.message : sErrorMessage);
						} else {
							try {
								var oErrorMessage = JSON.parse(oError.responseText);
							} catch (err) {
								MessageBox.error(sErrorMessage);
								return;
							}
							MessageBox.error(oErrorMessage.error && oErrorMessage.error.message && oErrorMessage.error.message.value ? oErrorMessage.error.message
								.value : sErrorMessage);
						}
					},

					/**
					 * This is call back function when delete SOR after pdf upload failed
					 * It'll pop up error message
					 */
					onUploadFailed: function () {
						var sUploadPdfFailedMsg = oResourceBundle.getText("fileUpldBiz_uploadFailed");
						var oDialog = that.getObjectById("uploadReportRawDataDialog", "dialogUploadFile");
						oDialog.setBusy(false);
						MessageBox.error(sUploadPdfFailedMsg);
					},

					/**
					 * This is general function to get UI5 object in the upload dialog via unique id
					 * @param sFragmentId: The upload dialog id
					 * @param sElementId: The element id
					 */

					/**
					 * This is general function to trim string
					 * @param sVal: The input string
					 */
					trimStr: function (sVal) {
						if (!sVal) {
							return null;
						} else {
							return sVal.trim();
						}
					}
				};

			}

		};
		return that;
	});