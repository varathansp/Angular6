import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms'
import { CustomValidators } from '../shared/custom.validators'
import { ActivatedRoute, Router } from '@angular/router'
import { IEmployee } from './IEmployee'
import { ISkill } from './ISkill'
import { EmployeeService } from './employee.service'
@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  fullNameLength = 0;
  employee:IEmployee;
  pageTitle:string;
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
    'confirmEmail': {
      'required': 'confirmEmail is required.'
    },
    'emailGroup': {
      'emailMisMatch': 'email and confirmEmail do not match.'
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
    // 'fullName': '',
    // 'email': '',
    // 'confirmEmail': '',
    // 'emailGroup': '',
    // 'phone': '',
    // 'skillName': '',
    // 'experienceInYears': '',
    // 'proficiency': ''
  };

  constructor(private fb: FormBuilder, private _activatedRoute: ActivatedRoute, private _employeeService: EmployeeService,private _router:Router) { }

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
      emailGroup: this.fb.group({
        email: ['', [Validators.required, CustomValidators.emailDomainPara('gmail.com')]],
        confirmEmail: ['', Validators.required]
      }, { validator: matchEmail }),

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

    this._activatedRoute.paramMap.subscribe(params => {
      const empId = +params.get('id');
      if (empId) {
        this.pageTitle="Edit Employee";
        this.getEmployee(empId);
      }
      else {
        this.pageTitle="Create Employee";
        this.employee = {
          id: null,
          fullName: '',
          contactPreference: '',
          email: '',
          phone: null,
          skills: []
        };
      }
    });
  }
  getEmployee(empId: number) {
    this._employeeService.getEmployee(empId).subscribe(
      (employee: IEmployee) => {
        this.editEmployee(employee);
        this.employee=employee
      },
      (err) => console.log(err)
    );
  }
  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email
      },
      phone: employee.phone
    });

    this.employeeForm.setControl('skills', this.setExistingSkills(employee.skills));
  }
  setExistingSkills(skillSets: ISkill[]): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach(s => {
      formArray.push(this.fb.group({
        skillName: s.skillName,
        experienceInYears: s.experienceInYears,
        proficiency: s.proficiency
      }));

    });
    return formArray;
  }
  addSkillButtonClick() {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
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

      this.formErrors[key] = "";
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationError(abstractControl);
      }
      // if (abstractControl instanceof FormArray) {
      //   for (const control of abstractControl.controls) {
      //     if (control instanceof FormGroup) {
      //       this.logValidationError(control);
      //     }
      //   }
      // }
    });
  }
  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    });

  }
  removeSkillButtonClick(skillGroupIndex: number): void {
   const skillsFormArray= (<FormArray>this.employeeForm.get('skills'));
   skillsFormArray.removeAt(skillGroupIndex);
   skillsFormArray.markAsDirty();
   skillsFormArray.markAsTouched(); 
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
    this.mapFormValuesToEmployeeModel();
    if(this.employee.id){
      this._employeeService.updateEmployee(this.employee).subscribe(
        ()=>this._router.navigate(['employees']),
        (err)=>console.log(err)
      );
    }else{
      this._employeeService.addEmployee(this.employee).subscribe(
        ()=>this._router.navigate(['employees']),
        (err)=>console.log(err)
      );
    }
    
  }
  mapFormValuesToEmployeeModel() {
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.contactPreference = this.employeeForm.value.contactPreference;
    this.employee.email = this.employeeForm.value.emailGroup.email;
    this.employee.phone = this.employeeForm.value.phone;
    this.employee.skills = this.employeeForm.value.skills;
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

function matchEmail(group: FormGroup): { [key: string]: any } | null {
  const emailControl = group.get('email');
  const confirmEmilControl = group.get('confirmEmail');
  if (emailControl.value === confirmEmilControl.value
    || (confirmEmilControl.pristine && confirmEmilControl.value === '')) {
    return null;
  }
  else {
    return { 'emailMisMatch': true };
  }
}

