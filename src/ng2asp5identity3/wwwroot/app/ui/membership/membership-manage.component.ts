import {Component} from 'angular2/core';

import {SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES} from 'ng-semantic/semantic';
import {LoggerService} from '../../services/services';
import {StrResources} from '../../resources/app-resources';
import {AccountDetailFormComponent} from './account-detail-form.component';
import {ChangePasswordFormComponent} from './change-password-form.component';

@Component({
    selector: 'membership-manage',
    host: {
        class: 'ui grid container'
    },
    templateUrl: 'app/ui/membership/membership-manage.component.html',
    directives: [SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES, AccountDetailFormComponent, ChangePasswordFormComponent]
})
export class MembershipManageComponent {

    private strResources = StrResources;

    constructor(private _logger: LoggerService) {

        _logger.log(`MembershipManageComponent loaded.`)
    }
}
