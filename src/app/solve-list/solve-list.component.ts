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

    constructor(private solvesService: SolvesService) {
        this.subscription = this.solvesService.solvesChanged.subscribe((solves: Solve[]) => {
            this.solves = solves
        })
    }
    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
