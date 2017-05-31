// This reference 'hint' is needed to get kendo intellisense in this file.
/// <reference path="~/Scripts/kendo/2013.1.319/kendo.web.min.js" />
(function ($, kendo, constants) {

    applicationSiteViewModel = kendo.observable({

        instance: {},

        getUrl: "",
        getFilteredUrl: "",

        isAdmin: constants.isUserAdmin,
        //isEditable: false,
        //isMigratable: false,
        //isAddable: false,
        instanceOwners: {},
        instanceDevelopers: {},
        instanceDocuments: {},
        instanceBuildMasterExecutions: {},
        
        errorHtml: "",

        unMigrate: function () {
            if (confirm("Are you sure you want to set this application back to its unmigrated state?")) {
                var selectedId = applicationSiteViewModel.get("instance.Id");
                var mode = applicationsListViewModel.get("mode");

                $.ajax({
                    type: "PUT",
                    url: rootServiceUrl + mode + "/UnMigrate?siteId=" + selectedId,
                    dataType: "json"
                })
                 .done(function (e) {
                     //applicationsListViewModel.setupSelectedGridForMode(mode, selectedId);
                 })
                .fail(function (e) {
                    $("#sharePointSiteOrganizer").css("width", $("#sharePointSiteNotError").css("width"));
                    if (e.responseJSON && e.responseJSON.Messages) {
                        applicationSiteViewModel.set("errorHtml", errorListTemplate(e.responseJSON.Messages));
                    }
                    else {
                        applicationSiteViewModel.set("errorHtml", errorListTemplate(["An error occurred while processing your request. Please try again later."]));
                    }
                })
                .always(function () {
                    applicationsListViewModel.refreshOne();
                    kendo.ui.progress($("#applicationSiteEditWindow"), false);
                });
                kendo.ui.progress($("#applicationSiteEditWindow"), true);
            }
        },

        isINetApp: function () {
            
            this.get("instance");

            if (applicationsListViewModel.get("mode") === undefined) return false;

            return applicationsListViewModel.get("mode") === "INetApplication";
        },

        isSPSite: function () {

            this.get("instance");

            if (applicationsListViewModel.get("mode") === undefined) return false;

            return applicationsListViewModel.get("mode") === "SharePointSite";
        },

        isCMSSite: function () {

            this.get("instance");

            if (applicationsListViewModel.get("mode") === undefined) return false;

            return applicationsListViewModel.get("mode") === "CMSSite";
        },

        isHomePageSite: function () {

            this.get("instance");

            if (applicationsListViewModel.get("mode") === undefined) return false;

            return applicationsListViewModel.get("mode") === "HomePageSite";
        },

        isntHomePageSite: function () {
            return !this.isHomePageSite();
        },

        isMigrated: function () {

            this.get("instance");

            if (applicationsListViewModel.get("mode") === undefined) return false;

            if (applicationsListViewModel.get("mode") === "SharePointSite") {
                return this.get("instance").MigratedDate != null;
            }
            return false;
        },

        isntMigrated: function () {

            this.get("instance");

            if (applicationsListViewModel.get("mode") === undefined) return false;

            if (applicationsListViewModel.get("mode") === "SharePointSite") {
                return this.get("instance").MigratedDate == null;
            }
            return false;
        },

        MigrationInfo: function () {

            this.get("instance");

            if (applicationsListViewModel.get("mode") === undefined) return null;

            if (applicationsListViewModel.get("mode") === "SharePointSite") {
                var inst = this.get("instance");
                if (inst.MigrationSiteId === undefined) {
                    return "N/A";
                } else if (inst.MigrationSiteId === null) {
                    return ""; // site is unmigrated--show nothing
                } else {
                    return "Migrated to " + inst.MigrationSiteName + " because " + inst.MigrationReason + " by " + inst.MigratedByName + " on " + kendo.toString(kendo.parseDate(inst.MigratedDate), "d");
                }
            }
            return null;
        },

        buildMasterDataSource: new kendo.data.DataSource({
            pageSize: 20,
            serverFiltering: true,

            transport: {
                read: {
                    url: constants.buildMasterGetUrl
                },

                parameterMap: function (data, type) {
                    if (type === "read") {

                        return {
                            filter: $("#txtEditBuildMasterName").val()
                        };
                    }
                }
            },
            schema: {
                data: "Data"
            }
        }),

        changeMode: function (mode) {

            $('#txt' + applicationsListViewModel.get("mode") + 'Name').text("");
            $('#txt' + applicationsListViewModel.get("modeAbbreviation") + 'DateCreated').html("");
            $("#txtEditBuildMasterName").val("");

            this.set("instance", {});

            this.set("applicationId", "");

            this.setAddEditMigrateStatus();

            if (applicationsListViewModel.get("mode") === "INetApplication") {
                this.set("getUrl", constants.inetApplicationGetUrl);
                this.set("getFilteredUrl", constants.inetApplicationGetFilteredUrl);
            }
            else if (applicationsListViewModel.get("mode") === "SharePointSite") {
                this.set("getUrl", constants.sharePointSiteGetUrl);
                this.set("getFilteredUrl", constants.sharePointSiteGetFilteredUrl);
            }
            else if (applicationsListViewModel.get("mode") === "CMSSite") {
                this.set("getUrl", constants.cmsSiteGetUrl);
                this.set("getFilteredUrl", constants.cmsSiteGetFilteredUrl);
            }
            else if (applicationsListViewModel.get("mode") === "HomePageSite") {
                this.set("getUrl", constants.homepageSiteGetUrl);
                this.set("getFilteredUrl", constants.homepageSiteGetFilteredUrl);
            }

            $('#txt' + applicationsListViewModel.get("mode") + 'Name').text("");

            $('#txt' + applicationsListViewModel.get("modeAbbreviation") + 'DateCreated').html("");

            $('[name="btnAddOwner"]').css("display", "none");

            $('[name="btnAddDeveloper"]').css("display", "none");

            $('[name="btnAddDocument"]').css("display", "none");

            this.setData({});
            
        },

        setData: function (data) {

            
            this.set("instance", data);

            //  LAYTIN
            if ($.isEmptyObject(data)) {
                data.IsActive = true;
                this.set("instance", data);

                this.set("applicationId", "");
               
                this.set("instanceOwners", {});
                this.set("instanceDevelopers", {});
                this.set("instanceDocuments", {});
                this.set("instanceBuildMasterExecutions", {});
            }
            else {

                this.set("applicationId", data.ApplicationId);

                this.set("instanceOwners", data.Owners);
                this.set("instanceDevelopers", data.Developers);

                var derDocs = data.Documents;

                for (var i = 0; i < derDocs.length; i++) {

                    derDocs[i].FormattedModifiedDate = kendo.toString(kendo.parseDate(derDocs[i].ModifiedDate), "d");
                }

                this.set("instanceDocuments", derDocs);
                this.set("instanceBuildMasterExecutions", data.BuildMasterExecutions);
            }


            var ownerGrid = $('[id ^=' + applicationsListViewModel.get("modeAbbreviation") + '][id $=OwnersGrid]').data("kendoGrid");
            if (ownerGrid != null) {
                ownerGrid.dataSource.data(this.get("instanceOwners"));
                ownerGrid.dataSource.page(1);
                ownerGrid.refresh();
            }

            var devGrid = $('[id ^=' + applicationsListViewModel.get("modeAbbreviation") + '][id $=DevelopersGrid]').data("kendoGrid");
            if (devGrid != null) {
                devGrid.dataSource.data(this.get("instanceDevelopers"));
                devGrid.dataSource.page(1);
                devGrid.refresh();
            }

            var docGrid = $('[id ^=' + applicationsListViewModel.get("modeAbbreviation") + '][id $=DocumentsGrid]').data("kendoGrid");
            if (docGrid != null) {
                docGrid.dataSource.data(this.get("instanceDocuments"));
                docGrid.dataSource.page(1);
                docGrid.refresh();
            }

            if (applicationsListViewModel.get("mode") === constants.inetApplicationMode) {
                var buildGrid = $('#appBuildMasterGrid').data("kendoGrid");
                buildGrid.dataSource.data(this.get("instanceBuildMasterExecutions"));
                buildGrid.dataSource.page(1);
                buildGrid.refresh();
            }
        },

        // Site-specific button updates.
        setAddEditMigrateStatus: function () {
            var mode = applicationsListViewModel.get("modeAbbreviation");
            // ignore isAddable. It's set from the listview and nothing here can change it anyway
            this.set("isEditable", constants.isUserAdmin);
            this.set("isMigratable",
              constants.isUserAdmin
               && mode == "sp"
               && !this.instance.get("IsMigrated")
               );
        },

        populateDetails: function (id) {
            
            if (id) { // checks for id being anything OTHER THAN null, undefined, NaN, "", 0, or false.
                kendo.ui.progress($("#mainDiv"), true);

                var url = this.get("getUrl") + id;

                $.getJSON(url,
                           function (data) {

                               applicationSiteViewModel.setData(data.Data);

                               applicationSiteViewModel.set("applicationId", id);

                               var isActive = applicationSiteViewModel.instance.IsActive ? " (Active)" : " (Inactive)";

                               $('#txt' + applicationsListViewModel.get("mode") + 'Name').text(applicationSiteViewModel.instance.Name + isActive);

                               $('#txt' + applicationsListViewModel.get("modeAbbreviation") + 'DateCreated').html(kendo.toString(kendo.parseDate(applicationSiteViewModel.instance.CreatedDate), "MMMM dd, yyyy"));

                               if (constants.isUserAdmin === true) {

                                   $('[name="btnAddOwner"]').css("display", "block")
                                                            .css("float", "left");

                                   $('[name="btnAddDeveloper"]').css("display", "block")
                                                            .css("float", "left");

                                   $('[name="btnAddDocument"]').css("display", "block")
                                                            .css("float", "left");

                               }
                               else {

                                   $('[name="btnAddOwner"]').css("display", "none");

                                   $('[name="btnAddDeveloper"]').css("display", "none");

                                   $('[name="btnAddDocument"]').css("display", "none");

                                   $('.k-grid-DeleteCustom').css('display', 'none');

                               }
                               applicationSiteViewModel.setAddEditMigrateStatus();
                               kendo.ui.progress($("#mainDiv"), false);
                           });
            }
        },

        // VIEW
        openEditWindow: function (title) {
            var editWindow = $("#applicationSiteEditWindow").data("kendoWindow");
            editWindow.title(title);
            $("#applicationSiteEditWindow").css("display", "block");
            editWindow.center();
            editWindow.open();
            editWindow.refresh();
        },

        // VIEW
        openMigrationWindow: function (title) {
            var migrationWindow = $("#migrationEntryWindow").data("kendoWindow");
            migrationWindow.title("Indicate SharePoint Site Migration");
            $("#migrationEntryWindow").css("display", "block");
            migrationWindow.center();
            migrationWindow.open();
            migrationWindow.refresh();
        },

        // VIEW
        add: function () {

            var mode = $("#mode").val();
       
            $('#selectedTreeNodeId').val("");
       
            applicationSiteViewModel.setData({});
       
            $("#txtEditBuildMasterName").data("kendoAutoComplete").value("");
            $("#txtEditApplicationType").data("kendoDropDownList").value("");
              
            this.openEditWindow("Add " + applicationsListViewModel.get("modeFullText"));
        },

        // VIEW
        edit: function (e) {
    
            if ($('#selectedTreeNodeId').val() != "") {
                
                this.openEditWindow("Edit " + applicationsListViewModel.get("modeFullText"));
            }
        },

        // VIEW
        enterMigration: function (e) {
            if ($('#selectedTreeNodeId').val() != "") {
                this.openMigrationWindow("Edit " + applicationsListViewModel.get("modeFullText"));
            }
        },

       save: function(e) {
           var validator = $("#applicationSiteEditWindow").kendoValidator({
               messages: {
                   // overrides the built-in message for the required rule
                   required: " "
               }
           }).data("kendoValidator");

           validator.validate();

           var mode = $("#mode").val();
           var selectedId = $('#selectedTreeNodeId').val();
           var json;
           var url;
           var verb;
           var self = this;
           if (selectedId) {
               verb = "PUT";
               url = rootServiceUrl + applicationsListViewModel.get("mode") + "/Update/" + selectedId;
           } else {
               verb = "POST";
               url = rootServiceUrl + applicationsListViewModel.get("mode") + "/Create";
           }

           json = this.instance.toJSON();
    
           kendo.ui.progress($("#applicationSiteEditWindow"), true);

           $.ajax({
               type: verb,
               url: url,
               data: json,
               dataType: "json"
           })
           .done(function (e) {

               $("#applicationSiteEditWindow").data("kendoWindow").close();

               applicationsListViewModel.setupSelectedGridForMode(mode, selectedId);
           })
           .fail(function (e) {
               if (e.responseJSON && e.responseJSON.Messages) {
                   applicationSiteViewModel.set("errorHtml", errorListTemplate(e.responseJSON.Messages));
                   alert(e.responseJSON.Messages);
               }
               else {
                   applicationSiteViewModel.set("errorHtml", errorListTemplate(["An error occurred while processing your request. Please try again later."]));

                   alert("An error occurred while processing your request. Please try again later.");
               }
           })
           .always(function () {
               kendo.ui.progress($("#applicationSiteEditWindow"), false);
           });


       },

        // VIEW
       cancel: function () {

           this.populateDetails($('#selectedTreeNodeId').val());

           $("#applicationSiteEditWindow").data("kendoWindow").close();

       }
    });

    applicationSiteViewModel.set("isTrue", true); /* for when you want to bind to something that's always true */
    applicationSiteViewModel.set("isFalse", false); /* for when you want to bind to something that's always false */

}(jQuery, kendo, ACent.Constants));
