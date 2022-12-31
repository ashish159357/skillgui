import { LEADING_TRIVIA_CHARS } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Addquetion } from 'src/app/model/AddQuetion/addquetion';
import { AddQueServiceService } from 'src/app/Services/AddQuetionService/add-que-service.service';
import { HomeComponent } from '../home/home.component';
import { Subject } from 'src/app/model/Subjects/subject';
import { GetSubjectsService } from 'src/app/Services/GetSubjects/get-subjects.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {


  subjects:Subject[] | undefined;
  
  AddQuestion: Addquetion;

  isEmpty: boolean = false;
  Error: string = "";


  constructor(private formBuilder: FormBuilder, private AddQueService: AddQueServiceService,private getsubjectservice:GetSubjectsService) {
    this.AddQuestion = new Addquetion();
   
  }

  ngOnInit(): void {
    
    this.getData();
  }

  validate(q: string, opt: string, singleChoice: Boolean, multipleChoice: Boolean, ans: string, subject: string) {

    if (q == "" || opt == "" || ans == "") {
      this.isEmpty = true;
      this.Error = "Fields Should Not Be Empty"
    }
    else if (singleChoice == false && multipleChoice == false) {
      this.isEmpty = true;
      this.Error = "Select the Type of Options"
    }
    else {
      this.isEmpty = false;
      this.sendData(q, opt, ans, singleChoice, subject);
    }
    console.log(singleChoice, multipleChoice, subject)

    // this.sendData(q,opt,ans,subject);
  }
 
  sendData(q: string, opt: string, ans: string, singleChoice: Boolean, subject: string) {
    this.AddQuestion.que = q;

    var oo=opt.split(",");
    this.AddQuestion.options=oo;

    var aa=ans.split(",");
    this.AddQuestion.ans = aa;

    this.AddQuestion.type=singleChoice;
    
    this.AddQuestion.subject=subject;

    this.AddQueService.save(this.AddQuestion).subscribe();

  }


  getData(){ 
   
    var aa=this.getsubjectservice.findSubjects().subscribe((data: Subject[] | undefined)=>
     {
       console.log(data);
       this.subjects=data;
     });
  
  }


}
