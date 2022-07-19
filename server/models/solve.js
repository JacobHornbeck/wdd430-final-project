const mongoose = require('mongoose')
const Schema = mongoose.Schema

/* { id: String, startTime: Date, endTime: Date, scramble: String, comment: String } */
/* Methods: Schema.getId() and Solve.updateComment() */

const solveSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    scramble: {
        type: String,
        required: false
    },
    comment: {
        type: String,
        required: false,
        default: ''
    }
})

solveSchema.statics.getId = async function() {
    let solves = Array.from(await this.find())
    return solves.reduce((p, c) => {
        if (c.id == p) return p+1
        else return p
    }, 1)
}

solveSchema.methods.updateComment = function(newComment) {
    this.comment = newComment
    return this.save()
}

module.exports = mongoose.model('Solve', solveSchema)
