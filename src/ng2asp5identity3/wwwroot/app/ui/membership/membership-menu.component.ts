import {Component, EventEmitter} from 'angular2/core';
import {SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES} from 'ng-semantic/semantic';

import {MembershipService, LoggerService} from '../../services/services';
import {StrResources} from '../../resources/app-resources';

@Component({
    selector: 'membership-menu',
    templateUrl: 'app/ui/membership/membership-menu.component.html',
    outputs: ['loggedOut', 'action'],
    directives: [SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES]
})
export class MembershipMenuComponent {

    public loggedOut: EventEmitter<boolean> = new EventEmitter<boolean>();
    public action: EventEmitter<number> = new EventEmitter<number>();

    public strResources = StrResources;

    constructor(private _membershipService: MembershipService, private _logger: LoggerService) {

        _logger.log(`MembershipMenuComponent loaded.`)
    }

    doLogout() {

        this._membershipService.logoff().subscribe(
                data => {
                    this._logger.log(data);
                    this.loggedOut.next(true);
                },
                err => {
                    this._logger.error(err);
                    this.loggedOut.next(false);
                },
                () => this._logger.log('Logoff complete.')
        );
    }

    doAccountManage() {
        this.action.next(1);
    }
}
