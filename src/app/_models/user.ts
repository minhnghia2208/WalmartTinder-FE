export interface User {
    userName: string;
    access_Token: string;
    photoUrl: string;
    knownAs: string;
    gender: string;
    nLike: number;
    likeRead: boolean;
    roles: string[];
}