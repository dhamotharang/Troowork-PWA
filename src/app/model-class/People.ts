import { Time } from "@angular/common";

export interface People {
    JobTitle: String;
    JobTitleDescription: String;
    JobTitleKey: Number;
    EmailID: String;
    newmail: String;
    totalItems: Number;

    EventName: String;
    EventVenue: String;
    MeetingNotes: String;
    EventStartTime: Time;
    EventEndTime: Time;
    EventHost: String;
    EventDate: String;
    EventKey: Number;
    EmployeeName: String;
    ActionKey: Number;
    Action: String;
    ActionTypeKey: Number;
    ActionType: String;
    HasAttended: Number;
    EmployeeKey: Number;


    JobTitleText: String;
    EmployeeText: String;
    FirstName: String;
    LastName: String;


    Venue: String;
    StartTime: Time;
    EndTime: Time;
    MeetingDate: String;
    
    // ****@Pooja's code starts****
    OrganizationID :Number;
    empkey:Number;
    jobtitleString:any;
    searchEmployee:any;
    SearchKey:Number;
    BirthDate: Date;
    HireDate: Date;
    ondate:Date;
    employeekey:Number;
    // ****@Pooja's code Ends****
}
