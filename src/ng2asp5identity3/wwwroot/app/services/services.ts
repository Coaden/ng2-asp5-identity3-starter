import {LoggerServiceInjectables} from './logger.service';
import {MessageServiceInjectables} from './message.service';
import {MembershipServiceInjectables} from './membership.service';

export * from './membership.service';
export * from './logger.service';
export * from './message.service';

export var SERVICES_INJECTABLES: Array<any> = [
    LoggerServiceInjectables,
    MessageServiceInjectables,
    MembershipServiceInjectables
];
