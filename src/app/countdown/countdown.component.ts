import { Component, OnDestroy, OnInit, Input, SimpleChanges } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnInit, OnDestroy {
  @Input()timeLeft!: number; 
  private subscription!: Subscription;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['timeLeft'] && changes['timeLeft'].currentValue !== undefined) {
      this.startCountdown(changes['timeLeft'].currentValue);
    }
  }

  ngOnInit(): void {
    
  }

  startCountdown(seconds: number): void {
    this.cleanup();
    this.timeLeft = seconds;
    this.subscription = interval(1000)
      .pipe(takeWhile(() => this.timeLeft > 0))
      .subscribe(() => this.timeLeft--);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private cleanup(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  restart(): void {}
}
