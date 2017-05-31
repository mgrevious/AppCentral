// This reference 'hint' is needed to get kendo intellisense in this file.
/// <reference path="~/Scripts/kendo/2013.1.319/kendo.web.min.js" />
(function ($, kendo, constants) {

    contactsViewModel = kendo.observable({

        data: {},

        applicationId: "",
        applicationRelation: "",

        errorHtml: "",

        contactsDataSource: new kendo.data.DataSource({
            pageSize: 20,
            serverFiltering: true,
            transport: {
                read: {
                    url: constants.contactsGetUrl
                },

                parameterMap: function (data, type) {
                    if (type === "read") {

                        return {
                            filter: $("#txtContact").val()
                        };
                    }
                }
            },
            schema: {
                data: "Data"
            }
        }),

        setDialog: function (appRelation, appId) {

            contactsViewModel.set('applicationRelation', appRelation);
            contactsViewModel.set('applicationId', appId);

            $("#txtContact").data("kendoAutoComplete").value("");

        },

        reset: function () {

            contactsViewModel.set('data', {});
            contactsViewModel.set('applicationRelation', "");
            contactsViewModel.set('applicationId', "");

            $("#txtContact").data("kendoAutoComplete").value("");
        },

        openDialog: function(title) {

            var appId = $('#selectedTreeNodeId').val();
            var mode = $("#mode").val();
            var appRelation;
        
            if (title === "Add Owner") {
        
                if (mode === "INetApplication") {
                    appRelation = ACent.Constants.applicationRelationEnum.INetAppOwner;
                }
                else if (mode === "SharePointSite") {
                    appRelation = ACent.Constants.applicationRelationEnum.SharePointSiteOwner;
                }
                else if (mode === "CMSSite") {
                    appRelation = ACent.Constants.applicationRelationEnum.CMSSiteOwner;
                }
                else if (mode === "HomePageSite") {
                    appRelation = ACent.Constants.applicationRelationEnum.HomePageSiteOwner;
                }
        
            }
            else if (title === "Add Developer") {
        
                if (mode === "INetApplication") {
                    appRelation = ACent.Constants.applicationRelationEnum.INetAppDeveloper;
                }
                else if (mode === "SharePointSite") {
                    appRelation = ACent.Constants.applicationRelationEnum.SharePointSiteDeveloper;
                }
                else if (mode === "CMSSite") {
                    appRelation = ACent.Constants.applicationRelationEnum.CMSSiteDeveloper;
                }
                else if (mode === "HomePageSite") {
                    appRelation = ACent.Constants.applicationRelationEnum.HomePageSiteDeveloper;
                }

            }
        
            
            if (appId != null &&
                appId != "" &&
                appId != undefined) {
        
                this.setDialog(appRelation, appId);
        
                $("#contactEntryWindow").data("kendoWindow").title(title);

                $("#contactEntryWindow").css("display", "block");
        
                $("#contactEntryWindow").data("kendoWindow").center();
                $("#contactEntryWindow").data("kendoWindow").open();
            }
        },

        save: function () {
            
            contactsViewModel.data.ApplicationRelation = contactsViewModel.applicationRelation;
            contactsViewModel.data.ApplicationId = contactsViewModel.applicationId;

            kendo.ui.progress($("#contactEntryWindow"), true);

            $.ajax({
                type: "POST",
                url: constants.contactsCreate,
                data: contactsViewModel.data.toJSON(),
                dataType: "json"
            })
            .done(function (e) {

                contactsViewModel.reset();

                var appId = $('#selectedTreeNodeId').val();
                applicationSiteViewModel.populateDetails(appId);

                $("#contactEntryWindow").data("kendoWindow").close();

            })
            .fail(function (e) {
                if (e.responseJSON && e.responseJSON.Messages) {
                    contactsViewModel.set("errorHtml", errorListTemplate(e.responseJSON.Messages));
                }
                else {
                    contactsViewModel.set("errorHtml", errorListTemplate(["An error occurred while processing your request. Please try again later."]));
                }
            })
            .always(function () {
                kendo.ui.progress($("#contactEntryWindow"), false);
            });

        },

        delete: function (contact) {
            
            kendo.ui.progress($("#mainDiv"), true);

            contactsViewModel.set("data", contact);

            $.ajax({
                type: "DELETE",
                url: constants.contactsDelete,
                data: contactsViewModel.data.toJSON(),
                dataType: "json"
            })
            .done(function (e) {
                var appId = $('#selectedTreeNodeId').val();
                applicationSiteViewModel.populateDetails(appId);
                
                contactsViewModel.reset();
            })
            .fail(function (e) {
                alert("An error occurred while processing your request. Please try again later.");
            })
            .always(function () {
                kendo.ui.progress($("#mainDiv"), false);
            });

        },

        cancel: function () {

            contactsViewModel.reset();

            $("#contactEntryWindow").data("kendoWindow").close();
        }
    });

    $(function () {

        var contactEntryWindow = $("#contactEntryWindow").kendoWindow({
            modal: true,
            width: "420px",
            height: "100px"
        }).data("kendoWindow");

        contactEntryWindow.close();

        kendo.bind($("#contactEntryWindow"), contactsViewModel);
        
        $("#txtContact").kendoAutoComplete({
            dataSource: contactsViewModel.contactsDataSource,
            change: function () {
                this.dataSource.read();
            },
            width: "300px",
            dataTextField: "FullName",
            filter: "contains",
            placeholder: "Select Person...",
            select: function (e) {
                var dataItem = this.dataItem(e.item.index());
                contactsViewModel.data = dataItem;
            }
        }); 
    });


}(jQuery, kendo, ACent.Constants));

