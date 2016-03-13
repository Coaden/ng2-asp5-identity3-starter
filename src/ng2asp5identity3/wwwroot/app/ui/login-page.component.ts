import {Component, OnInit} from 'angular2/core';
import {Router} from "angular2/router";
import {SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES} from 'ng-semantic/semantic';

import {RouteKeys} from '../resources/route-keys';
import {LoggerService} from '../services/services';
import {LoginFormComponent} from './membership/login-form.component';
import {RegisterFormComponent} from './membership/register-form.component';
import {ForgotPasswordFormComponent} from './membership/forgot-password-form.component';

@Component({
    selector: 'login-page',
    templateUrl: 'app/ui/login-page.component.html',
    host: {
        class: 'ui grid container stackable'
    },
    directives: [
                SEMANTIC_COMPONENTS,
                SEMANTIC_DIRECTIVES,
                LoginFormComponent,
                RegisterFormComponent,
                ForgotPasswordFormComponent
                ]
})
export class LoginPageComponent {

    private showLogin: boolean = true;
    private showRegister: boolean = false;
    private showForgotPassword: boolean = false;

    constructor(private _router: Router, private _logger: LoggerService) {

        _logger.log("LoginPageComponent loaded.");
    }

     doLoggedIn(success: boolean) {

        if(!success)
            return;

        this._router.navigate( ['Home']);
    }

    doRegistered(success: boolean)  {

        if(!success)
            return;

        this._router.navigate( ['MembershipNotification', {'action': RouteKeys.ConfirmEmail}]);
    }

    doForgotPassword (success: boolean) {

        if(!success)
            return;

        this._router.navigate( ['MembershipNotification', {'action': RouteKeys.ForgotPassword}]);
    }

    switchView(view: number) {

        this.showLogin = false;
        this.showRegister = false;
        this.showForgotPassword = false;

        if(view === 1) { this.showLogin = true; }
        if(view === 2) { this.showRegister = true; }
        if(view === 3) { this.showForgotPassword = true }
    }
}
