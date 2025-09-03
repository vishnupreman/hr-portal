import api from "./api";

export const hrService = {
    getHome:()=> api.get('hr/home')
}