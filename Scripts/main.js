// This reference 'hint' is needed to get kendo intellisense in this file.
/// <reference path="~/Scripts/kendo/2013.1.319/kendo.web.min.js" />
var rootServiceUrl = $("#serviceApiURL").val();

var inetApplicationMode = "INetApplication";
var spSiteMode = "SharePointSite";
var cmsSiteMode = "CMSSite";
var homepageSiteMode = "HomePageSite";

var applicationSiteViewModel;
var applicationsListViewModel;
var contactsViewModel;
var documentsViewModel;
var migrationViewModel;

var errorListTemplate = new kendo.template("<div>Please correct the following errors:<ul># for (var i = 0; i < data.length; ++i) { # <li>#= data[i] #</li> # } # </ul></div>");


$(function () {
    
    $("#vertical").kendoSplitter({
        orientation: "vertical",
        panes: [
            { collapsible: false },
            { collapsible: false, size: "100px" },
            { collapsible: false, resizable: false, size: "100px" }
        ]
    });

    $("#horizontal").kendoSplitter({
        panes: [
            { collapsible: true, size: "280px" },
            { collapsible: false },
        ]
    });

    $("#inetApplicationsPanelbar").kendoPanelBar({
        expandMode: "multiple"
    });

    $("#sharePointSitePanelBar").kendoPanelBar({
        expandMode: "multiple"
    });

    $("#cmsSitePanelBar").kendoPanelBar({
        expandMode: "multiple"
    });
    
    $("#homepageSitePanelBar").kendoPanelBar({
        expandMode: "multiple"
    });

    if ($("#mode").val() != "" &&
        $("#selectedTreeNodeId").val() != "") {
        applicationsListViewModel.setupSelectedGridForMode($("#mode").val(), $('#selectedTreeNodeId').val());
    }
    else if ($("#mode").val() != "") {
        applicationsListViewModel.setupSelectedGridForMode($("#mode").val());
    }
    else {
        applicationsListViewModel.setupSelectedGridForMode(inetApplicationMode);
    }
    
});

