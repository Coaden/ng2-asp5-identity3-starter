import {bind} from 'angular2/core';

export class UserInfo {
    // Authentication and Authorization
    public loggedIn: boolean;
    public email: string;
    public emailConfirmed: boolean;
    public roles: Array<string>;

    // UserDetails
    public firstName: string;
    public lastName: string;
    public company: string;
    public phone: string;

    constructor(obj?: any) {
        this.email =            obj && obj.email            || '';
        this.emailConfirmed =   obj && obj.emailConfirmed   || false;
        this.loggedIn =         obj && obj.loggedIn         || false;
        this.roles =            obj && obj.roles            || new Array<string>();
        this.firstName =        obj && obj.firstName        || '';
        this.lastName =         obj && obj.lastName         || '';
        this.company =          obj && obj.company          || '';
        this.phone =            obj && obj.phone            || '';
    }
}

export var UserInfoModel: Array<any> = [
    bind(UserInfo).toClass(UserInfo)
];
