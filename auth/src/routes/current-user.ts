import { currentUser } from './../middlewares/current-user';
import express from 'express'
import jwt from 'jsonwebtoken'

const currentUserRouter = express.Router()

currentUserRouter.get('/api/users/current-user', currentUser, (req, res) => {
    res.send({currentUser: req.currentUser || null})
})

export default currentUserRouter; 
