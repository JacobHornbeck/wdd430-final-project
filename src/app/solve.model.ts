export class Solve {
    constructor(
        public id: string,
        public startTime: Date,
        public endTime: Date,
        public scramble?: string,
        public comment: string = '',
        public _id: string = ''
    ) {}
}