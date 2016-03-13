import {UserInfoModel} from './user-info.model';
import {MessageModel} from './message.model';

export * from './user-info.model';
export * from './message.model';

export var CORE_MODELS: Array<any> = [
    UserInfoModel,
    MessageModel
];
