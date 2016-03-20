import {Component, OnInit} from 'angular2/core';
import {SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES} from 'ng-semantic/semantic';


import {LoggerService} from '../../services/services';
import {MembershipService} from '../../services/services';
import {UserInfo} from '../../models/models';

import {CompaniesListComponent} from './companies-list.component';
import {CompanyFormComponent} from './company-form.component';


@Component({
    selector: 'companies',
    host: {
        class: 'ui grid stackable relaxed container'
    },
    templateUrl: 'app/ui/main/companies.component.html',
    directives: [
                SEMANTIC_COMPONENTS,
                SEMANTIC_DIRECTIVES,
                CompaniesListComponent,
                CompanyFormComponent
                ]
})
export class CompaniesComponent implements OnInit {

    constructor(private _membershipService: MembershipService, private _logger: LoggerService ) {

        _logger.log(`CompaniesComponent loaded.`)
    }

    ngOnInit() {

        this._membershipService.userLoaded.subscribe(
            (done: boolean) => {

            var authorizeInitializer =  {
                // Is the user authenticated, must be explicitly set to false to
                // allow anonymous
                authenticated:  true,
                // Is the user email confirmed, must be explicitly set to false to
                // allow non email confirmed accounts.
                confirmed:      true,
                // If the user is in any of these he is allowed in
                // ex. allowedRoles:   ['user', 'role2', 'role3'],
                // leave empty to skip checking or exclude
                allowedRoles:   [],
                // If any of these are specified the user is *requred to be in them.
                requiredRoles:  []
            }
            // Call this in ngOnInit in every page that need authorization
            let isAuthorized = this._membershipService.checkPageAuthorized(authorizeInitializer);
        }
    }
}
