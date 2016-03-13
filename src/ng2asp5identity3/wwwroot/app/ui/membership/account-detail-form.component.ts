import {Component, OnInit} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';
import {    CORE_DIRECTIVES,
            FORM_DIRECTIVES,
            NgForm,
            FormBuilder,
            ControlGroup,
            Control,
            Validators       } from 'angular2/common';
import {SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES} from 'ng-semantic/semantic';

import {CustomValidators} from '../../validators/custom.validators'
import {AccountDetailViewModel} from '../../viewmodels/account-detail.viewmodel';
import {StrResources} from '../../resources/app-resources';
import {AppSettings} from '../../resources/app-settings';
import {RouteKeys} from '../../resources/route-keys';
import {MessageService, MembershipService, LoggerService} from '../../services/services';
import {UserInfo} from '../../models/models';

@Component({
    selector: 'account-detail-form',
    host: {
        class: 'ui grid container'
    },
    templateUrl: 'app/ui/membership/account-detail-form.component.html',
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES]
})
export class AccountDetailFormComponent implements OnInit {

    private accountDetailForm: ControlGroup;
    private accountDetailViewModel: AccountDetailViewModel;

    private strResources = StrResources;
    private submitButtonElem: Element;

    private firstNameCtrl: Control;
    private lastNameCtrl: Control;
    private companyCtrl: Control;
    private phoneCtrl: Control;

    constructor(private _membershipService: MembershipService,
                private _messageService: MessageService,
                private _fb: FormBuilder,
                private _routeParams: RouteParams,
                private _router: Router,
                private _logger: LoggerService) {

        _logger.log(`AccountDetailFormComponent loaded.`)

        this.firstNameCtrl = new Control('', Validators.compose([
                Validators.required
           ]));

        this.lastNameCtrl = new Control('', Validators.compose([
               Validators.required
          ]));

        this.companyCtrl = new Control('', Validators.compose([
              Validators.required
         ]));

        this.phoneCtrl = new Control('', Validators.compose([
             Validators.required
        ]));

        this.accountDetailForm = _fb.group({
            'firstName': this.firstNameCtrl,
            'lastName': this.lastNameCtrl,
            'company': this.companyCtrl,
            'phone': this.phoneCtrl
        });
    }

    ngOnInit() {
        let userInfo: UserInfo = this._membershipService.getUserInfo();
        this.accountDetailViewModel = new AccountDetailViewModel(userInfo.firstName, userInfo.lastName, userInfo.company, userInfo.phone);
    }

    showError(ctrl): boolean {

        return !ctrl.valid && ctrl.touched;
    }

    getError(ctrl): string {

        if(ctrl.errors['required']) {
            return StrResources.generic.fieldRequired;
        } else {
            return StrResources.generic.fieldInvalid;
        }
    }

    canSubmit(something: any): boolean {

        return this.accountDetailForm.valid  &&
               this.accountDetailForm.dirty;
    }

    onSubmitClicked(event: Event) {

        this.submitButtonElem = event.srcElement;
        this.submitButtonElem.classList.add('loading');
    }

    onSubmit(form: any) {

        this._logger.log('AccountDetailForm submitted: ' + JSON.stringify(form))
        this._membershipService.updateAccountDetails(this.accountDetailViewModel)
            .subscribe(
                data => {
                    if(data.success) {
                        this._logger.log(data);
                        this._messageService.emitMessage(StrResources.message.GenericComplete)
                    } else {
                        this._messageService.emitMessage(StrResources.message.GenericError)
                    }
                },
                err => {
                    this._logger.error(err);
                    this._messageService.emitMessage(StrResources.message.GenericCommunicationError)
                },
                () => {
                    this.submitButtonElem.classList.remove('loading');
                    this._logger.log('Update UserDetail complete!');
                }
        );
    }

}
