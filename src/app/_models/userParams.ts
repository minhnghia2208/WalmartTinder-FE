import { User } from "./user";

export class UserParams {
    minAge = 18;
    maxAge = 99;
    pageNumber = 1;
    pageSize = 6;
    orderBy = 'lastActive';
    gender: string = "";
    attractiveness: string = "Average";

    constructor(user: User){
        this.gender = user.gender === 'female'? 'male':'female';
        
    }
}