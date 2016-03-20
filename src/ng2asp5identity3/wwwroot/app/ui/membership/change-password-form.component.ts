import {Component, OnInit, EventEmitter} from 'angular2/core';
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
import {ChangePasswordViewModel} from '../../viewmodels/membership/change-password.viewmodel';
import {StrResources} from '../../resources/app-resources';
import {AppSettings} from '../../resources/app-settings';
import {RouteKeys} from '../../resources/route-keys';
import {MembershipService, LoggerService, MessageService} from '../../services/services';

@Component({
    selector: 'change-password-form',
    host: {
        class: 'ui grid container'
    },
    templateUrl: 'app/ui/membership/change-password-form.component.html',
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES]
})
export class ChangePasswordFormComponent implements OnInit {

    private changePasswordForm: ControlGroup;
    public  changePasswordViewModel: ChangePasswordViewModel;

    private strResources = StrResources;
    private submitButtonElem: Element;

    private minPasswordLength: number = AppSettings.minPasswordLength;

    private oldPasswordCtrl: Control;
    private newPasswordCtrl: Control;
    private confirmPasswordCtrl: Control;

    private customValidators = new CustomValidators();

    constructor(private _membershipService: MembershipService,
                private _messageService: MessageService,
                private _fb: FormBuilder,
                private _routeParams: RouteParams,
                private _router: Router,
                private _logger: LoggerService) {

        _logger.log(`ChangePasswordFormComponent loaded.`)

        this.oldPasswordCtrl = new Control('', Validators.compose([
                Validators.required
           ]));

        this.newPasswordCtrl = new Control('', Validators.compose([
                Validators.required,
                Validators.minLength(this.minPasswordLength),
                this.customValidators.needsCapitalLetter,
                this.customValidators.needsLowerLetter,
                this.customValidators.needsNumber,
                this.customValidators.needsSpecialCharacter
           ]));

        this.confirmPasswordCtrl = new Control('', Validators.compose([
                Validators.required
           ]));

        this.changePasswordForm = _fb.group({
            'oldPassword': this.oldPasswordCtrl,
            'matchingPassword': _fb.group({
                'newPassword': this.newPasswordCtrl,
                'confirmPassword': this.confirmPasswordCtrl
            }, {validator: this.customValidators.areEqual})
        });

    }

    ngOnInit() {

        this.changePasswordViewModel = new ChangePasswordViewModel('', '', '');
    }

    showError(ctrl): boolean {

        return !ctrl.valid && ctrl.touched;
    }

    showMatchingError(ctrl): boolean {

        return !this.changePasswordForm.controls['matchingPassword'].valid && ctrl.touched;
    }

    getPasswordError(ctrl): string {

        if(this.newPasswordCtrl.hasError('required')) {
            return StrResources.membershipValidation.passwordRequired;
        }

        if(this.newPasswordCtrl.hasError('minlength')) {
            return StrResources.membershipValidation.passwordLength;
        }

        // build up string with missing components
        var msg: string = 'Password requires';

        if(this.newPasswordCtrl.hasError('needsCapitalLetter')) {
            msg += ': Capital Letter ';
        }

        if(this.newPasswordCtrl.hasError('needsLowerLetter')) {
            msg += ': Lowercase Letter ';
        }

        if(this.newPasswordCtrl.hasError('needsNumber')) {
            msg += ': Number ';
        }

        if(this.newPasswordCtrl.hasError('needsSpecialCharacter')) {
            msg += ': Special Character ';
        }

        return msg;
    }

    getConfirmPasswordError(ctrl): string {

        if(this.confirmPasswordCtrl.hasError('required')) {
            return StrResources.membershipValidation.confirmPasswordRequired;
        }

        if(this.changePasswordForm.controls['matchingPassword'].hasError('areEqual')) {
            return StrResources.membershipValidation.passwordMismatch;
        }
    }

    canSubmit(something: any): boolean {

        return this.changePasswordForm.valid;
    }

    onSubmitClicked(event: Event) {

        this.submitButtonElem = event.srcElement;
        this.submitButtonElem.classList.add('loading');
    }

    onSubmit(form: any) {

        this._logger.log('ChangePasswordForm submitted: ' + JSON.stringify(form))
        this._membershipService.changePassword(this.changePasswordViewModel)
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
                    this._messageService.emitMessage(StrResources.message.GenericError)
                },
                () => {
                    this.submitButtonElem.classList.remove('loading');
                    this._logger.log('Change Password complete!');
                }
        );
    }
}
