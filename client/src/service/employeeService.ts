import api from "./api";

export const employeeService = {
    getHome:()=> api.get('employee/home')
}