import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES} from 'ng-semantic/semantic';

import {LoggerService} from '../services/services';
import {LoginPopupComponent} from './login-popup.component';
import {SidebarComponent} from './sidebar.component';
import {AppSettings} from '../resources/app-settings';


@Component({
    selector: 'menu',
    templateUrl: 'app/ui/menu.component.html',
    directives: [SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES, ROUTER_DIRECTIVES, SidebarComponent, LoginPopupComponent]
})
export class MenuComponent {

    private appSettings = AppSettings;

    constructor(private _logger: LoggerService) {
        _logger.log("Menu component loaded.")
    }
}
