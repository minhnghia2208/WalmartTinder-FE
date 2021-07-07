export interface User {
    userName: string;
    access_Token: string;
    refresh_Token: string;
    photoUrl: string;
    knownAs: string;
    gender: string;
    roles: string[];
}