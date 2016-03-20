import {Injectable, bind} from 'angular2/core';
import {Http, HTTP_PROVIDERS, Response, Headers} from 'angular2/http';
import {Router} from 'angular2/router';

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject';
import 'rxjs/add/operator/map';

import {LoggerService, MessageService} from '../services/services';
import {AppSettings} from '../resources/app-settings'
import {StrResources} from '../resources/app-resources';
import {RouteKeys} from '../resources/route-keys';
import {LoginViewModel} from '../viewmodels/membership/login.viewmodel';
import {RegisterViewModel} from '../viewmodels/membership/register.viewmodel';
import {ForgotPasswordViewModel} from '../viewmodels/membership/forgot-password.viewmodel';
import {ResetPasswordViewModel} from '../viewmodels/membership/reset-password.viewmodel';
import {AccountDetailViewModel} from '../viewmodels/membership/account-detail.viewmodel';
import {ChangePasswordViewModel} from '../viewmodels/membership/change-password.viewmodel';

import {UserInfo} from '../models/models';

@Injectable()
export class MembershipService {

    private postHeaders: Headers;

    private userInfo: UserInfo;
    public currentUser: Subject<UserInfo>;
    public userLoaded: Subject<boolean>;

    constructor(private _router: Router, private _http: Http, private _logger: LoggerService, private _messageService: MessageService) {

        this.postHeaders = new Headers();
        this.postHeaders.append('Accept', 'application/json');
        this.postHeaders.append('Content-Type', 'application/json');

        this.userInfo;
        this.currentUser = new Subject<UserInfo>();
        this.userLoaded = new Subject<boolean>();
    }

    checkPageAuthorized(obj?: any): boolean {

        var result: boolean = this.checkAuthorized(obj);
        if(!result) {
            this._router.navigate( ['MembershipNotification', {'action': RouteKeys.NotPermitted, back: 2}]);
        }

        return result;
    }

    checkAuthorized(obj?: any): boolean {

        if(this.userInfo === undefined)
            throw new Error("Attempting checkAuthorized before userInfo loaded");

        obj.authenticated =  obj && obj.authenticated  || true;
        obj.confirmed     =  obj && obj.confirmed      || true;
        obj.allowedRoles  =  obj && obj.allowedRoles   || new Array<string>();
        obj.requiredRoles =  obj && obj.requiredRoles  || new Array<string>();


        if(obj.authenticated && !this.userInfo.loggedIn) {
            return false;
        }

        if(obj.confirmed && !this.userInfo.emailConfirmed) {
            return false;
        }

        if(obj.allowedRoles.length && this.userInfo.roles.map(ur => obj.allowedRoles.indexOf(ur) > -1).indexOf(true) === -1) {
            return false;
        }

        if(obj.requiredRoles.length && obj.requiredRoles.map(rr => this.userInfo.roles.indexOf(rr) > -1).indexOf(false) !== -1) {
            return false
        }

        return true;
    }

    updateUserInfo(): void {

        this._http.get(AppSettings.baseUrl + 'UserInfo/')
            .map((res: Response) => {
                return res.json();
            })
            .subscribe(
                json => {
                    this._logger.log(json);
                    this.userInfo = new UserInfo({
                        email: json.email,
                        emailConfirmed: json.emailConfirmed,
                        loggedIn: json.loggedIn,
                        roles: json.roles,
                        firstName: json.rirstName,
                        lastName: json.lastName,
                        company: json.company,
                        phone: json.phone
                    });
                },
                err => {
                    this._logger.error(err);
                    this._messageService.emitMessage(StrResources.message.UserPollCommunicationError)
                    this.userInfo = new UserInfo();
                },
                () => {
                    this.currentUser.next(this.userInfo);
                    this.userLoaded.next(true);
                }
            );
    }

    login(loginViewModel: LoginViewModel): Observable<any> {

        return this._http.post(AppSettings.baseUrl + 'Login/', JSON.stringify(loginViewModel), {headers: this.postHeaders})
            .map((res: Response) => res.json())
            .map((json: any) => {
                this.updateUserInfo();
                return json;
            });
    }

    logoff(): Observable<any> {

        return this._http.post(AppSettings.baseUrl + 'Logoff/', null, {headers: this.postHeaders})
            .map((res: Response) => res.json())
            .map((json: any) => {
                this.updateUserInfo();
                return json;
            });
    }

    register(registerViewModel: RegisterViewModel): Observable<any> {

        return this._http.post(AppSettings.baseUrl + 'Register/', JSON.stringify(registerViewModel), {headers: this.postHeaders})
            .map((res: Response) => res.json())
            .map((json: any) => {
                this.updateUserInfo();
                return json;
            });
    }

    forgotPassword(forgotPasswordViewModel: ForgotPasswordViewModel): Observable<any> {

        return this._http.post(AppSettings.baseUrl + 'ForgotPassword/', JSON.stringify(forgotPasswordViewModel), {headers: this.postHeaders})
            .map((res: Response) => res.json());
    }

    resetPassword(resetPasswordViewModel: ResetPasswordViewModel): Observable<any> {

        return this._http.post(AppSettings.baseUrl + 'ResetPassword/', JSON.stringify(resetPasswordViewModel), {headers: this.postHeaders})
            .map((res: Response) => res.json())
            .map((json: any) => {
                this.updateUserInfo();
                return json;
            });
    }

    changePassword(changePasswordViewModel: ChangePasswordViewModel): Observable<any> {

        return this._http.post(AppSettings.baseUrl + 'ChangePassword/', JSON.stringify(changePasswordViewModel), {headers: this.postHeaders})
            .map((res: Response) => res.json())
            .map((json: any) => {
                this.updateUserInfo();
                return json;
            });
    }

    updateAccountDetails(accountDetailViewModel: AccountDetailViewModel): Observable<any> {

        return this._http.post(AppSettings.baseUrl + 'UpdateAccountDetail/', JSON.stringify(accountDetailViewModel), {headers: this.postHeaders})
            .map((res: Response) => res.json())
            .map((json: any) => {
                this.updateUserInfo();
                return json;
            });
    }

}

export var MembershipServiceInjectables: Array<any> = [
    bind(MembershipService).toClass(MembershipService)
];
