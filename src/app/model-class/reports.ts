import { Time } from "@angular/common";

export interface Reports {
    SupervisorKey: number;
    SupervisorText: String;

    reportpietext:String;
    InspectionOrderKey: number;
    TemplateId: number;
    TemplateName: string;
    InspectionDate: Date;
    InspectionTime: Time;
    FacilityName: string;

    RoomId: string;
    RoomType: string;
    
    EmployeeKey: number;
    LastName: string;
    FirstName: string;
    EmployeeName: string;

    InspectionCompletedBy: number;
    id: number;
    totalItems: 10;

    EquipmentKey: number;
    EquipmentName: string;
    EquipmentTypeKey: number;
    EquipmentType:string;
    EquipmentTypeText: string;
    EquipmentTypeDescription: string;
    
    FacilityKey: number;
    FacilityText: string;
    //dashboard report
    EmployeeText:string;
    JobTitle:string;
    PrimaryPhone:string;
    WorkorderTypeKey: number;
    WorkorderTypeText: string;
    WorkorderStatus:string;
    WorkorderStatusKey: number;
    WorkorderTypeName:string;
    WorkorderTime:string;
    WorkorderDate:string;

    checkin:string;
    checkout:string;
    duration:string;
    DelayTime:Time;
    WorkorderNotes:string;


    statusKey: number;
    empname: string;
    
    FloorKey:number;
    FloorName:string;

    ZoneKey:number;
    ZoneName:string;

    RoomTypeKey:number;
    RoomTypeName:string;

    Barcode1:number;

    RoomKey:number;
    RoomName:string;

    BatchScheduleNameKey:number;
    ScheduleName:string;
    Area: number;
    BatchSchduleName:string;
    FloorTypeName: string;
    MetricType: string;
    MetricValue: number;
    OccurrenceInterval: string;
    fri: number;
    mon: number;
    sat: number;
    sun: number;
    thu: number;
    tue: number;
    wed: number;
    dailyFrequency:number;
    Frequency:number;
    Mon:string;
    Tue:string;
    Wed:string;
    Thu:string;
    Fri:string;
    Sat:string;
    Sun:string;
    IsPhotoRequired:number;
    IsBarcodeRequired:number;

}
