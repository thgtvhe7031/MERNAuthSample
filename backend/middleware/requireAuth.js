import * as jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const requireAuth = async (req, res, next) => {

    const {authorization} = req.headers
    //console.log(req.headers);
    if (!authorization) {
        res.status(401).json({error: 'Authorization token required'});
        return;
    }

    const token = authorization.split(' ')[1];

    try {
        const {_id} = jwt.verify(token, process.env.SECRET);

        req.user = await User.findOne({_id}).select(_id);
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({error: 'Request is not authorized'});
    }
}