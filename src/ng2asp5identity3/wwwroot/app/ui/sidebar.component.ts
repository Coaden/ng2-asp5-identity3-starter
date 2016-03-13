import {Component, OnInit, OnDestroy} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router'
import {SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES} from 'ng-semantic/semantic';
import {CORE_DIRECTIVES} from 'angular2/common';

import {SemanticSidebarHelper} from '../utilities/semantic-ui.helper';
import {RouteKeys} from '../resources/route-keys';
import {StrResources} from '../resources/app-resources';
import {MembershipService, LoggerService, MessageService} from '../services/services';
import {UserInfo} from '../models/models';

@Component({
    selector: 'sidebar',
    templateUrl: 'app/ui/sidebar.component.html',
    directives: [CORE_DIRECTIVES, SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class SidebarComponent implements OnInit, OnDestroy {

    private userInfo: UserInfo;
    private sidebarHelper = new SemanticSidebarHelper();
    private strResources = StrResources;

    constructor(private _router: Router, private _messageService: MessageService, private _membershipService: MembershipService, private _logger: LoggerService) {

        _logger.log("SidebarComponent loaded")
    }

    ngOnInit() {

        this._membershipService.currentUser.subscribe(
            (userInfo: UserInfo) => {
                this.userInfo = userInfo;
            });
    }

    ngOnDestroy() {

        this._membershipService.currentUser.unsubscribe();
    }

    doLogout() {

        this.sidebarHelper.hideAll();

        this._membershipService.logoff().subscribe(
                data => {
                    this._logger.log(data);
                    this._router.navigate(['Home']);
                },
                err => {
                    this._logger.error(err);
                    this._messageService.emitMessage(StrResources.message.GenericCommunicationError);
                },
                () => this._logger.log('Logoff complete.')
        );
    }

    navigate(route: string): void {

        this.sidebarHelper.hideAll();


        if((route === 'Home' || route === 'Login')) {
            this._router.navigate([route]);
            return;
        }

        if(this.userInfo.loggedIn && !this.userInfo.emailConfirmed) {
            // redirect to MembershipNotification to show you must confirm email
            if(route === 'MembershipManagement') {
                this._router.navigate([route]);
            } else {
                this._router.navigate( ['MembershipNotification', {'action': RouteKeys.NotConfirmed}]);
            }

            return;
        }

        if(this.userInfo.loggedIn && this.userInfo.emailConfirmed) {
            this._router.navigate([route]);
        }
    }

}
