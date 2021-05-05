import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DayPilot } from 'daypilot-pro-angular';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class DataServiceTokenStorageService {
    role;
    IsSupervisor;
    name;
    employeekey;
    OrganizationID;
    isemployeecalendar;
    user;
    Organization;

    getRole() {
        return this.role;
    }

    setRole(role) {
        this.role = role;
    }

    getIsSupervisor() {
        return this.IsSupervisor;
    }

    setIsSupervisor(IsSupervisor) {
        this.IsSupervisor = IsSupervisor;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }


    getEmployeekey() {
        return this.employeekey;
    }

    setEmployeekey(employeekey) {
        this.employeekey = employeekey;
    }

    getOrganizationID() {
        return this.OrganizationID;
    }

    setOrganizationID(OrganizationID) {
        this.OrganizationID = OrganizationID;
    }

    getIsemployeecalendar() {
        return this.isemployeecalendar;
    }

    setIsemployeecalendar(isemployeecalendar) {
        this.isemployeecalendar = isemployeecalendar;
    }

    getUser() {
        return this.user;
    }

    setUser(user) {
        this.user = user;
    }

    getOrganization() {
        return this.Organization;
    }

    setOrganization(Organization) {
        this.Organization = Organization;
    }
}


