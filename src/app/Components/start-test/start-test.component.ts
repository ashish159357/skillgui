import { Component, OnInit, asNativeElements } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetQuetionSpecificToSubjectService } from 'src/app/Services/getQuetionSpecificToSubject/get-quetion-specific-to-subject.service';
import { Quetion } from 'src/app/model/Quetion/quetion';

@Component({
  selector: 'app-start-test',
  templateUrl: './start-test.component.html',
  styleUrls: ['./start-test.component.css']
})
export class StartTestComponent implements OnInit {

  explanationofans: boolean | undefined;
  subject: any;
  Quetions: Quetion[] | any;
  i = 0;
  Quetion: Quetion | any;
  selectedans = new Set();
  flag: boolean | undefined;


  constructor(private route: ActivatedRoute, private getquetionspecificTosubjectservice: GetQuetionSpecificToSubjectService) {

    this.subject = this.route.snapshot.paramMap.get('subject');
    this.explanationofans = false
  }

  ngOnInit(): void {
    this.getQuetions();

  }

  getQuetions() {
    this.getquetionspecificTosubjectservice.getQuetion(this.subject).subscribe((data: Quetion[] | undefined) => {
      this.Quetions = data;
      console.log(this.Quetions);

      this.Quetion = this.Quetions[this.i];
    })
  }

  nextPage() {

    if (this.i < this.Quetions.length - 1) {
      this.i = this.i + 1;
      this.Quetion = this.Quetions[this.i];
    }

  }

  previousPage() {
    if (this.i > 0) {
      this.i = this.i - 1;
      this.Quetion = this.Quetions[this.i];
    }
  }

  checkAns(singleChoice: boolean, option: string, ans: String[], type: boolean) {

    if (type == true) {
      if (this.selectedans) {
        this.selectedans.clear();
      }
      this.selectedans.add(option);
    }

    
    if (singleChoice == true) {
      this.selectedans.add(option);
    }
    else {
      this.selectedans.delete(option);
    }
    console.log(this.selectedans);

  }

  resultOfQuetion(ans: String[]) {

    console.log(this.selectedans.size, ans.length)

    if (this.selectedans.size < ans.length || this.selectedans.size > ans.length) {
      this.flag = false;
    }
    else {
      for (var j = 0; j < ans.length; j++) {
        if (this.selectedans.has(ans[j])) {
          this.flag = true;
        }
        else {
          this.flag = false;
          break;
        }
      }
    }

    if (this.flag == true) {
      alert("ok");
    }
    else {
      alert("not ok");
    }
  }

  explanation() {
    if (this.explanationofans == true) {
      this.explanationofans = false;
    }
    else {
      this.explanationofans = true;
    }
  }


}
