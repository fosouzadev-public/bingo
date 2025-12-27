export class Ball {
    number: string;
    alreadyDrawn: boolean;

    constructor(number: string, alreadyDrawn: boolean = false) {
        this.number = number;
        this.alreadyDrawn = alreadyDrawn;
    }
}