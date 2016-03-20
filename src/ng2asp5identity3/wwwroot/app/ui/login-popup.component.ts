import {Component, OnInit, OnDestroy} from 'angular2/core';
import {Router} from "angular2/router";
import {SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES} from 'ng-semantic/semantic';

import {RouteKeys} from '../resources/route-keys';
import {StrResources} from '../resources/app-resources';
import {MembershipService, LoggerService} from '../services/services';
import {SemanticPopupHelper} from '../utilities/semantic-ui.helper';
import {UserInfo} from '../models/models';

import {LoginFormComponent} from './membership/login-form.component';
import {RegisterFormComponent} from './membership/register-form.component';
import {ForgotPasswordFormComponent} from './membership/forgot-password-form.component';
import {MembershipMenuComponent} from './membership/membership-menu.component';


@Component({
    selector: 'login-popup',
    templateUrl: 'app/ui/login-popup.component.html',
    directives: [
                SEMANTIC_COMPONENTS,
                SEMANTIC_DIRECTIVES,
                LoginFormComponent,
                RegisterFormComponent,
                ForgotPasswordFormComponent,
                MembershipMenuComponent
                ]
})
export class LoginPopupComponent implements OnInit, OnDestroy  {

    private strResouces = StrResources;
    private userInfo: UserInfo;

    private showLogin: boolean = true;
    private showRegister: boolean = false;
    private showForgotPassword: boolean = false;
    private showMenu: boolean = false;

    private popupHelper = new SemanticPopupHelper();

    constructor(private _router: Router, public _membershipService: MembershipService, private _logger: LoggerService) {

        _logger.log("LoginPopupComponent loaded.");
    }

    ngOnInit() {
        this.userInfo = new UserInfo();
        this._membershipService.currentUser.subscribe(
            (userInfo: UserInfo) => {
                if(userInfo.loggedIn) {
                    this.switchView(4);
                } else {
                    // if we were logged in and logged out - switch to login view
                    if( this.userInfo &&
                        this.userInfo.loggedIn === true &&
                        userInfo.loggedIn === false)
                    {
                        this.switchView(1);
                    }
                }
                this.userInfo = userInfo;
            });
    }

    ngOnDestroy() {

        this._membershipService.currentUser.unsubscribe();
    }

     doLoggedIn(success: boolean) {

        if(!success)
            return;

        this.popupHelper.hideAll();
        this.switchView(4);
        this._router.navigate( ['Home']);
    }

    doLoggedOut(success: boolean) {

        if(!success)
            return;

        this.popupHelper.hideAll();
        this.switchView(1);
        this._router.navigate( ['Home']);
    }

    doRegistered(success: boolean)  {

        if(!success)
            return;

        this.popupHelper.hideAll();
        this.switchView(1);
        this._router.navigate( ['MembershipNotification', {'action': RouteKeys.ConfirmEmail}]);
    }

    doForgotPassword (success: boolean) {

        if(!success)
            return;

        this.popupHelper.hideAll();
        this.switchView(1);
        this._router.navigate( ['MembershipNotification', {'action': RouteKeys.ForgotPassword}]);

    }

    switchView(view: number) {

        this.showLogin = false;
        this.showRegister = false;
        this.showForgotPassword = false;
        this.showMenu = false;

        if(view === 1) { this.showLogin = true; }
        if(view === 2) { this.showRegister = true; }
        if(view === 3) { this.showForgotPassword = true }
        if(view === 4) { this.showMenu = true }
    }

    loadAccountPage(page: number) {

        this.popupHelper.hideAll();
        if(page === 1) { this._router.navigate( ['MembershipManagement']); }
    }
}
