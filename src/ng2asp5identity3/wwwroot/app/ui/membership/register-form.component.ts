import {Component, OnInit, EventEmitter, Input} from 'angular2/core';
import {    CORE_DIRECTIVES,
            FORM_DIRECTIVES,
            NgForm,
            FormBuilder,
            ControlGroup,
            Control,
            Validators       } from 'angular2/common';
import {SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES} from 'ng-semantic/semantic';

import {CustomValidators} from '../../validators/custom.validators'
import {RegisterViewModel} from '../../viewmodels/register.viewmodel';
import {StrResources, MessageType} from '../../resources/app-resources';
import {Message} from '../../models/message.model';
import {AppSettings} from '../../resources/app-settings';
import {MembershipService, LoggerService, MessageService} from '../../services/services';


@Component({
    selector: 'register-form',
    templateUrl: 'app/ui/membership/register-form.component.html',
    outputs: ['done', 'action'],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES]
})
export class RegisterFormComponent implements OnInit {

    @Input('parent-page') parentPage: string;

    public done: EventEmitter<boolean> = new EventEmitter<boolean>();
    public action: EventEmitter<number> = new EventEmitter<number>();

    public strResources = StrResources;
    private submitButtonElem: Element;

    private registerForm: ControlGroup;
    public registerViewModel: RegisterViewModel;

    private showRegisterError: boolean = false;
    private registerErrorMessage: string = '';
    private minPasswordLength: number = AppSettings.minPasswordLength;

    private emailCtrl: Control;
    private passwordCtrl: Control;
    private confirmPasswordCtrl: Control;

    private _passwordValidators = new CustomValidators();

    constructor(private _membershipService: MembershipService,
                private _messageService: MessageService,
                private _logger: LoggerService,
                private _fb: FormBuilder) {

       this.emailCtrl = new Control('', Validators.compose([
                Validators.required,
                this._passwordValidators.validEmailLoose
           ]));

       this.passwordCtrl = new Control('', Validators.compose([
                Validators.required,
                Validators.minLength(this.minPasswordLength),
                this._passwordValidators.needsCapitalLetter,
                this._passwordValidators.needsLowerLetter,
                this._passwordValidators.needsNumber,
                this._passwordValidators.needsSpecialCharacter
           ]));

       this.confirmPasswordCtrl = new Control('', Validators.compose([
                Validators.required
           ]));

        this.registerForm = _fb.group({
            'email': this.emailCtrl,
             'matchingPassword': _fb.group({
                'password': this.passwordCtrl,
                'confirmPassword': this.confirmPasswordCtrl
            }, {validator: this._passwordValidators.areEqual})

        });
    }

    ngOnInit() {

        this.registerViewModel = new RegisterViewModel('', '', '');
    }

    showLogin() {

        this.action.next(1);
    }

    showError(ctrl): boolean {

        return !ctrl.valid && ctrl.touched;
    }

    showMatchingError(ctrl): boolean {

        return !this.registerForm.controls['matchingPassword'].valid && ctrl.touched;
    }

    getPasswordError(ctrl): string {

        if(this.passwordCtrl.hasError('required')) {
            return StrResources.membershipValidation.passwordRequired;
        }

        if(this.passwordCtrl.hasError('minlength')) {
            return StrResources.membershipValidation.passwordLength;
        }

        // TODO: this will be replaced by some fance CSS and Icons or something.
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

        if(this.registerForm.controls['matchingPassword'].hasError('areEqual')) {
            return StrResources.membershipValidation.passwordMismatch;
        }
    }

    getEmailError(ctrl): string {

        if(this.emailCtrl.hasError('required')) {
            return StrResources.membershipValidation.emailRequired;
        }

        if(this.emailCtrl.hasError('invalidEmail')) {
            return  StrResources.membershipValidation.emailInvalid;
        }
    }

    canSubmit(something: any): boolean {

        return this.registerForm.valid;
    }

    onSubmitClicked(event: Event) {

        this.submitButtonElem = event.srcElement;
        this.submitButtonElem.classList.add('loading');
    }

    onSubmit(form: any) {

        this._logger.log('Register form submitted: ' + JSON.stringify(form));
        this._membershipService.register(this.registerViewModel)
            .subscribe(
                data => {
                    this._logger.log(data);
                    if(data.success) {
                        this.showRegisterError = false;
                        this.done.next(true);
                        this.action.next(1);
                    } else {
                        if(this.parentPage === 'popup') {
                            this.showRegisterError = true;
                            this.registerErrorMessage = data.msg;
                        } else {
                            this._messageService.emitMessage(new Message({type: MessageType.error, content: data.msg}))
                        }
                    }
                },
                err => {
                    this._logger.error(err);
                    if(this.parentPage === 'popup') {
                        this.showRegisterError = true;
                        this.registerErrorMessage = StrResources.generic.serverError;
                    } else {
                        this._messageService.emitMessage(StrResources.message.GenericCommunicationError)
                    }
                    this.done.next(false);
                },
                () => {
                   this.submitButtonElem.classList.remove('loading');
                   this._logger.log('Register complete!')
                }
        );
    }
}
