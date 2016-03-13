import {Injectable, bind} from 'angular2/core';

@Injectable()
export class LoggerService {
    log(msg: any) { console.log(msg); }
    error(msg: any) { console.error(msg); }
    warn(msg: any) { console.warn(msg); }
}

export var LoggerServiceInjectables: Array<any> = [
    bind(LoggerService).toClass(LoggerService)
];
