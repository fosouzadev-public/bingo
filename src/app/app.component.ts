import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export class Ball {
  number: string;
  alreadyDrawn: boolean;

  constructor(number: string, alreadyDrawn: boolean = false) {
    this.number = number;
    this.alreadyDrawn = alreadyDrawn;
  }
}

@Component({
  selector: 'app-root',
  imports: [
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private _maxBalls = 75;
  private currentIndex!: number;

  shuffledBalls!: Ball[];
  currentBall!: Ball;

  constructor() {
    this.start();
  }

  private generateBalls() {
    this.shuffledBalls = Array.from({ length: this._maxBalls }, (_, index) => new Ball( 
      (index + 1).toString().padStart(2, '0')
    ));
  }

  private shuffleBalls() {
    for (let index = this.shuffledBalls.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [this.shuffledBalls[index], this.shuffledBalls[randomIndex]] = [this.shuffledBalls[randomIndex], this.shuffledBalls[index]];
    }
  }

  drawBall() {
    ++this.currentIndex;

    if (this.currentIndex < this.shuffledBalls.length) {
      this.currentBall = this.shuffledBalls[this.currentIndex];
      this.currentBall.alreadyDrawn = true;
    }
  }

  start() {
    this.currentIndex = -1;
    this.currentBall = new Ball("00");

    this.generateBalls();
    this.shuffleBalls();
  }
}
