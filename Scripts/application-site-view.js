// This reference 'hint' is needed to get kendo intellisense in this file.
/// <reference path="~/Scripts/kendo/2013.1.319/kendo.web.min.js" />
(function ($, kendo, constants) {

    $(function () {
        var win = $("#applicationSiteEditWindow").kendoWindow({
            modal: true,
            width: "880px",
            open: function (e) {
            }
        }).data("kendoWindow");

        win.close();
        kendo.bind($(".applicationSiteViewModelBound"), applicationSiteViewModel);

        $("#txtEditApplicationType").kendoDropDownList({
            dataTextField: "Name",
            dataValueField: "INetApplicationTypeId",
            optionLabel: "Select",
            dataSource: {
                transport: {
                    read: {
                        dataType: "json",
                        url: rootServiceUrl + "ApplicationType/GetActive/?includeInactive=false",
                    }
                },
                schema: {
                    data: "Data"
                }
            }
        });

        $('#txtEditBuildMasterName').kendoAutoComplete({
            dataSource: applicationSiteViewModel.buildMasterDataSource,
            change: function () {
                this.dataSource.read();
            },
            width: "300px",
            filter: "contains",
            placeholder: "Select..."
        });

        $("[id $=OwnersGrid]").kendoGrid({
            selectable: false,
            sortable: true,
            pageable: true,
            navigatable: true,
            columns: [
                    { field: "ParentId", title: "Parent ID", width: 60, hidden: true },
                    { field: "ContactId", title: "Contact ID", width: 60, hidden: true },
                    { field: "PractitionerId", title: "Practitioner ID", width: 60, hidden: true },
                    {
                        field: "FullName"
                        , title: "Name"
                        , width: 70
                        , template: function (dataItem) {

                            if (dataItem.PractitionerId != null) {
                                return "<a href='" + constants.medStaffDetailsURL + dataItem.PractitionerId + "' target='_blank'>" + dataItem.FullName + "</a>";
                            }
                            else if (dataItem.ContactId != null) {
                                return "<a href='" + constants.corpDirDetailsURL + dataItem.ContactId + "' target='_blank'>" + dataItem.FullName + "</a>";
                            }
                            else {
                                return dataItem.FullName;
                            }
                        }
                    },
                    { field: "Department", title: "Department", width: 110 },
                    { field: "Phone", title: "Phone", width: 50 },
                     {
                         field: "Email"
                         , title: "Email"
                         , width: 70
                         , template: function (dataItem) {
                             return "<a href='mailto:" + dataItem.Email + "' >" + dataItem.Email + "</a>";
                         }
                     },
                     {
                         command: [
                             {
                                 name: "DeleteCustom",
                                 text: "<span class=\"k-icon k-delete\"></span>Delete",
                                 click: function (e) {
                                     e.preventDefault();

                                     if (confirm("Are you sure you want to delete this? This operation cannot be undone.")) {
                                         // e.target is the DOM element representing the button
                                         var tr = $(e.target).closest("tr"); // get the current table row (tr)

                                         // get the data bound to the current table row
                                         var data = this.dataItem(tr);

                                         contactsViewModel.delete(data);
                                     }
                                 }
                             }
                         ],

                         width: "65px"
                     }
            ],

            dataSource: applicationSiteViewModel.get('instanceOwners'),
            toolbar: [{
                template: function () {

                    if (constants.isUserAdmin === true) {
                        return '<a id="btnAddOwner" name="btnAddOwner" style="display:none;" class="k-button k-button-icontext k-grid-add" ><span class="k-icon k-add"></span>Add</a>';
                    }
                    else {
                        return '';
                    }
                }
            }]
        });


        $("[id $=DevelopersGrid]").kendoGrid({
            selectable: false,
            sortable: true,
            pageable: true,
            navigatable: true,
            columns: [
                    { field: "ParentId", title: "Parent ID", width: 60, hidden: true },
                    { field: "ContactId", title: "Contact ID", width: 60, hidden: true },
                    { field: "PractitionerId", title: "Practitioner ID", width: 60, hidden: true },
                    {
                        field: "FullName"
                        , title: "Name"
                        , width: 70
                        , template: function (dataItem) {

                            if (dataItem.PractitionerId != null) {
                                return "<a href='" + constants.medStaffDetailsURL + dataItem.PractitionerId + "' target='_blank'>" + dataItem.FullName + "</a>";
                            }
                            else if (dataItem.ContactId != null) {
                                return "<a href='" + constants.corpDirDetailsURL + dataItem.ContactId + "' target='_blank'>" + dataItem.FullName + "</a>";
                            }
                            else {
                                return dataItem.FullName;
                            }
                        }
                    },
                    { field: "Department", title: "Department", width: 110 },
                    { field: "Phone", title: "Phone", width: 50 },
                     {
                         field: "Email"
                         , title: "Email"
                         , width: 70
                         , template: function (dataItem) {
                             return "<a href='mailto:" + dataItem.Email + "' >" + dataItem.Email + "</a>";
                         }
                     },
                     {
                         command: [
                             {
                                 name: "DeleteCustom",
                                 text: "<span class=\"k-icon k-delete\"></span>Delete",
                                 click: function (e) {
                                     e.preventDefault();

                                     if (confirm("Are you sure you want to delete this? This operation cannot be undone.")) {
                                         // e.target is the DOM element representing the button
                                         var tr = $(e.target).closest("tr"); // get the current table row (tr)

                                         // get the data bound to the current table row
                                         var data = this.dataItem(tr);

                                         contactsViewModel.delete(data);
                                     }
                                 }
                             }
                         ],

                         width: "65px"
                     }
            ],

            dataSource: applicationSiteViewModel.get('instanceDevelopers'),
            toolbar: [{
                template: function () {

                    if (constants.isUserAdmin === true) {
                        return '<a id="btnAddDeveloper" name="btnAddDeveloper" style="display:none;" class="k-button k-button-icontext k-grid-add"><span class="k-icon k-add"></span>Add</a>';
                    }
                    else {
                        return '';
                    }
                }
            }]
        });
        
        $("[id=appDocumentsGrid], [id=cmsDocumentsGrid]").kendoGrid({
            selectable: false,
            sortable: true,
            pageable: true,
            navigatable: true,
            columns: [
                    { field: "ParentId", title: "Parent ID", width: 60, hidden: true },
                    { field: "ApplicationId", title: "Application ID", width: 60, hidden: true },
                    { field: "DocumentType.Name", title: "Type", width: 70 },
                    {
                        field: "FullName"
                        , title: "Name"
                        , width: 250
                        , template: function (dataItem) {

                            if (dataItem.DocumentType.Name == "File System") {

                                return "<a href='file:///" + dataItem.Location + "'>" + dataItem.Name + "</a>";
                            }
                            else {

                                return "<a href='" + dataItem.Location + "' target='_blank'>" + dataItem.Name + "</a>";
                            }


                        }
                    },
                     {
                         command: [
                             {
                                 name: "EditCustom",
                                 text: "<span class=\"k-icon k-edit\"></span>Edit",
                                 click: function (e) {
                                     e.preventDefault();

                                     // e.target is the DOM element representing the button
                                     var tr = $(e.target).closest("tr"); // get the current table row (tr)

                                     // get the data bound to the current table row
                                     var data = this.dataItem(tr);

                                     // Make a copy of the data so that changes won't affect the grid's data.
                                     var copiedData = JSON.parse(JSON.stringify(data));

                                     documentsViewModel.openEditDialog(copiedData, "Edit Document");
                                 }
                             },
                             {
                                 name: "DeleteCustom",
                                 text: "<span class=\"k-icon k-delete\"></span>Delete",
                                 click: function (e) {
                                     e.preventDefault();

                                     if (confirm("Are you sure you want to delete this? This operation cannot be undone.")) {
                                         // e.target is the DOM element representing the button
                                         var tr = $(e.target).closest("tr"); // get the current table row (tr)

                                         // get the data bound to the current table row
                                         var data = this.dataItem(tr);

                                         documentsViewModel.delete(data);
                                     }
                                 }
                             }
                         ],

                         width: "120px"
                     }
            ],

            dataSource: applicationSiteViewModel.get('instanceDocuments'),
            toolbar: [{
                template: function () {

                    if (constants.isUserAdmin === true) {
                        return '<a id="btnAddDocument" name="btnAddDocument" style="display:none;" class="k-button k-button-icontext k-grid-add" ><span class="k-icon k-add"></span>Add</a>';
                    }
                    else {
                        return '';
                    }
                }

            }]
        });

        $("[id=spDocumentsGrid]").kendoGrid({
            selectable: false,
            sortable: true,
            pageable: true,
            navigatable: true,
            columns: [
                    { field: "ParentId", title: "Parent ID", width: 60, hidden: true },
                    { field: "ApplicationId", title: "Application ID", width: 60, hidden: true },
                    {
                          field: "Name"
                        , title: "Name"
                        , width: 250
                    },
                    { field: "FileSize", title: "File Size (KB)", format: "{0:n1}", width: 70 },
                    { field: "FormattedModifiedDate", title: "Modified Date", width: 90 },
                    { field: "ModifiedByName", title: "Modified By", width: 120 }
            ],

            dataSource: applicationSiteViewModel.get('instanceDocuments'),
            toolbar: [{
                template: function () {

                    if (constants.isUserAdmin === true) {
                        return '<a id="btnAddDocument" name="btnAddDocument" style="display:none;" class="k-button k-button-icontext k-grid-add" ><span class="k-icon k-add"></span>Add</a>';
                    }
                    else {
                        return '';
                    }
                }

            }]
        });

        $("#appBuildMasterGrid").kendoGrid({
            selectable: false,
            sortable: true,
            pageable: true,
            navigatable: true,
            columns: [
                    {
                        field: "ApplicationName"
                        , title: "Application"
                        , width: 90
                        , template: function (dataItem) {

                            return "<a href='" + constants.buildMasterOverviewFormat.format(dataItem.ApplicationId) + "' target='_blank'>" + dataItem.ApplicationName + "</a>";
                        }
                    },
                    { field: "EnvironmentName", title: "Environment", width: 80 },
                    {
                        field: "ReleaseNumber"
                        , title: "Release"
                        , width: 80
                        , template: function (dataItem) {

                            return "<a href='" + constants.buildMasterReleaseFormat.format(dataItem.ApplicationId, dataItem.ReleaseNumber) + "' target='_blank'>" + "Release " + dataItem.ReleaseNumber + "</a>";
                        }
                    },
                    {
                        field: "BuildNumber"
                        , title: "Build"
                        , width: 60
                        , template: function (dataItem) {

                            return "<a href='" + constants.buildMasterBuildFormat.format(dataItem.ApplicationId, dataItem.ReleaseNumber, dataItem.BuildNumber) + "' target='_blank'>" + "Build " + dataItem.BuildNumber + "</a>";
                        }
                    },
                    {
                        field: "ExecutionEndedDate"
                        , title: "Execution"
                        , width: 110
                        , template: function (dataItem) {

                            return "<a href='" + constants.buildMasterExecutionFormat.format(dataItem.ApplicationId, dataItem.ExecutionId) + "' target='_blank'>" + kendo.toString(kendo.parseDate(dataItem.ExecutionEndedDate), "M/d/yyyy h:mm:ss tt") + "</a>";
                        }
                    }
            ],
            dataSource: applicationSiteViewModel.get('instanceBuildMasterExecutions')
        });

        $("[id ^='btnAdd']").click(function (e) {

            e.preventDefault();

            if (e.currentTarget.id === 'btnAddOwner') {

                contactsViewModel.openDialog('Add Owner');
            }
            else if (e.currentTarget.id === 'btnAddDeveloper') {

                contactsViewModel.openDialog('Add Developer');
            }
            else if (e.currentTarget.id === 'btnAddDocument') {

                documentsViewModel.openDialog('Add Document');
            }

        });

    });


}(jQuery, kendo, ACent.Constants));