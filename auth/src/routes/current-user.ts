import { currentUser } from './../middlewares/current-user';
import express from 'express'
// import { requireAuth } from '../middlewares/require-auth'

const currentUserRouter = express.Router()

currentUserRouter.get('/api/users/current-user', currentUser, (req, res) => {
    res.send({currentUser: req.currentUser})
})

export default currentUserRouter;
