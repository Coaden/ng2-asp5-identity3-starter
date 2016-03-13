import {Control, ControlGroup} from 'angular2/common';

export class CustomValidators {

    constructor() { }


    //email validators
    validEmailStrict(ctrl: Control): {[s: string]: boolean} {
        if(!ctrl.value.match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i))
            return {'invalidEmail': true}

        return null;
    }

    validEmailLoose(ctrl: Control): {[s: string]: boolean} {
        if(!ctrl.value.match(/.+@.+/))

            return {'invalidEmail': true}

        return null;
    }


    //password validators
    needsCapitalLetter(ctrl: Control): {[s: string]: boolean} {
        if(!ctrl.value.match(/[A-Z]/))
            return {'needsCapitalLetter': true}
            
        return null;
    }

    needsLowerLetter(ctrl: Control): {[s: string]: boolean} {
        if(!ctrl.value.match(/[a-z]/))
            return {'needsLowerLetter': true}

        return null;
    }

    needsNumber(ctrl: Control): {[s: string]: boolean} {
        if(!ctrl.value.match(/\d/))
            return {'needsNumber': true}

        return null;
    }

    needsSpecialCharacter(ctrl: Control): {[s: string]: boolean} {
        if(!ctrl.value.match(/[^a-zA-Z\d]/))
            return {'needsSpecialCharacter': true}

        return null;
    }


    // matching validators
    areEqual(group: ControlGroup): {[s: string]: boolean} {
        let val;
        let valid = true;

        for (name in group.controls) {
            if (val === undefined) {
                val = group.controls[name].value
            } else {
                if (val !== group.controls[name].value) {
                    valid = false;
                    break;
                }
            }
        }

        if (!valid) {
        return {'areEqual': true};
        }

        return null;
    }
}


// note that this doesn't work because it doesn't hold state.
export class FieldMatchesValidator {

   private compareCtrl: Control;

   constructor(private _compareCtrl:Control) {
       this.compareCtrl = _compareCtrl;
   }

   fieldMismatch(ctrl:Control): {[s: string]: boolean} {
       if (this.compareCtrl.value != ctrl.value)
            return {'fieldMismatch': true}

       return null;
   }
}
