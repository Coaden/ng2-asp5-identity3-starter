import {Injectable, bind} from 'angular2/core';
import {Subject} from 'rxjs/Subject';
import {Message} from '../models/message.model';

@Injectable()
export class MessageService {

	private message: Message;
	public messageOutlet: Subject<Message>;

	constructor() {

		this.messageOutlet = new Subject<Message>();
	}

	emitMessage(message: Message): void {

		this.message = message;
		this.messageOutlet.next(this.message);
	}

	getLastMessage(): Message {
		return this.message;
	}
}

export var MessageServiceInjectables: Array<any> = [
    bind(MessageService).toClass(MessageService)
];
