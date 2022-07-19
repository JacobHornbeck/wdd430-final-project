import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Solve } from '../solve.model';
import { SolvesService } from '../solves.service';

@Component({
    selector: 'app-solve-list',
    templateUrl: './solve-list.component.html',
    styleUrls: ['./solve-list.component.scss']
})
export class SolveListComponent implements OnInit, OnDestroy {
    solves: Solve[] = []
    subscription: Subscription
    worstTime: string = '-.---'
    bestTime: string = '-.---'
    averageTime: string = '-.---'
    solveCount: number = 0
    originalSolve: Solve | null = null
    updatedSolve: Solve | null = null

    constructor(private solvesService: SolvesService) {
        this.subscription = this.solvesService.solvesChanged.subscribe((solves: Solve[]) => {
            this.solves = solves.map(solve => {
                solve.solveTime = this.solvesService.calcSolveTime(solve.startTime, solve.endTime)
                return solve
            })
            if (solves.length > 0) {
                this.worstTime = this.solvesService.expandSolveTime(this.solvesService.getWorstTime())
                this.bestTime = this.solvesService.expandSolveTime(this.solvesService.getBestTime())
                this.averageTime = this.solvesService.expandSolveTime(this.solvesService.getAverageTime())
                this.solveCount = this.solvesService.getNumSolves()
            }
            else {
                this.worstTime = '-.---'
                this.bestTime = '-.---'
                this.averageTime = '-.---'
                this.solveCount = 0
            }
        })
    }
    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    updateComment(id: number) {
        this.originalSolve = this.solves.filter(s => s.id == id)[0]
        this.updatedSolve = new Solve(
            0,
            this.originalSolve.startTime,
            this.originalSolve.endTime,
            this.originalSolve.scramble,
            (<HTMLInputElement>document.querySelector(`#comment${id}`)).value)
        this.solvesService.updateSolve(this.originalSolve, this.updatedSolve)
    }

    deleteSolve(id: number) { this.solvesService.deleteSolve(id) }
}
