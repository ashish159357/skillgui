import { Component, OnDestroy, OnInit, Input, SimpleChanges } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnInit, OnDestroy {
  @Input() timeLeft!: number;
  @Input() totalTime: number = 30; // Total time for progress calculation
  private subscription!: Subscription;

  // Animation states
  isWarning: boolean = false;
  isCritical: boolean = false;
  isPulsing: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['timeLeft'] && changes['timeLeft'].currentValue !== undefined) {
      this.startCountdown(changes['timeLeft'].currentValue);
    }

    // Set total time if provided
    if (changes['totalTime'] && changes['totalTime'].currentValue !== undefined) {
      this.totalTime = changes['totalTime'].currentValue;
    }
  }

  ngOnInit(): void {

  }

  startCountdown(seconds: number): void {
    this.cleanup();
    this.timeLeft = seconds;
    this.subscription = interval(1000)
      .pipe(takeWhile(() => this.timeLeft > 0))
      .subscribe(() => {
        this.timeLeft--;
        this.updateAnimationStates();
      });

    this.updateAnimationStates();
  }

  updateAnimationStates(): void {
    const percentage = (this.timeLeft / this.totalTime) * 100;

    // Critical: less than 20% time remaining
    this.isCritical = percentage < 20 && this.timeLeft > 0;

    // Warning: less than 50% time remaining
    this.isWarning = percentage < 50 && percentage >= 20;

    // Pulsing: less than 10 seconds
    this.isPulsing = this.timeLeft <= 10 && this.timeLeft > 0;
  }

  getProgressPercentage(): number {
    return (this.timeLeft / this.totalTime) * 100;
  }

  getProgressColor(): string {
    const percentage = this.getProgressPercentage();

    if (percentage < 20) {
      return '#ff4757'; // Red
    } else if (percentage < 50) {
      return '#ffa502'; // Orange
    } else {
      return '#26de81'; // Green
    }
  }

  getTimerEmoji(): string {
    const percentage = this.getProgressPercentage();

    if (percentage < 20) {
      return '🔥'; // Critical
    } else if (percentage < 50) {
      return '⚡'; // Warning
    } else {
      return '⏰'; // Normal
    }
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
