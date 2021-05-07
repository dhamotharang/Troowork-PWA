import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DayPilot } from 'daypilot-pro-angular';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class DataServiceTokenStorageService {
    url_base64_decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }
        return window.atob(output);
    }

    role;
    IsSupervisor;
    name;
    employeekey;
    OrganizationID;
    isemployeecalendar;
    user;
    Organization;

    setValues() {
        const token = sessionStorage.getItem('token');
        const encodedProfile = token.split('.')[1];
        const profile = JSON.parse(this.url_base64_decode(encodedProfile));
        this.role = profile.role;
        this.IsSupervisor = profile.IsSupervisor;
        this.name = profile.username;
        this.employeekey = profile.employeekey;
        this.OrganizationID = profile.OrganizationID;
        this.isemployeecalendar = profile.isemployeecalendar;
        this.user = profile.user;
        this.Organization = profile.Organization;
    }

    getRole() {
        return this.role;
    }

    // setRole(role) {
    //     this.role = role;
    // }

    getIsSupervisor() {
        return this.IsSupervisor;
    }

    // setIsSupervisor(IsSupervisor) {
    //     this.IsSupervisor = IsSupervisor;
    // }

    getName() {
        return this.name;
    }

    // setName(name) {
    //     this.name = name;
    // }


    getEmployeekey() {
        return this.employeekey;
    }

    // setEmployeekey(employeekey) {
    //     this.employeekey = employeekey;
    // }

    getOrganizationID() {
        return this.OrganizationID;
    }

    // setOrganizationID(OrganizationID) {
    //     this.OrganizationID = OrganizationID;
    // }

    getIsemployeecalendar() {
        return this.isemployeecalendar;
    }

    // setIsemployeecalendar(isemployeecalendar) {
    //     this.isemployeecalendar = isemployeecalendar;
    // }

    getUser() {
        return this.user;
    }

    // setUser(user) {
    //     this.user = user;
    // }

    getOrganization() {
        return this.Organization;
    }

    // setOrganization(Organization) {
    //     this.Organization = Organization;
    // }
}


