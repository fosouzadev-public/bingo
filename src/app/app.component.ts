import { Component, computed, OnInit, Signal, signal, WritableSignal } from '@angular/core';
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
export class AppComponent implements OnInit {
  private _maxBalls = 80;
  private currentIndex!: number;
  private shuffledBalls!: Ball[];

  protected balls: WritableSignal<Ball[]> = signal([]);
  protected currentBall: WritableSignal<Ball> = signal(new Ball(''));

  ngOnInit() {
    if (this.loadFromLocalStorage() == false) {
      this.start();
    }
  }

  start() {
    localStorage.clear();

    this.currentIndex = -1;
    this.currentBall.set(new Ball(''));

    this.generateBalls();
    this.shuffleBalls();
  }

  private generateBalls() {
    const balls = Array.from({ length: this._maxBalls }, (_, index) => new Ball(
      (index + 1).toString().padStart(2, '0')
    ));
    this.balls.set(balls);
  }

  private shuffleBalls() {
    this.shuffledBalls = [...this.balls()];

    for (let index = this.shuffledBalls.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [this.shuffledBalls[index], this.shuffledBalls[randomIndex]] = [this.shuffledBalls[randomIndex], this.shuffledBalls[index]];
    }
  }

  drawBall() {
    ++this.currentIndex;

    if (this.currentIndex < this._maxBalls) {
      const ballToDraw = this.shuffledBalls[this.currentIndex];
      ballToDraw.alreadyDrawn = true;

      this.currentBall.set(ballToDraw);
      // Notify signal that the array content has mutated (crucial for OnPush / efficient change detection)
      this.balls.update(current => [...current]);

      localStorage.setItem('savedShuffledBalls', JSON.stringify(this.shuffledBalls));
      localStorage.setItem('savedCurrentIndex', this.currentIndex.toString());
    }
  }

  private loadFromLocalStorage(): boolean {
    const savedShuffledBalls = localStorage.getItem('savedShuffledBalls');
    const savedCurrentIndex = localStorage.getItem('savedCurrentIndex');

    if (savedShuffledBalls && savedCurrentIndex) {
      const parsedShuffledBalls: Ball[] = JSON.parse(savedShuffledBalls);

      this.shuffledBalls = parsedShuffledBalls;
      this.balls.set([...parsedShuffledBalls].sort((a, b) => +a.number - +b.number));

      this.currentIndex = Number(savedCurrentIndex);
      this.currentBall.set(this.shuffledBalls[this.currentIndex]);

      return true;
    }

    return false;
  }
}
