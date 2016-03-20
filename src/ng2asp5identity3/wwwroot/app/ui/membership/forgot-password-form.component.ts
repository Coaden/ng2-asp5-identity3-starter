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
import {ForgotPasswordViewModel} from '../../viewmodels/membership/forgot-password.viewmodel';
import {StrResources, MessageType} from '../../resources/app-resources';
import {Message} from '../../models/message.model';
import {MembershipService, LoggerService, MessageService} from '../../services/services';

@Component({
    selector: 'forgot-password-form',
    templateUrl: 'app/ui/membership/forgot-password-form.component.html',
    outputs: ['done', 'action'],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES]
})
export class ForgotPasswordFormComponent implements OnInit {

    @Input('parent-page') parentPage: string;

    public done:  EventEmitter<string> = new EventEmitter<string>();
    public action: EventEmitter<number> = new EventEmitter<number>();

    private strResources = StrResources;

    public forgotPasswordViewModel: ForgotPasswordViewModel;

    private forgotPasswordForm: ControlGroup;
    private emailCtrl: Control;
    private _validators = new CustomValidators();

    private submitButtonElem: Element;
    private showForgotPasswordError: boolean = false;
    private ForgotPasswordErrorMessage: string = '';


    constructor(private _membershipService: MembershipService,
                private _messageService: MessageService,
                private _logger: LoggerService,
                private _fb: FormBuilder) {

        this.emailCtrl = new Control('', Validators.compose([
            Validators.required,
            this._validators.validEmailLoose
        ]));

        this.forgotPasswordForm = _fb.group({
            'email': this.emailCtrl
         });
    }

    ngOnInit() {

        this.forgotPasswordViewModel = new ForgotPasswordViewModel('');
    }

    showError(ctrl): boolean {

        return !ctrl.valid && ctrl.touched;
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

        return this.forgotPasswordForm.valid;
    }

    showLogin() {

        this.action.next(1);
    }

    showRegister() {

        this.action.next(2);
    }

    onSubmitClicked(event: Event) {

        this.submitButtonElem = event.srcElement;
        this.submitButtonElem.classList.add('loading');
    }

    onSubmit(form: any) {

        this._logger.log('Forgot Password form submitted: ' + JSON.stringify(form));
        this._membershipService.forgotPassword(this.forgotPasswordViewModel)
            .subscribe(
                data => {
                    this._logger.log(data);
                    if(data.success) {
                        this.showForgotPasswordError = false;
                        this.done.next(true);
                    } else {
                        if(this.parentPage === 'popup') {
                            this.showForgotPasswordError = true;
                            this.ForgotPasswordErrorMessage = data.msg;
                        } else {
                            this._messageService.emitMessage(new Message({type: MessageType.error, content: data.msg}))
                        }
                    }
                },
                err => {
                    this._logger.error(err);
                    if(this.parentPage === 'popup') {
                        this.showForgotPasswordError = true;
                        this.ForgotPasswordErrorMessage = StrResources.generic.serverError;
                    } else {
                        this._messageService.emitMessage(StrResources.message.GenericCommunicationError)
                    }
                    this.done.next(false);
                },
                () => {
                    this.submitButtonElem.classList.remove('loading');
                    this._logger.log('Forgot Password complete!');
                }
            );
    }
}
