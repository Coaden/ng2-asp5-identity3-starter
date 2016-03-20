import {UserInfoModel} from './membership/user-info.model';
import {MessageModel} from './message.model';

export * from './membership/user-info.model';
export * from './message.model';

export var CORE_MODELS: Array<any> = [
    UserInfoModel,
    MessageModel
];
