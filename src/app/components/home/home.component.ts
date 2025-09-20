import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { GetSubjectsService } from 'src/app/services/getSubjects/get-subjects.service';
import { Subject } from 'src/app/model/Subjects/subject';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isUser:any=localStorage.getItem('isUserLoggedIn');
  subjects:Subject[] | undefined;

  constructor(private authService: AuthService,private getsubjectservice:GetSubjectsService) {}

  ngOnInit() {
    let storeData = localStorage.getItem("isUserLoggedIn");

    if( storeData != null && storeData == "true")
       this.isUser = localStorage.getItem("isUserLoggedIn");
    else
       this.isUser = localStorage.getItem("isUserLoggedIn");

    this.getData();
 }


 getData(){

   var aa=this.getsubjectservice.findSubjects().subscribe((data: Subject[] | undefined)=>
    {
      console.log(data);
      this.subjects=data;
    });

 }

}
