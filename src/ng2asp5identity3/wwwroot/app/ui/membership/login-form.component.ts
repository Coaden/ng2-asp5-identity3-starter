import {Component, OnInit, EventEmitter, Input} from 'angular2/core';
import {NgForm}    from 'angular2/common';
import {SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES} from 'ng-semantic/semantic';

import {LoginViewModel} from '../../viewmodels/membership/login.viewmodel';
import {StrResources, MessageType} from '../../resources/app-resources';
import {Message} from '../../models/message.model'
import {MembershipService, LoggerService, MessageService} from '../../services/services';

@Component({
    selector: 'login-form',
    templateUrl: 'app/ui/membership/login-form.component.html',
    outputs: ['done', 'action'],
directives: [SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES]
})
export class LoginFormComponent implements OnInit {

    @Input('parent-page') parentPage: string;

    public done: EventEmitter<boolean> = new EventEmitter<boolean>();
    public action: EventEmitter<number> = new EventEmitter<number>();

    private strResources = StrResources;
    private loginViewModel: LoginViewModel;

    private submitButtonElem: Element;
    private showLoginError: boolean = false;
    private loginErrorMessage: string = '';

    constructor(private _membershipService: MembershipService,
                private _messageService: MessageService,
                private _logger: LoggerService) {

        _logger.log('LoginFormComponent loaded.');
    }

    ngOnInit() {

        this.loginViewModel = new LoginViewModel('', '', false, false);
    }

    showError(ctrl) {
        return !ctrl.valid && (ctrl.dirty || ctrl.touched);
    }

    showRegister() {
        this.action.next(2);
    }

    showForgotPassword() {
        this.action.next(3);
    }

    onSubmitClicked(event: Event) {

        this.submitButtonElem = event.srcElement;
        this.submitButtonElem.classList.add('loading');
    }

    onSubmit(form: any) {

        this._logger.log('Login form submitted: ' + JSON.stringify(form));
        this._membershipService.login(this.loginViewModel)
            .subscribe(
                data => {
                    this._logger.log(data);
                    if(data.success) {
                        this.showLoginError = false;
                        this.done.next(true);
                    } else {
                        if(this.parentPage === 'popup') {
                            this.showLoginError = true;
                            this.loginErrorMessage = data.msg;
                        } else {
                            this._messageService.emitMessage(new Message({type: MessageType.error, content: data.msg}))
                        }
                    }
                },
                err => {
                    this._logger.error(err);
                    if(this.parentPage === 'popup') {
                        this.showLoginError = true;
                        this.loginErrorMessage = StrResources.generic.serverError;
                    } else {
                        this._messageService.emitMessage(StrResources.message.GenericCommunicationError)
                    }
                    this.done.next(false);
                },
                () => {
                    this.submitButtonElem.classList.remove('loading');
                    this._logger.log('Login complete!');
                }
        );
    }
}
