import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Solve } from './solve.model';

@Injectable({ providedIn: 'root' })
export class SolvesService {
    solvesChanged = new Subject<Solve[]>();
    solveUpdated = new Subject<Solve>();
    scramble: string = ''
    private solves: Solve[] = [];
    private solvesHaveChanged(newSolves: Solve[] = []) {
        if (newSolves.length > 0)
            this.solves = newSolves;
        this.solvesChanged.next(this.solves.slice());
    }
    private getDiff(d1: Date, d2: Date) { return d2.getTime() - d1.getTime() }
    calcSolveTime(d1: Date, d2: Date) {
        let diff = this.getDiff(d1, d2)
        let minutes = Math.floor(diff / 60000)
            diff -= minutes * 60000
        let seconds = Math.floor(diff / 1000)
            diff -= seconds * 1000
        let milliseconds = diff

        return `${minutes > 0 ? `${minutes}:` : ''}${seconds}.${milliseconds}`
    }
    generateScramble() {
        this.scramble = "L2 U F2 B R' F2 B2 R B' D L' B2 L' F2 D2 B2 U2 R' D2"
    }

    constructor(private http: HttpClient) {
        this.generateScramble()
        http.get('http://localhost:3000/solves')
            .subscribe(
                (response: any) => { this.solvesHaveChanged(response.result) },
                (err: any) => { console.log(err) }
            )
    }

    getNumSolves() {
        return this.solves.length
    }

    getAverageTime() {
        return (this.solves.reduce((p: number, c: Solve) => p + this.getDiff(c.endTime, c.startTime), 0))
    }

    getBestTime() {
        return (this.solves.reduce((p: number, c: Solve) => {
            if (p == NaN) return this.getDiff(c.endTime, c.startTime)
            else return Math.min(this.getDiff(c.endTime, c.startTime), p)
        }, NaN))
    }

    getWorstTime() {
        return (this.solves.reduce((p: number, c: Solve) => {
            if (p == NaN) return this.getDiff(c.endTime, c.startTime)
            else return Math.max(this.getDiff(c.endTime, c.startTime), p)
        }, NaN))
    }

    addSolve(solve: Solve) {
        if (!solve) return
        solve.id = '';
    
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        this.http
            .post<{ result: Solve }>('http://localhost:3000/solves/', solve, { headers: headers })
            .subscribe((response) => {
                this.solves.push(response.result);
                this.solvesHaveChanged()
            });
    }
    updateSolve(originalSolve: Solve, newSolve: Solve) {
        if (!originalSolve || !newSolve) return

        const pos = this.solves.findIndex(d => d.id === originalSolve.id);
        if (pos < 0) return

        newSolve.id = originalSolve.id;
        newSolve._id = originalSolve._id;

        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        this.http
            .put('http://localhost:3000/solves/' + originalSolve.id, newSolve, { headers: headers })
            .subscribe(() => {
                this.solves[pos] = newSolve
                this.solvesHaveChanged()
                this.solveUpdated.next(newSolve)
            });
    }
    deleteSolve(solve: Solve) {
        if (!solve) return

        const pos = this.solves.findIndex((d) => d.id === solve.id);
        if (pos < 0) return

        this.http
            .delete('http://localhost:3000/solves/' + solve.id)
            .subscribe(() => {
                this.solves.splice(pos, 1);
                this.solvesHaveChanged()
            });
    }
    getSolve(id: string) {
        return this.http.get(`http://localhost:3000/solves/${id}`)
    }
    getSolves() {
        return this.http.get('http://localhost:3000/solves/')
    }
}
