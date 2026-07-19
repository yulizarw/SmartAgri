const {
    User,
    Role
} = require('../models')
const axios = require('axios')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = class userController {
    // register user
    static async registerUser(req, res) {
        try {
            let params = {
                fullName: req.body.fullName,
                email: req.body.email,
                password: req.body.password,
                phone: req.body.phone,
                address: req.body.address,
                status: true,
                // roleId:1
            }
            let findUser = await User.findOne({
                where: {
                    email: params.email
                }
            })
            if (!findUser) {
                let registerUser = await User.create(params)
                console.log(!findUser)
                console.log(registerUser, '<<<<<')
                let access_token = jwt.sign({
                    fullName: registerUser.fullName,
                    email: registerUser.email,
                    password: registerUser.password,
                    phone: registerUser.phone,
                    address: registerUser.address,
                    status: registerUser.status,
                    // roleId:registerUser.roleId
                }, process.env.SECRET)

                console.log(access_token, "asdasdasd")
                res.status(201).json({
                    access_token,
                    fullName: registerUser.fullName,
                    email: registerUser.email,
                    password: registerUser.password,
                    phone: registerUser.phone,
                    address: registerUser.address,
                    status: registerUser.status,
                    // roleId:registerUser.roleId
                })
            } else {
                res.status(401).json('Username anda sudah digunakan')
            }

        } catch (error) {
            res.status(500).json(error)
        }
    }

    static async loginRole(req, res) {
        try {
            
            let params = {
                email: req.body.email,
                password: req.body.password,
            }

            console.log(params,'<<<<')

            let loginUser = await User.findOne({
                where: {
                    email: params.email
                }
            })
            console.log(bcrypt.compareSync(params.password, loginUser.email))
            if (
                loginUser &&
                bcrypt.compareSync(params.password, loginUser.password)
            ) {
                let access_token = jwt.sign({
                        id: loginUser.id,
                        email: loginUser.userEmail,
                        fullName: loginUser.fullName,
                        roleId: loginUser.roleId,
                        password: loginUser.password,
                        phone: loginUser.phone,
                        address: loginUser.address
                    },
                    process.env.SECRET
                );

                res.status(201).json({
                    id: loginUser.id,
                    access_token,
                    email: loginUser.userEmail,
                    fullName: loginUser.fullName,
                    roleId: loginUser.roleId,
                    password: loginUser.password,
                    phone: loginUser.phone,
                    address: loginUser.address
                });
            } else {
                res.status(400).json("Password / Email yang anda masukkan SALAH");
            }
        } catch (err) {
            res.status(500).json(err)
        }
    }
}