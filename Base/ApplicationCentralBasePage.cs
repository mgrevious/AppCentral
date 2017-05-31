using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using UH.CMS.Core.Web.Controls;
using UH.Common.Web.Bases;

namespace UH.ApplicationCentral.Web
{
    public abstract class ApplicationCentralBasePage : KendoContentBasePage
    {
        protected override void PopulateMenu()
        {
        }

        protected override string AccessDeniedUrl
        {
            get { return "~/AccessDenied.aspx"; }
        }

        protected override void OnInit(EventArgs args)
        {
            TopMenuData = PopulateTopMenuItems();

            base.OnInit(args);
        }

        public PlainMenu PopulateTopMenuItems()
        {
            PlainMenu mainTop = new PlainMenu()
            {
                MenuId = 1,
                Location = "Top",
                MenuName = "MainTop",
                MenuItems = new List<PlainMenuItem>()
            };

            mainTop.MenuItems.Add(new PlainMenuItem()
            {
                MenuItemId = 1,
                MenuId = 1,
                ParentID = null,
                Title = "I-Net Applications",
                UrlLink = "~/Default.aspx?mode=INetApplication"
            });

            mainTop.MenuItems.Add(new PlainMenuItem()
            {
                MenuItemId = 2,
                MenuId = 1,
                ParentID = null,
                Title = "SharePoint Sites",
                UrlLink = "~/Default.aspx?mode=SharePointSite"
            });

            mainTop.MenuItems.Add(new PlainMenuItem()
            {
                MenuItemId = 3,
                MenuId = 1,
                ParentID = null,
                Title = "CMS Sites",
                UrlLink = "~/Default.aspx?mode=CMSSite"
            });

            mainTop.MenuItems.Add(new PlainMenuItem()
            {
                MenuItemId = 4,
                MenuId = 1,
                ParentID = null,
                Title = "Homepage Sites",
                UrlLink = "~/Default.aspx?mode=HomePageSite"
            });


            mainTop.MenuItems.Add(new PlainMenuItem()
            {
                MenuItemId = 5,
                MenuId = 1,
                ParentID = null,
                Title = "Reports",
                UrlLink = "/UHAdministration/InformationTechnologySolutions/ApplicationDevelopment/Reports.aspx"
            });

            return mainTop;
        }

        protected override ICollection<string> GetRequiredUserRoles()
        {
            return new string[] { DefaultApplicationRoles.ApplicationAdministrator };
        }

        protected override bool RequiresAuthenticatedUser
        {
            get 
            {
                bool secureSite;

                return (!string.IsNullOrWhiteSpace(ConfigurationManager.AppSettings["SecureSite"]) &&
                        bool.TryParse(ConfigurationManager.AppSettings["SecureSite"], out secureSite) &&
                        secureSite == true); 
            }
        }
    }
}