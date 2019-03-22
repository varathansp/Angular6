import { AbstractControl } from '@angular/forms';

export class CustomValidators{
    static emailDomain(control: AbstractControl): { [key: string]: any } | null {
        const emailValue: string = control.value;
        const domainValue = emailValue.substring(emailValue.lastIndexOf('@') + 1);
        if (domainValue === '' || domainValue === 'gmail.com') {
          return null;
        }
        else {
          return { 'emailDomain': true }
        }
      
      }
      
      static emailDomainPara(domainName: string) {
        return (control: AbstractControl): { [key: string]: any } | null => {
          const emailValue: string = control.value;
          const domainValue = emailValue.substring(emailValue.lastIndexOf('@') + 1);
          if (domainValue === '' || domainValue.toLowerCase() === domainName.toLowerCase()) {
            return null;
          }
          else {
            return { 'emailDomain': true }
          }
      
        }
      
      }
}