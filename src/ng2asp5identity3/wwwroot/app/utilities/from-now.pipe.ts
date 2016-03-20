import {Pipe, bind} from 'angular2/core';
declare var moment: any;

@Pipe({
  name: 'fromNow'
})
export class FromNowPipe {
  transform(value: any, args: Array<any>): string {
    return moment(value).fromNow();
  }
}

export var FromNowPipeInjectables: Array<any> = [
  bind(FromNowPipe).toValue(FromNowPipe)
];
