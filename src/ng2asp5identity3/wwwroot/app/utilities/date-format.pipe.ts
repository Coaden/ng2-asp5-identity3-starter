import {Pipe, bind} from 'angular2/core';
declare var moment: any;

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe {
    transform(value: any, args: Array<any>): string {

        var formatStr: string;
        if(args[0]) {
            formatStr = args[0];
        } else {
            formatStr = 'M/D/YYYY';
        }
        return moment(value).format(formatStr)
  }
}

export var DateFormatPipeInjectables: Array<any> = [
  bind(DateFormatPipe).toValue(DateFormatPipe)
];
