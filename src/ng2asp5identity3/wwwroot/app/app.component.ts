import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig, Router} from "angular2/router";

import {LoggerService} from './services/services';
import {MenuComponent} from './ui/menu.component';

import {MembershipManageComponent} from './ui/membership/membership-manage.component';
import {LoginPageComponent} from './ui/login-page.component';
import {ResetPasswordFormComponent} from './ui/membership/reset-password-form.component';
import {MembershipNotificationComponent} from './ui/membership/membership-notification.component';
import {HomeComponent} from './ui/home/home.component';
import {CompaniesComponent} from './ui/main/companies.component';
import {MessageOutletComponent} from './ui/message-outlet.component';
import {UserInfo} from './models/models';


@Component({
    selector: 'ng2-app',
    templateUrl: 'app/app.component.html',
    directives: [MenuComponent, MessageOutletComponent, ROUTER_DIRECTIVES]
})
@RouteConfig([
    { path: '/', name: 'Root', redirectTo: ['Home'], useAsDefault: true},
    { path: '/home', name: 'Home', component: HomeComponent },
	{ path: "/companies", name: "Companies", component: CompaniesComponent },
    { path: "/membership", name: "MembershipManagement", component: MembershipManageComponent },
    { path: "/login", name: "Login", component: LoginPageComponent },
    { path: "/reset-password", name: "ResetPassword", component: ResetPasswordFormComponent },
    { path: "/membership-notification/:action", name: "MembershipNotification", component: MembershipNotificationComponent }
])
export class AppComponent implements OnInit {
    public title = 'main Research';

    constructor(private _router: Router, private _logger: LoggerService) {

        _logger.log(`AppComponent loaded.  main Research appication started.`)
    }

    ngOnInit() {

    }
}
