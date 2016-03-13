import {bind} from 'angular2/core';
import {MessageType, StrResources} from '../resources/app-resources';

export class Message {
    public type: string;
    public icon: string;
    public title: string;
    public content: string;

    constructor(obj?: any) {
        this.type       = obj && obj.type       || MessageType.info;
        this.icon       = obj && obj.icon       || '';
        this.title      = obj && obj.title      || StrResources.messageTitle;
        this.content    = obj && obj.content    || '';
    }
}

export var MessageModel: Array<any> = [
    bind(Message).toClass(Message)
];
