import { Password } from './../services/password';
import mongoose from 'mongoose'

interface UserAttrs {
    email: string;
    password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc
}

interface UserDoc extends mongoose.Document {
    email: string,
    password: string,
    createdAt: string
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    userObject.id = user._id
    
    delete userObject.password
    delete userObject.tokens
    delete userObject.__v
    delete userObject._id

    return userObject
}

userSchema.pre('save', async function(done){
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'))
        this.set('password', hashed)
    }
    done()
})

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

const user = User.build({
    email: 'test@test.com',
    password: "password"
})

user.password
user.createdAt

export default User
