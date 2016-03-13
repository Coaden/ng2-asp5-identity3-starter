import {Component, OnInit} from 'angular2/core';
import {SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES} from 'ng-semantic/semantic';

import {LoggerService} from '../../services/services';
import {StrResources} from '../../resources/app-resources'

@Component({
  selector: 'home',
  templateUrl: 'app/ui/home/home.component.html',
  directives: [SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES]
})
export class HomeComponent {

    private strResources = StrResources;

    constructor(private _logger: LoggerService) {

        _logger.log(`HomeComponent loaded.`)
    }
}
