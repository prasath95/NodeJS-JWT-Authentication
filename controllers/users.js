const User = require('../model/user');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');


exports.user_register = async (req, res, next) => {

    await User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(422).json({
                    message: 'mail exists'
                });

            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    }
                    else {


                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });


                        //if the user mail validation is correct
                        //then try to sent the jwt response in first time

                        user.save()
                            .then(result => {
                                if (result) {
                                    const token = jwt.sign({
                                        email: result.email,
                                        userId: result._id
                                    },
                                        config.get("App.jwt.code"),
                                        {
                                            expiresIn: config.get("App.jwt.time")
                                        });


                                    return res.status(201).json({
                                        message: 'User created',
                                        email: result.email,
                                        userId: result._id,
                                        token: token
                                    });
                                }

                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }

                });

            }
        })
        .catch(err => {
            console.log('#####');
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

};


exports.user_login = async (req, res, next) => {
    await User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth Failed'
                    });
                }

                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    config.get("App.jwt.code"),
                    {
                        expiresIn: config.get("App.jwt.time")
                    });

                    return res.status(200).json({
                        message: 'Auth Successful',
                        userId: user[0]._id,
                        token: token
                    });
                }

                res.status(401).json({
                    error: 'Auth failed'
                })

            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.user_delete = async (req, res, next) => {
    await User.deleteOne({ _id: req.params.userId })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'User Deleted',
                result:result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

};



