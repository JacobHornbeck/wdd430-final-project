import { Pipe, PipeTransform } from '@angular/core';

import { Solve } from "./solve.model";

@Pipe({ name: 'filterSolves' })
export class FilterSolvesPipe implements PipeTransform {
    transform(solves: Solve[], term: string): any {
        if (!solves) return;
        if (!term) return solves.slice();
        
        return solves.filter(solve => {
            return solve.comment.toLowerCase().includes(term.toLowerCase())
        });
    }
}
