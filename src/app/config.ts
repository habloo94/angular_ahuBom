import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Injectable()

export class Config {
}
export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}


export const url = 'http://localhost:3200/';

// export const url = '';
// export const chaturl = '';
// export const trackUrl = "";
// export const url = '';
// export const chaturl = '';
// export const trackUrl = "";
// export const s3url = "";
// export const url = '';

export const emailpattern = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" + "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
export const alphabetpattern = "^[a-zA-Z \b]+$";
export const alphanumaricpattern = "^[a-zA-Z0-9 \b]+$";
export const numberpattern = "^(0|[1-9][0-9]*)$";
export const websitepattern = "^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$";
export const passwordminlength = 6;
export const passwordmaxlength = 10;
export const pricepattern = "/^([1-9][0-9]{,2}(,[0-9]{3})*|[0-9]+)(\.[0-9]{1,9})?$/";
export const percentagepattern = "(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)";