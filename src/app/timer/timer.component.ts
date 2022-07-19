import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Solve } from '../solve.model';

import { SolvesService } from '../solves.service';

export class Timer {
    startTime: Date = new Date()
    endTime: Date = new Date()
    constructor() {}

    start() {
        this.startTime = new Date()
    }
    stop() {
        this.endTime = new Date()
    }
}

@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {
    private timer: Timer = new Timer()
    private timerInterval: any = ''
    currentTime: string = '0.000'
    scramble: string = ''
    timing = false
    subscription: Subscription

    private getDiff(d1: Date, d2: Date) { return d2.getTime() - d1.getTime() }
    calcSolveTime(d1: Date, d2: Date) {
        let diff = this.getDiff(d1, d2)
        let minutes = Math.floor(diff / 60000)
            diff -= minutes * 60000
        let seconds = Math.floor(diff / 1000)
            diff -= seconds * 1000
        let milliseconds = Math.floor(diff)

        return `${minutes > 0 ? `${minutes}:` : ''}${((minutes > 0 && seconds < 10) ? `0${seconds}` : seconds)}.${milliseconds < 10 ? `00${milliseconds}` : (milliseconds < 100 ? `0${milliseconds}` : milliseconds)}`
    }

    constructor(private solvesService: SolvesService) {
        this.subscription = this.solvesService.scrambleChanged.subscribe((scramble: string) => {
            this.scramble = scramble
        })
    }
    ngOnInit(): void {
        this.scramble = this.solvesService.scramble
    }

    toggleTimer() {
        if (this.timing) {
            this.timer.stop()
            this.currentTime = this.calcSolveTime(this.timer.startTime, this.timer.endTime)
            this.timing = false
            clearInterval(this.timerInterval)
            this.solvesService.addSolve(new Solve(0, this.timer.startTime, this.timer.endTime, this.scramble))
            this.solvesService.generateScramble()
        }
        else {
            this.timer.start()
            this.timing = true
            this.timerInterval = setInterval(() => {
                this.currentTime = this.calcSolveTime(this.timer.startTime, new Date())
            }, 1)
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
