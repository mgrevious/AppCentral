import { Component, Input } from '@angular/core';
import { iNetAppDetail } from './inet-app-detail';
import { iNetApplication } from './inet-application';
//import { SimpleTinyDirective} from './simple-tiny.directive';

@Component({
    selector: 'uh-inet-app-detail',
    templateUrl: 'inet-app-detail.component.html'
})
export class iNetApplicationDetailComponent
{
    @Input()
    private appDetail: iNetApplication;
    //{
    //    Name: "Test Application",
    //    Description: "A test application",
    //    ApplicationType: "CMS",
    //    IntegrationUrl: "http://int.intranet.uhhospitals.org/testapp",
    //    TrainingUrl: "http://training.intranet.uhhospitals.org/testapp",
    //    TestUrl: "https://test.intranet.uhhospitals.org/testapp",
    //    StagingUrl: "https://staging.intranet.uhhospitals.org/testapp",
    //    ProductionUrl: "https://intranet.uhhospitals.org/AccessManagementApplication/",
    //    ContainsBhi: true,
    //    CodeLocation: "UH\\CMS\\Test\\Trunk\\Silverlight",
    //    DateCreated: "August 30, 2016",
    //    BuildMasterAppName: "AppName"
    //};
    private ownerGridData: Owner[] = ownersMockData;
    private developersGridData: Developer[] = developersMockData;
    private documentsGridData: Document[] = documentMockData;
    private buildMasterGridData: BuildMasterData[] = buildMasterData;
}

export class Owner {
    Name: string;
    Department: string;
    Phone: string;
    Email: string;
}

export class Developer {
    Name: string;
    Department: string;
    Phone: string;
    Email: string;
}

export class Document {
    Type: string;
    Name: string;
}

export class BuildMasterData {
    Application: string;
    Environment: string;
    Release: string;
    Build: string;
    Execute: string;
}

export const ownersMockData: Owner[] = [
    {
        "Name": "Owner Name",
        "Department": "Owner Department",
        "Phone": "Owner Phone",
        "Email": "Owner Email"
    }
];

export const developersMockData: Owner[] = [
    {
        "Name": "Developers Name",
        "Department": "Developers Department",
        "Phone": "Developers Phone",
        "Email": "Developers Email"
    }
];

export const documentMockData: Document[] = [
    {
        "Type": "Type Data",
        "Name": "Name Data"
    }
];

export const buildMasterData: BuildMasterData[] = [
{
    "Application": "Test Application",
    "Environment": "Test",
    "Release": "release/site",
    "Build": "build/site",
    "Execute": "execute/site"
}];
