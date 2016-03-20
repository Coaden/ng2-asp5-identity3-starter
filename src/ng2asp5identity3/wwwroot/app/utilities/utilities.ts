import {DateFormatPipeInjectables} from './date-format.pipe';
import {FromNowPipeInjectables} from './from-now.pipe';

export * from './date-format.pipe';
export * from './from-now.pipe';

export var utilitiesInjectables: Array<any> = [
  DateFormatPipeInjectables,
  FromNowPipeInjectables
];
