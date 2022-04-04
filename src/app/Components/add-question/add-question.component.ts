import { LEADING_TRIVIA_CHARS } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {

  AddQuestion: FormGroup = new FormGroup({});
  isEmpty: boolean = false;
  Error: string = "";


  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.AddQuestion = this.formBuilder.group({
      que: ['', Validators.required],
      options: ['', Validators.required],
      type: ['', Validators.required],
      answer: ['', Validators.required],
      subject: ['', Validators.required]
    })

  }

  get Quetion() {
    return this.AddQuestion?.controls;
  }

  validate(q: string, opt: string, singleChoice: any, multipleChoice: any, ans: string) {
    if (q == "" || opt == "" || ans == "") {
      this.isEmpty = true;
      this.Error = "Fields Should Not Be Empty"
    }
    else if (singleChoice == "" || multipleChoice == "") {
      this.isEmpty = true;
      this.Error = "Select the Type of Options"
    }
    else {

      this.isEmpty = false;
    }
    console.log(singleChoice, multipleChoice)

  }

}
