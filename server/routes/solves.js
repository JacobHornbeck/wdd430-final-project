var express = require('express');
var solvesRouter = express.Router();

const Solve = require('../models/solve')

solvesRouter.get('/', (req, res, next) => {
                Solve.find()
                     .then(solves => res.status(200).json(solves))
                     .catch(err => res.status(500).json({ error: err }))
            })
            .get('/:id', (req, res, next) => {
                Solve.find()
                     .then(solve => res.status(200).json(solve))
                     .catch(err => res.status(500).json({ error: err }))
            })
            .post('/', async (req, res, next) => {
                const newSolve = new Solve({
                    id: await Solve.getId(),
                    startTime: req.body.startTime,
                    endTime: req.body.endTime
                })
                if (req.body.scramble) newSolve.scramble = req.body.scramble

                newSolve.save()
                        .then(savedSolve => res.status(201).json(savedSolve))
                        .catch(err => res.status(500).json({ error: err }))
            })
            .put('/:id', (req, res, next) => {
                Solve
                    .findOne({ id: req.params.id })
                    .then(solve => {
                        solve.updateComment(req.body.comment)
                             .then(result => res.status(204).json(result))
                    })
                    .catch(err => res.status(500).json({ error: err }))
            })
            .delete('/:id', (req, res, next) => {
                Solve
                    .findByIdAndDelete(req.params.id)
                    .then(result => res.status(204).json(result) )
                    .catch(err => res.status(500).json({ error: err }))
            })
            .use('*', (req, res) => {
                res.status(404).json('That route isn\'t set, please check the route and try again')
            })

module.exports = solvesRouter