var ACent = ACent || {};
ACent.Constants = ACent.Constants || (function () {
    return {
        setConstants: function (url, corpDirUrl, msdUrl, isUserAdmin) {
            this.serviceUrl = url;

            this.inetApplicationUrl = this.serviceUrl + "INetApplication/",
            this.inetApplicationGetUrl = this.serviceUrl + "INetApplication/Get/",
            this.inetApplicationGetFilteredUrl = this.serviceUrl + "INetApplication/GetFiltered/",

            this.buildMasterGetUrl = this.serviceUrl + "BuildMaster/GetFiltered/",

            this.sharePointSiteUrl = this.serviceUrl + "SharePointSite/",
            this.sharePointSiteGetUrl = this.serviceUrl + "SharePointSite/Get/",
            this.sharePointSiteGetFilteredUrl = this.serviceUrl + "SharePointSite/GetFiltered/",
            this.sharePointSiteGetActiveUrl = this.serviceUrl + "SharePointSite/GetActive/",

            this.sharePointEnvironmentGetUrl = this.serviceUrl + "SharePointEnvironment/Get/",

            this.cmsSiteUrl = this.serviceUrl + "CMSSite/",
            this.cmsSiteGetUrl = this.serviceUrl + "CMSSite/Get/",
            this.cmsSiteGetFilteredUrl = this.serviceUrl + "CMSSite/GetFiltered/",

            this.homepageSiteUrl = this.serviceUrl + "HomePageSite/",
            this.homepageSiteGetUrl = this.serviceUrl + "HomePageSite/Get/",
            this.homepageSiteGetFilteredUrl = this.serviceUrl + "HomePageSite/GetFiltered/",

            this.applicationTypeUrl = this.serviceUrl + "ApplicationTypes/",

            this.contactsGetUrl = this.serviceUrl + "Contact/GetUsersByFilter/",
            this.contactsCreate = this.serviceUrl + "Contact/Create",
            this.contactsDelete = this.serviceUrl + "Contact/DeleteContact",

            this.documentsGetUrl = this.serviceUrl + "Document/GetDocument",
            this.documentsCreate = this.serviceUrl + "Document/Create",
            this.documentsUpdate = this.serviceUrl + "Document/Update/",
            this.documentsDelete = this.serviceUrl + "Document/DeleteDocument",

            this.documentTypeUrl = this.serviceUrl + "DocumentType/GetActive/",

            this.corpDirDetailsURL = corpDirUrl,
            this.medStaffDetailsURL = msdUrl,

            this.isUserAdmin = isUserAdmin === 'True',
                                    
            this.buildMasterOverviewFormat = "http://uhvtfsapp03:81/Applications/{0}/",
            this.buildMasterReleaseFormat = "http://uhvtfsapp03:81/Applications/{0}/Releases/Release.aspx?releaseNumber={1}",
            this.buildMasterBuildFormat = "http://uhvtfsapp03:81/Applications/{0}/Builds/Build.aspx?releaseNumber={1}&buildNumber={2}",
            this.buildMasterExecutionFormat = "http://uhvtfsapp03:81/Applications/{0}/Executions/ExecutionDetails.aspx?executionId={1}"

        },

        hightLightMenuTitleFromMode: function (mode) {

            var title = this.getMenuTitleFromMode(mode);

            if (title !== "") {
                $(".rmText", "#pagecontent .RadMenu").each(function (index, value) {
                    if ($(value).html() == title) {
                        $(value).css("background-color", "#c70909");
                        $(value).css("color", "white");
                    }
                });
            }
        },

        getMenuTitleFromMode: function (mode) {

            if (mode == ACent.Constants.inetApplicationMode) {

                return ACent.Constants.inetAppMenuTitle;
            }
            else if (mode == ACent.Constants.spSiteMode) {

                return ACent.Constants.spSiteMenuTitle;
            }
            else if (mode == ACent.Constants.cmsSiteMode) {

                return ACent.Constants.cmsSiteMenuTitle;
            }
            else if (mode == ACent.Constants.homepageSiteMode) {

                return ACent.Constants.homepageSiteMenuTitle;
            }
            else {
                return "";
            }
        },

        serviceUrl: "",

        inetApplicationUrl: "",
        inetApplicationGetUrl: "",

        applicationTypeUrl: "",

        buildMasterGetUrl: "",

        sharePointSiteUrl: "",
        sharePointSiteGetUrl: "",

        cmsSiteUrl: "",
        cmsSiteGetUrl: "",

        homepageSiteUrl: "",
        homepageSiteGetUrl: "",

        contactsGetUrl: "",
        contactsCreate: "",
        contactsDelete: "",

        documentsGetUrl: "",
        documentsCreate: "",
        documentsUpdate: "",
        documentsDelete: "",

        documentTypeUrl: "",

        corpDirDetailsURL: "",
        medStaffDetailsURL: "",

        buildMasterOverviewFormat: "",
        buildMasterReleaseFormat: "",
        buildMasterBuildFormat: "",
        buildMasterExecutionFormat: "",

        isUserAdmin: false,

        inetApplicationMode: "INetApplication",
        spSiteMode: "SharePointSite",
        cmsSiteMode: "CMSSite",
        homepageSiteMode: "HomePageSite",

        inetAppMenuTitle: "I-Net Applications",
        spSiteMenuTitle: "SharePoint Sites",
        cmsSiteMenuTitle: "CMS Sites",
        homepageSiteMenuTitle: "Homepage Sites",
        
        applicationRelationEnum:
        {
            INetAppOwner: 1,
            INetAppDeveloper: 2,
            SharePointSiteOwner: 3,
            SharePointSiteDeveloper: 4,
            CMSSiteOwner: 5,
            CMSSiteDeveloper: 6,
            HomePageSiteOwner: 7,
            HomePageSiteDeveloper: 8
        },

        documentApplicationRelationEnum:
        {
            INetApplication: 1,
            SharePointSite: 2,
            CMSSite: 3,
            HomePageSite: 4
        }
    };
}());