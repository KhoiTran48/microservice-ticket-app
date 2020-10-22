import express from 'express'
import jwt from 'jsonwebtoken'

const currentUserRouter = express.Router()

currentUserRouter.get('/api/users/current-user', (req, res) => {
    if(!req.session?.jwt){
        return res.send({currentUser: null})
    }
    
    try{
        const payload = jwt.verify(
            req.session.jwt,
            process.env.JWT_KEY!
        )
        res.send({currentUser: payload})
    }catch(errr){
        res.send({currentUser: null})
    }
})

export default currentUserRouter; 
