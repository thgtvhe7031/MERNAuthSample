import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.statics.signup = async (email, password) => {
    
    if (!email || !password) {
        throw Error('All fields must be filled');
    }

    if(!validator.isEmail(email)) {
        throw Error('Invalid email');
    }

    const exist = this.findOne({email});
 
    if (exist) {
        throw Error('Email already existed');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({email, password: hash});

    return user;
}

userSchema.statics.login = async (email, password) => {
    const user = this.findOne({email});
 
    if (!user) {
        throw Error('Incorrect email');
    }

    const match = bcrypt.compare(password, user.password);

    if (!match) {
        throw Error('Incorrect password');
    }

    return user;
}

const User = mongoose.model('User', userSchema);

export default User;