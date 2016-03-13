import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES} from 'ng-semantic/semantic';

import {RouteKeys} from '../../resources/route-keys';
import {StrResources} from '../../resources/app-resources';
import {LoggerService} from '../../services/services';
import {Message} from '../../models/models';

@Component({
    selector: 'membership-notification',
    host: {
        class: 'ui grid container'
    },
    templateUrl: 'app/ui/membership/membership-notification.component.html',
    directives: [SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES]
})
export class MembershipNotificationComponent {

    private pageTitle: string = StrResources.membershipForms.notificationTitle;
    public strResources = StrResources;
    private message: Message;
    private showBack: boolean;
    private back: any;

    constructor(private routeParams: RouteParams, private _logger: LoggerService) {

        _logger.log(`MembershipNotificationComponent loaded.`)

        let action = routeParams.get('action');
        this.back = routeParams.get('back') || 0;
        this.showBack = this.back > 0;

        switch(action) {
            case RouteKeys.MembershipError: {
                this.message =  StrResources.message.UnexpectedError;
                break;
            }

            case RouteKeys.ConfirmEmail: {
                this.message =  StrResources.message.ConfirmEmailSent;
                break;
            }

            case RouteKeys.EmailConfirmed: {
                this.message =  StrResources.message.YouAreConfirmed;
                break;
            }

            case RouteKeys.ForgotPassword: {
                this.message =  StrResources.message.ForgotPasswordEmailSent;
                break;
            }

            case RouteKeys.ChangedPassword: {
                this.message =  StrResources.message.PasswordChanged;
                break;
            }

            case RouteKeys.NotConfirmed: {
                this.message =  StrResources.message.NotConfirmed;
                break;
            }

            case RouteKeys.NotLoggedIn: {
                this.message =  StrResources.message.NotLoggedIn;
                break;
            }

            case RouteKeys.NotPermitted: {
                this.message =  StrResources.message.NotPermitted;
                break;
            }

            default: {
                break;
            }
        }
    }

    goBack() {
        window.history.go(this.back * -1);
    }
}
