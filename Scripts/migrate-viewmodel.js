// This reference 'hint' is needed to get kendo intellisense in this file.
/// <reference path="~/Scripts/kendo/2013.1.319/kendo.web.min.js" />
(function ($, kendo, constants) {
    migrationViewModel = kendo.observable({

        errorHtml: "",

        win: null,

        close: function () {
            if (migrationViewModel.win != null) {
                migrationViewModel.win.close();
            }
        },

        save: function (e) {
            this.saveMigration(e);
        },

        cancel: function (e) {
            this.close();
        },

        // VIEW
        saveMigration: function (e) {

            var validatable = $("#migrationEntryWindow").kendoValidator({
                errorTemplate: "<span>You have to enter a reason for the migration here.</span>" // use #=message# ?
            }).data("kendoValidator");

            if (validatable.validate()) {

                var selectedId = applicationSiteViewModel.get("instance.Id");
                var destinationSiteId = applicationSiteViewModel.get("selectedMigrationDestination");
                var migrationReason = migrationViewModel.get("migrationReason");
                var mode = applicationsListViewModel.get("mode");

                $.ajax({
                    type: "PUT",
                    url: rootServiceUrl + mode + "/Migrate/",
                    data: {
                        OriginalSiteId: selectedId,
                        MigrationSiteId: destinationSiteId,
                        MigrationReason: migrationReason
                    },
                    dataType: "json"
                })
                .done(function (e) {
                     migrationViewModel.close();
                     applicationsListViewModel.setupSelectedGridForMode(mode, selectedId);
                 })
                .fail(function (e) {
                    // $(".migrationError").css("width", $(".migrationNotError").css("width"));
                    if (e.responseJSON && e.responseJSON.Messages) {
                        migrationViewModel.set("errorHtml", errorListTemplate(e.responseJSON.Messages));
                    }
                    else {
                        migrationViewModel.set("errorHtml", errorListTemplate(["An error occurred while processing your request. Please try again later."]));
                    }
                })
                .always(function () {
                    kendo.ui.progress($("#applicationSiteEditWindow"), false);
                });
                kendo.ui.progress($("#applicationSiteEditWindow"), true);
            }
        },

        updateMigrationFilter: function (e) {
            var filterSettings = migrationViewModel.getMigrationFilter();
            var list = $("#pickMigratedSiteId").data("kendoGrid");
            if (list != null) {
                list.dataSource.filter(filterSettings);
            }
        },

        getMigrationFilter: function () {
            var url = this.get("migrationSearchUrl");
            var site = this.get("migrationSearchSiteName");
            var env = this.get("migrationSearchEnvironment.Id");
            var filterSettings = [];
            if (url != undefined && url != "") {
                filterSettings.push({ field: "URL", operator: "contains", value: url });
            }
            if (site != undefined && site != "") {
                filterSettings.push({ field: "Name", operator: "contains", value: site });
            }
            if (env != undefined && env != null) {
                filterSettings.push({ field: "SharePointEnvironmentId", operator: "eq", value: env });
            }
            return filterSettings;
        }

    });
    migrationViewModel.win = $("#migrationEntryWindow").kendoWindow({
        resizable: false,
        modal: true,
        open: function (e) {
            $("#migrationSearchEnvironment").kendoDropDownList({
                dataSource: applicationsListViewModel.sharePointEnvironmentListDataSource,
                dataTextField: "EnvironmentName",
                dataValueField: "Id",
                optionLabel: { Id: 0, EnvironmentName: "(all environments)" }
            })
            //$("#migrationSearchUrl").text("");
            //$("#migrationSearchSiteName").text("");
            //$("#migrationSearchEnvironment").val(undefined);
            migrationViewModel.set("migrationSearchUrl", "");
            migrationViewModel.set("migrationSearchSiteName", "");
            migrationViewModel.set("migrationSearchEnvironment", undefined);
            migrationViewModel.set("migrationReason", "");
            migrationViewModel.updateMigrationFilter();
        },
        error: function (e) { alert(e.errorThrown); }
    }).data("kendoWindow");
    kendo.bind($(".migrationViewModelBound"), migrationViewModel);
    $("#migrationSearchUrl").bind("keyup", migrationViewModel.updateMigrationFilter);
    $("#migrationSearchSiteName").bind("keyup", migrationViewModel.updateMigrationFilter);
    $("#migrationSearchEnvironment").bind("change", migrationViewModel.updateMigrationFilter);
    $("#pickMigratedSiteId").kendoGrid({
        dataSource: applicationsListViewModel.sharePointGridDataSource
        , selectable: true
        , columns: [
              { field: "Name", title: "Site Name", width: "18em" }
            , { field: "URL", title: "URL", width: "30em" }
        ]
        , change: function (e) {
            var selectedRow = e.sender.dataItem(e.sender.select());
            var id = selectedRow.Id;
            //$('#selectedTreeNodeId').val(id);
            applicationSiteViewModel.set("selectedMigrationDestination", id);
        }
        , dataBound: applicationsListViewModel.ondata
    });
    migrationViewModel.close();
}(jQuery, kendo, ACent.Constants));
