import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { error } from 'console';
import * as SockJs from 'sockjs-client';
import { GetSubjectsService } from 'src/app/services/getSubjects/get-subjects.service';
import * as Stomp from 'stompjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { GameService } from 'src/app/services/gameService/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  form: FormGroup;
  stompclient: any;
  topic: any = '/topic/game/';
  response: any;
  selectedIndex: number = -1;
  subjects: any[] = [];
  isVisible = false;
  generatedGameLink: string = environment.gameUrl + 'game/';
  copiedMessage: string = '';

  isGameRunning: boolean;

  serverResponse: any = {
    errorCode: '',
    message: ''
  };

  constructor(private subjectService: GetSubjectsService, private eRef: ElementRef, private fb: FormBuilder, private gameService: GameService) {

    this.isGameRunning = false;

    this.form = this.fb.group({
      host_username: ['', Validators.required],
      subject: ['', Validators.required],
      no_of_player: [null, [Validators.required, Validators.min(1)]],
      no_of_question: [null, [Validators.required, Validators.min(1)]],
      time_for_each_question: [null, [Validators.required, Validators.min(1)]],
      key: [null]
    });
  }

  ngOnInit(): void {
    this.subjectService.findSubjects().subscribe((data: any) => {
      this.subjects = data
    }, (err: any) => {
      this.serverResponse.errorCode = err.status;
      if (this.serverResponse.errorCode == 0) {
        this.serverResponse.message = "Sorry, our servers have crashed. We are currently working on fixing it."
        console.error("Api Call for find Subjects is Failed", this.form.controls)
      }
    })
  }

  filteredsubjects: any[] = [];

  onInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    this.form.get('subject')?.setValue(input);
    this.filteredsubjects = this.subjects.filter(item => item.subject.toLowerCase().includes(input));
    this.selectedIndex = -1;
  }

  onSelectItem(item: string): void {
    // Optionally, set the input value to the selected item
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    searchInput.value = item;
    this.filteredsubjects = [];
    this.selectedIndex = -1;
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Submitted', this.form.value);
      this.showPopup();
    } else {
      console.log('Form is invalid : ', this.form.getError);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      if (this.selectedIndex < this.filteredsubjects.length - 1) {
        this.selectedIndex++;
      }
    } else if (event.key === 'ArrowUp') {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      }
    } else if (event.key === 'Enter') {
      if (this.selectedIndex >= 0 && this.selectedIndex < this.filteredsubjects.length) {
        this.onSelectItem(this.filteredsubjects[this.selectedIndex].subject);
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.filteredsubjects = [];
      this.selectedIndex = -1;
    }
  }

  showPopup() {
    let _this = this;
    this.gameService.createGame(this.form).subscribe((res: any) => {
      _this.generatedGameLink = environment.gameUrl + 'game/'
      _this.generatedGameLink = _this.generatedGameLink + res.key;
      _this.isVisible = true;
      document.body.classList.add('blur-background');
    });
  }

  closePopup() {
    this.isVisible = false;
    document.body.classList.remove('blur-background');
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.generatedGameLink).then(() => {
      this.copiedMessage = '✅ Link copied!';

      // Optional: hide the message after 3 seconds
      setTimeout(() => {
        this.copiedMessage = '';
      }, 5000);
    });
  }

  redirectToLink(): void {
    if (this.generatedGameLink) {
      window.open(this.generatedGameLink, '_blank');
    }
  }


}
