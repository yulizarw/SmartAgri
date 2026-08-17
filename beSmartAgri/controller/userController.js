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

            console.log(params, '<<<<')

            let loginUser = await User.findOne({
              where: {
                email: params.email,
              },
              include: Role,
            });
            console.log(loginUser)
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
                    // id: loginUser.id,
                    // access_token,
                    // email: loginUser.userEmail,
                    // fullName: loginUser.fullName,
                    // roleId: loginUser.roleId,
                    // password: loginUser.password,
                    // phone: loginUser.phone,
                    // address: loginUser.address
                    loginUser,access_token
                });
            } else {
                res.status(400).json("Password / Email yang anda masukkan SALAH");
            }
        } catch (err) {
            res.status(500).json(err)
        }
    }

    static async resetPassword(req, res) {
        try {
            const {
                email,
                passwordBaru
            } = req.body;

            if (!email || !passwordBaru) {
                return res.status(400).json({
                    message: "Email dan password baru wajib diisi!"
                });
            }

            // 1. Enkripsi manual password baru di sini
            const saltRound = 10;
            const passwordTerenkripsi = bcrypt.hashSync(passwordBaru, saltRound);

            // 2. Simpan hasil enkripsi ke database (bukan text mentah)
            const [updatedRows] = await User.update({
                password: passwordTerenkripsi
            }, {
                where: {
                    email: email
                }
            });

            if (updatedRows === 0) {
                return res.status(404).json({
                    message: "User tidak ditemukan!"
                });
            }

            return res.status(200).json({
                message: "Password berhasil di-reset secara manual!"
            });
        } catch (err) {
            res.status(500).json(err)
        }
    }
}