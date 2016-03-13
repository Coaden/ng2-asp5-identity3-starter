import {Component, OnInit} from 'angular2/core';
import {SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES} from 'ng-semantic/semantic';

import {MessageService, LoggerService} from '../services/services';
import {MessageType} from '../resources/app-resources';
import {AppSettings} from '../resources/app-settings';
import {Message} from '../models/message.model';


@Component({
    selector: 'message-outlet',
    templateUrl: 'app/ui/message-outlet.component.html',
    host: {
        class: 'ui grid container'
    },
    directives: [SEMANTIC_COMPONENTS, SEMANTIC_DIRECTIVES]
})
export class MessageOutletComponent implements OnInit {

    private messages: Array<string> = new Array<string>();

    constructor(private _messageService: MessageService, private _logger: LoggerService) {

        _logger.log("MessageOutletComponent loaded.");
    }

    ngOnInit() {

        this._messageService.messageOutlet.subscribe(
            (message: any) => {

                if (typeof message === "string") {
                    message = new Message({
                      content: message
                  });
                }

                // display message
                this.messages.push(message);

                // remove message
                if (AppSettings.MessageDuration > 0) {
                    setTimeout(() => {
                      this.messages.shift();
                  }, AppSettings.MessageDuration);
                }
            });
    }
}
