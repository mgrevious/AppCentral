// This reference 'hint' is needed to get kendo intellisense in this file.
/// <reference path="~/Scripts/kendo/2013.1.319/kendo.web.min.js" />
(function ($, kendo, constants) {

    documentsViewModel = kendo.observable({

        data: {},

        applicationId: "",
        applicationRelation: "",

        errorHtml: "",

        documentTypeDataSource: new kendo.data.DataSource({
            pageSize: 20,
            serverFiltering: true,

            transport: {
                read: {
                    url: constants.documentTypeUrl
                }
                //,

                //parameterMap: function (data, type) {
                //    if (type === "read") {

                //        return {
                //            filter: $("#txtContact").val()
                //        };
                //    }
                //}
            },
            schema: {
                data: "Data"
            }
        }),

        setDialog: function (appRelation, appId) {

            documentsViewModel.set('applicationRelation', appRelation);
            documentsViewModel.set('applicationId', appId);
        },

        reset: function () {

            documentsViewModel.set('data', {});
            documentsViewModel.set('applicationRelation', "");
            documentsViewModel.set('applicationId', "");

            $("#txtDocumentType").data("kendoDropDownList").value("");
        },

        openEditDialog: function(data, title) {

            if (data) {
        
                this.set("data", data);
            }
        
            this.openDialog(title);
        },

        openDialog: function(title) {

            var appId = $('#selectedTreeNodeId').val();
            var mode = $("#mode").val();
            var parentId = "";
            var appRelation;
        
            if (mode === "INetApplication") {
                appRelation = ACent.Constants.documentApplicationRelationEnum.INetApplication;
            }
            else if (mode === "SharePointSite") {
                appRelation = ACent.Constants.documentApplicationRelationEnum.SharePointSite;
            }
            else if (mode === "CMSSite") {
                appRelation = ACent.Constants.documentApplicationRelationEnum.CMSSite;
            }
            else if (mode == "HomePageSite") {
                appRelation = ACent.Constants.documentApplicationRelationEnum.HomePageSite;
            }
        
            if (appId != null &&
                appId != "" &&
                appId != undefined) {
        
                this.setDialog(appRelation, appId);
        
                $("#documentEntryWindow").data("kendoWindow").title(title);

                $("#documentEntryWindow").css("display", "block");
        
                $("#documentEntryWindow").data("kendoWindow").center();
                $("#documentEntryWindow").data("kendoWindow").open();
            }
        },

        save: function () {
            
            if (documentsViewModel.applicationRelation === ACent.Constants.documentApplicationRelationEnum.SharePointSite) {

                return;
            }

            documentsViewModel.data.ApplicationRelation = documentsViewModel.applicationRelation;
            documentsViewModel.data.ApplicationId = documentsViewModel.applicationId;
            
            kendo.ui.progress($("#documentEntryWindow"), true);

            var methodUrl;
            var verb;

            if (documentsViewModel.data.ParentId == null) {
                verb = "POST";
                methodUrl = constants.documentsCreate;
            }
            else {
                verb = "PUT";
                methodUrl = constants.documentsUpdate + documentsViewModel.data.ParentId;
            }

            $.ajax({
                type: verb,
                url: methodUrl,
                data: documentsViewModel.data.toJSON(),
                dataType: "json"
            })
            .done(function (e) {

                documentsViewModel.reset();

                var appId = $('#selectedTreeNodeId').val();
                applicationSiteViewModel.populateDetails(appId);

                $("#documentEntryWindow").data("kendoWindow").close();

            })
            .fail(function (e) {
                if (e.responseJSON && e.responseJSON.Messages) {
                    documentsViewModel.set("errorHtml", errorListTemplate(e.responseJSON.Messages));
                }
                else {
                    documentsViewModel.set("errorHtml", errorListTemplate(["An error occurred while processing your request. Please try again later."]));
                }
            })
            .always(function () {
                kendo.ui.progress($("#documentEntryWindow"), false);
            });

        },

        delete: function (document) {

            kendo.ui.progress($("#mainDiv"), true);
            
            documentsViewModel.set("data", document);

            $.ajax({
                type: "DELETE",
                url: constants.documentsDelete,
                data: documentsViewModel.data.toJSON(),
                dataType: "json"
            })
            .done(function (e) {

                documentsViewModel.reset();

                var appId = $('#selectedTreeNodeId').val();
                applicationSiteViewModel.populateDetails(appId);
            })
            .fail(function (e) {
                alert("An error occurred while processing your request. Please try again later.");
            })
            .always(function () {
                kendo.ui.progress($("#mainDiv"), false);
            });

        },

        cancel: function () {

            documentsViewModel.reset();

            $("#documentEntryWindow").data("kendoWindow").close();
        }
    });

    $(function () {

        var documentEntryWindow = $("#documentEntryWindow").kendoWindow({
            modal: true,
            width: "780px",
            height: "200px"
        }).data("kendoWindow");

        documentEntryWindow.close();

        kendo.bind($("#documentEntryWindow"), documentsViewModel);
        
        $("#txtDocumentType").kendoDropDownList({
            dataTextField: "Name",
            dataValueField: "DocumentTypeId",
            optionLabel: "Select",
            dataSource: {
                transport: {
                    read: {
                        dataType: "json",
                        url: constants.documentTypeUrl,
                    }
                },
                schema: {
                    data: "Data"
                }
            }
        });
    });


}(jQuery, kendo, ACent.Constants));

