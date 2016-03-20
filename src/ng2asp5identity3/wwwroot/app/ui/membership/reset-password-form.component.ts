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
import {ResetPasswordViewModel} from '../../viewmodels/membership/reset-password.viewmodel';
import {StrResources} from '../../resources/app-resources';
import {AppSettings} from '../../resources/app-settings';
import {RouteKeys} from '../../resources/route-keys';
import {MembershipService, LoggerService, MessageService} from '../../services/services';


@Component({
    selector: 'reset-password-form',
    host: {
        class: 'ui grid container',
    },
    templateUrl: 'app/ui/membership/reset-password-form.component.html',
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES]
})
export class ResetPasswordFormComponent implements OnInit {

    private resetPasswordForm: ControlGroup;
    private resetPasswordViewModel: ResetPasswordViewModel;

    private submitButtonElem: Element;
    private strResources = StrResources;

    private minPasswordLength: number = AppSettings.minPasswordLength;

    private passwordCtrl: Control;
    private confirmPasswordCtrl: Control;

    private customValidators = new CustomValidators();

    constructor(private _membershipService: MembershipService,
                private _messageService: MessageService,
                private _fb: FormBuilder,
                private _routeParams: RouteParams,
                private _router: Router,
                private _logger: LoggerService) {

        _logger.log(`MembershipNotificationComponent loaded.`)

        this.passwordCtrl = new Control('', Validators.compose([
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

        this.resetPasswordForm = _fb.group({
            'matchingPassword': _fb.group({
                'password': this.passwordCtrl,
                'confirmPassword': this.confirmPasswordCtrl
            }, {validator: this.customValidators.areEqual})

        });
    }

    ngOnInit() {

        let userId = this._routeParams.get('userId');
        let code = this._routeParams.get('code');

        this.resetPasswordViewModel = new ResetPasswordViewModel(userId, code, '', '');
    }

    showError(ctrl): boolean {

        return !ctrl.valid && ctrl.touched;
    }

    showMatchingError(ctrl): boolean {

        return !this.resetPasswordForm.controls['matchingPassword'].valid && ctrl.touched;
    }

    getPasswordError(ctrl): string {

        if(this.passwordCtrl.hasError('required')) {
            return StrResources.membershipValidation.passwordRequired;
        }

        if(this.passwordCtrl.hasError('minlength')) {
            return StrResources.membershipValidation.passwordLength;
        }

        // build up string with missing components
        var msg: string = 'Password requires';

        if(this.passwordCtrl.hasError('needsCapitalLetter')) {
            msg += ': Capital Letter ';
        }

        if(this.passwordCtrl.hasError('needsLowerLetter')) {
            msg += ': Lowercase Letter ';
        }

        if(this.passwordCtrl.hasError('needsNumber')) {
            msg += ': Number ';
        }

        if(this.passwordCtrl.hasError('needsSpecialCharacter')) {
            msg += ': Special Character ';
        }

        return msg;
    }

    getConfirmPasswordError(ctrl): string {

        if(this.confirmPasswordCtrl.hasError('required')) {
            return StrResources.membershipValidation.confirmPasswordRequired;
        }

        if(this.resetPasswordForm.controls['matchingPassword'].hasError('areEqual')) {
            return StrResources.membershipValidation.passwordMismatch;
        }
    }

    canSubmit(something: any): boolean {

        return this.resetPasswordForm.valid;
    }

    onSubmitClicked(event: Event) {

        this.submitButtonElem = event.srcElement;
        this.submitButtonElem.classList.add('loading');
    }

    onSubmit(form: any) {

        this._logger.log('Register form submitted: ' + JSON.stringify(form))
        this._membershipService.resetPassword(this.resetPasswordViewModel)
            .subscribe(
                data => {
                    if(data.success) {
                        this._logger.log(data);
                        this._router.navigate( ['MembershipNotification', {'action': RouteKeys.ChangedPassword}]);
                    } else {
                        this._messageService.emitMessage(StrResources.message.ErrorChangingPassword);
                    }
                },
                err => {
                    this._logger.error(err);
                    this._messageService.emitMessage(StrResources.message.GenericCommunicationError);
                },
                () => {
                    this.submitButtonElem.classList.remove('loading');
                    this._logger.log('Reset Password complete!');
                }
        );
    }

}
