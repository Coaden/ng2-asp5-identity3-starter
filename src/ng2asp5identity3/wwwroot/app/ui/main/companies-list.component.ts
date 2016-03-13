import {Component} from 'angular2/core';

import {LoggerService} from '../../services/services';


@Component({
    selector: 'companies-list',
    templateUrl: 'app/ui/main/companies-list.component.html'
})
export class CompaniesListComponent {
    
    constructor(private _logger: LoggerService) {
        
        _logger.log(`CompaniesListComponent loaded.`)
    }
}