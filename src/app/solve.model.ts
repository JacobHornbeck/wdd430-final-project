export class Solve {
    constructor(
        public id: number,
        public startTime: Date,
        public endTime: Date,
        public scramble?: string,
        public comment: string = '',
        public _id: string = '',
        public solveTime: string = '-.--'
    ) {}
}