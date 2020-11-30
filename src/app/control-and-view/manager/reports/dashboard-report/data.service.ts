import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class DataService {

  constructor(private http: HttpClient) { }
  fromDate;
  toDate;
  employees;
  workorderTypes;
  emp;
  wOType;
  shifttype;
  shiftvalue;
  empname;
  wotypeName;
  setFromDate(from) {
    this.fromDate = from;
  }
  setToDate(to) {
    this.toDate = to;
  }
  setEmployees(employees) {
    this.employees = employees;
  }
  setWorkorderTypes(workordertypes) {
    this.workorderTypes = workordertypes;
  }
  setEmp(emp) {
    this.emp = emp;
  }
  setWOType(wotype) {
    this.wOType = wotype;
  }
  setWOTypeName(wotyName) {
    this.wotypeName = wotyName;
  }
  setempName(empName) {
    this.empname = empName;
  }
  setshiftType(shifttype) {
    this.shifttype = shifttype;
  }
  setshiftValue(shiftvalue) {
    this.shiftvalue = shiftvalue;
  }



  getFromDate() {
    let temp = this.fromDate;
    return temp;
  }
  getToDate() {
    let temp = this.toDate;
    return temp;
  }
  getEmployees() {
    let temp = this.employees;
    return temp;
  }
  getWorkorderTypes() {
    let temp = this.workorderTypes;
    return temp;
  }
  getEmp() {
    let temp = this.emp;
    return temp;
  }
  getWOType() {
    let temp = this.wOType;
    return temp;
  }
  getWOTypeName() {
    let temp = this.wotypeName;
    return temp;
  }
  getempName() {
    let temp = this.empname;
    return temp;
  }
  getshiftType() {
    let temp = this.shifttype;
    return temp;
  }
  getshiftValue() {
    let temp = this.shiftvalue;
    return temp;
  }
}

