import {Component} from 'angular2/core';

import {LoggerService} from '../../services/services';

@Component({
    selector: 'company-form',
    templateUrl: 'app/ui/main/company-form.component.html'
})
export class CompanyFormComponent {
    constructor(private _logger: LoggerService) {
        
        _logger.log(`CompanyFormComponent loaded.`)
    }
}