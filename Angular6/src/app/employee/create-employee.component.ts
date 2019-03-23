import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { CustomValidators } from '../shared/custom.validators'

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  fullNameLength = 0;
  validationMessages = {
    'fullName': {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 2 characters.',
      'maxlength': 'Full Name must be less than 10 characters.'
    },
    'email': {
      'required': 'Email is required.',
      'emailDomain': 'Email domain should be gmail.com'
    },
    'phone': {
      'required': 'Phone is required.',
    },
    'skillName': {
      'required': 'Skill Name is required.',
    },

    'experienceInYears': {
      'required': 'Experience is required.',
    },
    'proficiency': {
      'required': 'Proficiency is required.',
    },
  };
  formErrors = {
    'fullName': '',
    'email': '',
    'phone': '',
    'skillName': '',
    'experienceInYears': '',
    'proficiency': ''
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    // this.employeeForm = new FormGroup({
    //   fullName: new FormControl(),
    //   email: new FormControl(),
    //   skills :new FormGroup({
    //     skillName: new FormControl(),
    //     experienceInYears: new FormControl(),
    //     proficiency :new FormControl()
    //   })
    // });
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      contactPreference: ['email'],
      email: ['', [Validators.required, CustomValidators.emailDomainPara('yahoo.com')]],
      phone: [''],
      skills: this.fb.array([
        this.addSkillFormGroup()
      ])
    });
    this.employeeForm.get('fullName').valueChanges.subscribe((value: string) => {
      this.fullNameLength = value.length;
      console.log(value);
    });

    // When any of the form control value in employee form changes
    // our validation function logValidationErrors() is called
    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationError(this.employeeForm);
    });

    this.employeeForm.get('contactPreference').valueChanges.subscribe((data: string) => {
      this.onContactPrefereceChange(data);
    });
  }
  logKeyValuePair(group: FormGroup): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.logKeyValuePair(abstractControl);
      }
      else {
        console.log('Key = ' + key + ' Value = ' + abstractControl.value);
      }
    });

  }
  logValidationError(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.logValidationError(abstractControl);
      }
      else {
        this.formErrors[key] = "";
        if (abstractControl && !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }
  addSkillFormGroup():FormGroup{
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    });
      
  }
  onContactPrefereceChange(selectedValue: string): void {
    const phoneControl = this.employeeForm.get('phone');
    const emailControl = this.employeeForm.get('email');
    if (selectedValue === 'phone') {
      phoneControl.setValidators(Validators.required);
      emailControl.clearValidators();
    }
    else {
      phoneControl.clearValidators();
      emailControl.setValidators(Validators.required);
    }
    phoneControl.updateValueAndValidity();
    emailControl.updateValueAndValidity();
  }
  onLoadDataClick(): void {
    //patchValue for partial upadte
    // this.employeeForm.setValue({
    //   fullName: 'Varathan',
    //   email: 'varathan@gmail.com',
    //   skills: {
    //     skillName: 'Angular 2',
    //     experienceInYears: '3',
    //     proficiency: 'intermediate'
    //   }
    // });
    //this.logKeyValuePair(this.employeeForm);
    this.logValidationError(this.employeeForm);
    console.log(this.formErrors);
  }
  onSubmit(): void {
    console.log(this.employeeForm.value);
  }

}
function emailDomain(control: AbstractControl): { [key: string]: any } | null {
  const emailValue: string = control.value;
  const domainValue = emailValue.substring(emailValue.lastIndexOf('@') + 1);
  if (domainValue === '' || domainValue === 'gmail.com') {
    return null;
  }
  else {
    return { 'emailDomain': true }
  }

}

