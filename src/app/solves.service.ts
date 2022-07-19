import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Solve } from './solve.model';

let turns = ['U','D','L','R','F','B']
let directions = ['', '2', '\'', '', '2']

@Injectable({ providedIn: 'root' })
export class SolvesService {
    solvesChanged = new Subject<Solve[]>();
    scrambleChanged = new Subject<string>();
    scramble: string = ''
    private solves: Solve[] = [];
    private solvesHaveChanged(newSolves: Solve[] = []) {
        if (newSolves.length > 0)
            this.solves = newSolves;
        this.solvesChanged.next(this.solves.slice());
    }
    private getDiff(d1: Date, d2: Date) { return new Date(d2).getTime() - new Date(d1).getTime() }
    expandSolveTime(t: number) {
        let diff = t
        let minutes = Math.floor(diff / 60000)
            diff -= minutes * 60000
        let seconds = Math.floor(diff / 1000)
            diff -= seconds * 1000
        let milliseconds = Math.floor(diff)

        return `${minutes > 0 ? `${minutes}:` : ''}${((minutes > 0 && seconds < 10) ? `0${seconds}` : seconds)}.${milliseconds < 10 ? `00${milliseconds}` : (milliseconds < 100 ? `0${milliseconds}` : milliseconds)}`
    }
    calcSolveTime(d1: Date, d2: Date) {
        let diff = this.getDiff(d1, d2)
        let minutes = Math.floor(diff / 60000)
            diff -= minutes * 60000
        let seconds = Math.floor(diff / 1000)
            diff -= seconds * 1000
        let milliseconds = Math.floor(diff)

        return `${minutes > 0 ? `${minutes}:` : ''}${((minutes > 0 && seconds < 10) ? `0${seconds}` : seconds)}.${milliseconds < 10 ? `00${milliseconds}` : (milliseconds < 100 ? `0${milliseconds}` : milliseconds)}`
    }
    generateScramble() {
        let temp = ''
        let start = Math.floor(Math.random()*turns.length)
        for (let i = 0; i < 20; i++) {
            temp += turns[start]+directions[Math.floor(Math.random()*100)%directions.length] + " "
            start = (start + Math.floor(Math.random()*2+1)) % turns.length
        }
        this.scramble = temp
        this.scrambleChanged.next(this.scramble)
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
        return (this.solves.reduce((p: number, c: Solve) => p + this.getDiff(c.startTime, c.endTime), 0)/this.solves.length)
    }

    getBestTime() {
        return (this.solves.reduce((p: number, c: Solve) => {
            return Math.min(this.getDiff(c.startTime, c.endTime), p)
        }, Infinity))
    }

    getWorstTime() {
        return (this.solves.reduce((p: number, c: Solve) => {
            return Math.max(this.getDiff(c.startTime, c.endTime), p)
        }, 0))
    }

    addSolve(solve: Solve) {
        if (!solve) return
        solve.id = 0;
    
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
            });
    }
    deleteSolve(id: number) {
        if (!id) return

        const pos = this.solves.findIndex((d) => d.id === id);
        if (pos < 0) return

        this.http
            .delete('http://localhost:3000/solves/' + id)
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
