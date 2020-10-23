import { currentUser } from './../middlewares/current-user';
import express from 'express'
import { requireAuth } from '../middlewares/require-auth'

const currentUserRouter = express.Router()

currentUserRouter.get('/api/users/current-user', currentUser, requireAuth, (req, res) => {
    res.send({currentUser: req.currentUser || null})
})

export default currentUserRouter;
