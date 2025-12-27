import { Component, computed, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ball } from './models/ball.model';

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

  private currentIndex: WritableSignal<number> = signal(-1);
  private shuffledBalls: WritableSignal<Ball[]> = signal([]);

  protected balls: Signal<Ball[]> = computed(() =>
    [...this.shuffledBalls()].sort((a, b) => +a.number - +b.number));

  protected currentBall: Signal<Ball> = computed(() => {
    if (this.currentIndex() < 0) {
      return new Ball('');
    }

    return this.shuffledBalls()[this.currentIndex()];
  });

  ngOnInit() {
    if (this.loadFromLocalStorage() == false) {
      this.start();
    }
  }

  start() {
    localStorage.clear();
    this.currentIndex.set(-1);
    this.generateAndShuffleBalls();
  }

  private generateAndShuffleBalls() {
    const shuffledBalls = this.shuffleBalls(this.generateBalls());
    this.shuffledBalls.set(shuffledBalls);
  }

  private generateBalls(): Ball[] {
    const balls = Array.from({ length: this._maxBalls }, (_, index) => new Ball(
      (index + 1).toString().padStart(2, '0')
    ));

    return balls;
  }

  private shuffleBalls(balls: Ball[]): Ball[] {
    for (let index = this._maxBalls - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [balls[index], balls[randomIndex]] = [balls[randomIndex], balls[index]];
    }

    return balls;
  }

  drawBall() {
    const newIndex = this.currentIndex() + 1;

    if (newIndex >= 0 && newIndex < this._maxBalls) {
      const ballToDraw = this.shuffledBalls()[newIndex];
      ballToDraw.alreadyDrawn = true;

      this.shuffledBalls.update(current => [...current]);
      this.currentIndex.set(newIndex);

      localStorage.setItem('savedShuffledBalls', JSON.stringify(this.shuffledBalls()));
      localStorage.setItem('savedCurrentIndex', this.currentIndex().toString());
    }
  }

  private loadFromLocalStorage(): boolean {
    const savedShuffledBalls = localStorage.getItem('savedShuffledBalls');
    const savedCurrentIndex = localStorage.getItem('savedCurrentIndex');

    if (savedShuffledBalls && savedCurrentIndex) {
      const parsedShuffledBalls: Ball[] = JSON.parse(savedShuffledBalls);

      this.shuffledBalls.set(parsedShuffledBalls);
      this.currentIndex.set(Number(savedCurrentIndex));

      return true;
    }

    return false;
  }
}