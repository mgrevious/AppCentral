// This reference 'hint' is needed to get kendo intellisense in this file.
/// <reference path="~/Scripts/kendo/2013.1.319/kendo.web.min.js" /> 
(function ($, kendo, constants) {

    applicationsListViewModel = kendo.observable({

        mode: "",
        modeAbbreviation: "",
        modeFullText: "",

        getUrl: "",
        includeInactive: false,
        includeMigrated: false,
        filterText: "",
        filterSPEnvironment: null,

        isSPSite: function () {

            this.get("instance");

            if (applicationsListViewModel.get("mode") === undefined) return false;

            return applicationsListViewModel.get("mode") === "SharePointSite";
        },

        changeMode: function (mode) {
            // $("#mode").val(mode);
            this.set("mode", mode);

            switch (mode) {

            case ACent.Constants.inetApplicationMode:

                this.set("modeAbbreviation", "app");
                this.set("modeFullText", "I-Net Application");
                break;
            
            case ACent.Constants.spSiteMode:

                this.set("modeAbbreviation", "sp");
                this.set("modeFullText", "SharePoint Site");
                break;
            
            case ACent.Constants.cmsSiteMode:

                this.set("modeAbbreviation", "cms");
                this.set("modeFullText", "CMS Site");
                break;

            case ACent.Constants.homepageSiteMode:

                this.set("modeAbbreviation", "hp");
                this.set("modeFullText", "Homepage Site");
                break;

            default:
                // Something went really wrong here.
                break;
            }

            constants.hightLightMenuTitleFromMode(mode);
            applicationSiteViewModel.changeMode(mode);
            this.setAddEditMigrateStatus();
        },
                
        getUrl: function () {
            return constants.serviceUrl + applicationsListViewModel.get("mode") + "/GetFiltered/";
        },

        applicationListDataSource: {},

        sharePointEnvironmentListDataSource: new kendo.data.DataSource({
            transport: {
                read: {
                    url: constants.sharePointEnvironmentGetUrl,
                    dataType: "json"
                },
                parameterMap: function (data, type) {
                    return data;
                }
            },
            schema: {
                data: function (x) {
                    return x.Data;
                },
                model: {
                    id: "Id",
                    hasChildren: function () {
                        return false;
                    },
                    fields: {
                        Id: { editable: false, nullable: false },
                        EnvironmentName: { editable: true, nullable: false }
                    }
                }
            },
            error: function (e) { alert(e.errorThrown); },
            sort: { field: "EnvironmentName", dir: "asc" }
        }),

        sharePointSiteListDataSource: new kendo.data.HierarchicalDataSource({
            transport: {
                read: {
                    url: constants.sharePointSiteGetActiveUrl,
                    dataType: "json"
                },
                parameterMap: function (data, type) {
                    return data;
                }
            },
            schema: {
                data: function (x) {
                    return x.Data;
                },
                model: {
                    id: "Id",
                    hasChildren: function () {
                        return false;
                    },
                    fields: {
                        Id: { editable: false, nullable: false },
                        Name: { editable: true, nullable: false }
                    }
                }
            },
            error: function (e) { alert(e.errorThrown); },
            sort: { field: "Name", dir: "asc" }
        }),

        sharePointGridDataSource: new kendo.data.DataSource({
            transport: {
                read: {
                    url: constants.sharePointSiteGetActiveUrl,
                    dataType: "json"
                },
                parameterMap: function (data, type) {
                    return data;
                }
            },
            schema: {
                data: function (x) {
                    return x.Data;
                },
                model: {
                    id: "Id",
                    hasChildren: function () {
                        return false;
                    },
                    fields: {
                        Id: { editable: false, nullable: false },
                        Name: { editable: true, nullable: false },
                        ProductionURL: { editable: false, nullable: true }
                    }
                }
            },
            error: function (e) { alert(e.errorThrown); },
            sort: { field: "Name", dir: "asc" }
        }),

        // Group-specific button updates. The isEditable and isMigratable flags
        // are set by the applicationSiteViewModel.
        setAddEditMigrateStatus: function () {
            var mode = this.get("modeAbbreviation");
            applicationSiteViewModel.set("isAddable",
              constants.isUserAdmin
               && (mode == "sp" || mode == "app" || mode == "cms") // not "hp"
               );
            applicationSiteViewModel.set("isEditable", false);
            applicationSiteViewModel.set("isMigratable", false);
        },

        setupGridDataSource: function () {
            
            this.set("applicationListDataSource", new kendo.data.HierarchicalDataSource({
                transport: {
                    read: {
                        url: applicationsListViewModel.getUrl(),
                        dataType: "json"
                    },

                    parameterMap: function (data, type) {
                        if (type === "read") {
                            //var filter = gridViewModel.get("filterText");
                            //if (filter !== "") {
                            //    data.filter = filter;
                            //}
                            //data.includeInactive = applicationsListViewModel.get("includeInactive");
                            //data.includeMigrated = applicationsListViewModel.get("includeMigrated");
                            data.includeInactive = $("#chkShowInactive").prop("checked");
                            data.includeMigrated = $("#chkShowMigrated").prop("checked");
                        }
                        return data;
                    }
                },
                schema: {
                    data: "Data",
                    model: {
                        id: "Id",
                        hasChildren: function () {
                            return (applicationsListViewModel.get("modeAbbreviation") == "hp") && (this.HasChildren);
                        },
                        fields: {
                            Id: { editable: false, nullable: false, type: "number" },
                            Name: { editable: false, nullable: true, type: "string" },
                            IsActive: { editable: false, nullable: false, type: "boolean" },
                            // Following only apply to SharePoint data. Harmless for other data.
                            SharePointEnvironmentId: { editable: false, nullable: true, type: "number" },
                            SharePointEnvironmentName: { editable: false, nullable: true, type: "string" },
                            MigrationSiteId: { editable: false, nullable: true, type: "number" },
                            MigrationSiteName: { editable: false, nullable: true, type: "string" },
                            MigrationReason: { editable: false, nullable: true, type: "string" },
                            MigratedByName: { editable: false, nullable: true, type: "string" },
                            MigratedDate: { editable: false, nullable: true, type: "date" }
                        }
                    }
                },
                error: function (e) { alert(e.errorThrown); },
                sort: { field: "Name", dir: "asc" }
            }));
        },
        
        setupSelectedGridForMode: function (mode, selectedId) {

            applicationsListViewModel.changeMode(mode);

            kendo.ui.progress($("#mainDiv"), true);

            $('#selectedTreeNodeId').val(selectedId);
            $('#filterText').val("");

            $('#selectedNodeId').val(selectedId);
            
            $('#mode').val(mode);
                            
            if ($.isEmptyObject(applicationsListViewModel.get("applicationListDataSource.transport")) !== true) {

                applicationsListViewModel.applicationListDataSource.read();
            }

            applicationSiteViewModel.populateDetails(selectedId);

            kendo.ui.progress($("#mainDiv"), false);
        },
        
        ondata: function () {
            var selected = $('#selectedNodeId').val();
            if (selected != "") {
                var treeView = $("#treeview").data("kendoTreeView");
                var dataItem = treeView.dataSource.get(selected)
                if (dataItem !== undefined) {
                    var node = treeView.findByUid(dataItem.uid);
                    treeView.select(node);
                }
                $('#selectedNodeId').val("");
            }
        },

        // FIXME: Is this needed or should we just use isSPSite()?
        isSPMode: function () {
            return (this.get("modeAbbreviation") == "sp");
        },

        refreshOne: function () {
            var id = $('#selectedTreeNodeId').val();
            applicationsListViewModel.OnSelect(id);
        },

        OnSelect: function (id) {
            $('#selectedTreeNodeId').val(id);
            applicationSiteViewModel.populateDetails(id);
        },

        ClearFilterText: function () {
            applicationsListViewModel.set("filterText", "");
            updateFilter(); // This should probably be done by binding something instead
        }
    });

    function updateFilter() {
        var filterSettings = [];
        var env = Number($("#ddlSharePointEnvironment").data("kendoDropDownList").value());
        var inactive = $("#chkShowInactive")[0].checked;
        var migrated = $("#chkShowMigrated")[0].checked;
        var filterText = $("#filterText").val().trim();

        if (env != undefined && env != "" && env != "0") {
            filterSettings.push({
                field: "SharePointEnvironmentId",
                operator: "equals",
                value: env
            });
        }

        if (!inactive) {
            filterSettings.push({
                field: "IsActive",
                operator: "greater",
                value: 0
            });
        }
        if (!migrated) {
            filterSettings.push({
                field: "IsMigrated",
                operator: "equal",
                value: false
            });
        }
        if (filterText != undefined && filterText.length > 0) {
            filterSettings.push({
                field: "Name",
                operator: "Contains",
                value: filterText
            });
        }
        var tv = $("#treeview").data("kendoTreeView");
        if (tv != null) {
            tv.dataSource.filter(filterSettings);
        }
    }

    // FIXME: This should probably be smarter about not updating the filter
    // every single time it's called. That is probably wasting time.
    function changeApplicationListView(e) {
        updateFilter();
    }

    // VIEW
    $(function () {
        $("#ddlSharePointEnvironment").kendoDropDownList({
            dataSource: applicationsListViewModel.sharePointEnvironmentListDataSource,
            dataTextField: "EnvironmentName",
            dataValueField: "Id",
            optionLabel: { Id: 0, EnvironmentName: "(all environments)" }
        });
        $(".filterInput").bind("change", updateFilter);
        $("#filterText").bind("keyup", updateFilter);
        // $("#filterText").on("click", ".ui-input-clear", updateFilter);

        changeApplicationListView();
        applicationsListViewModel.setupSelectedGridForMode($("#mode").val());
        applicationsListViewModel.setupGridDataSource();
        kendo.bind($(".applicationsListViewModelBound"), applicationsListViewModel);

        var treeview = $("#treeview").kendoTreeView({
            dataTextField: "Name",
            dataSource: applicationsListViewModel.get("applicationListDataSource"),
            select: function (e) {
                var dataItem = this.dataItem(e.node);
                var id = dataItem.Id;
                applicationsListViewModel.OnSelect(id);
            },
            dataBound: applicationsListViewModel.ondata,
            loadOnDemand: true
        }).data("kendoTreeView");
    });

}(jQuery, kendo, ACent.Constants));
