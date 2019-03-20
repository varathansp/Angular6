import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl,FormBuilder,Validators} from '@angular/forms'

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  fullNameLength=0;
  constructor(private fb:FormBuilder) { }

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
    this.employeeForm=this.fb.group({
      fullName:['',[Validators.required,Validators.minLength(4),Validators.maxLength(15)]],
      email:[''],
      skills:this.fb.group({
        skillName:[''],
        experienceInYears:[''],
        proficiency:['']
      })
    });
    this.employeeForm.get('fullName').valueChanges.subscribe((value:string)=>{
      this.fullNameLength=value.length;
    console.log(value);
    });
  }
  onLoadDataClick():void{
    //patchValue for partial upadte
    this.employeeForm.setValue({
      fullName:'Varathan',
      email: 'varathan@gmail.com',
      skills :{
        skillName: 'Angular 2',
        experienceInYears: '3',
        proficiency :'intermediate'
      }
    });
  }
  onSubmit(): void {
    console.log(this.employeeForm.value);
  }

}
