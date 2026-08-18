const { User, Role } = require("../models");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = class userController {
  // register user
  // static async registerUser(req, res) {
  //     try {
  //         let params = {
  //             fullName: req.body.fullName,
  //             email: req.body.email,
  //             password: req.body.password,
  //             phone: req.body.phone,
  //             address: req.body.address,
  //             status: true,
  //             // roleId:1
  //         }
  //         let findUser = await User.findOne({
  //             where: {
  //                 email: params.email
  //             }
  //         })
  //         if (!findUser) {
  //             let registerUser = await User.create(params)
  //             console.log(!findUser)
  //             console.log(registerUser, '<<<<<')
  //             let access_token = jwt.sign({
  //                 fullName: registerUser.fullName,
  //                 email: registerUser.email,
  //                 password: registerUser.password,
  //                 phone: registerUser.phone,
  //                 address: registerUser.address,
  //                 status: registerUser.status,
  //                 // roleId:registerUser.roleId
  //             }, process.env.SECRET)

  //             console.log(access_token, "asdasdasd")
  //             res.status(201).json({
  //                 access_token,
  //                 fullName: registerUser.fullName,
  //                 email: registerUser.email,
  //                 password: registerUser.password,
  //                 phone: registerUser.phone,
  //                 address: registerUser.address,
  //                 status: registerUser.status,
  //                 // roleId:registerUser.roleId
  //             })
  //         } else {
  //             res.status(401).json('Username anda sudah digunakan')
  //         }

  //     } catch (error) {
  //         res.status(500).json(error)
  //     }
  // }
  static async registerUser(req, res) {
    try {
      const { fullName, email, password, phone, address } = req.body;

      // =========================================================
      // VALIDASI
      // =========================================================
      if (!fullName || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Nama, email, dan password wajib diisi",
        });
      }

      const normalizedEmail = String(email).trim().toLowerCase();

      // =========================================================
      // CEK EMAIL
      // =========================================================
      const findUser = await User.findOne({
        where: {
          email: normalizedEmail,
        },
      });

      if (findUser) {
        return res.status(409).json({
          success: false,
          message: "Email sudah digunakan",
        });
      }

      // =========================================================
      // CREATE USER
      // password akan di-hash oleh beforeCreate hook
      // =========================================================
      const registerUser = await User.create({
        fullName: String(fullName).trim(),
        email: normalizedEmail,
        password,
        phone: phone || null,
        address: address || null,
        status: true,

        // sesuaikan dengan role user biasa
        roleId: 2,
      });

      // =========================================================
      // TOKEN
      // JANGAN MASUKKAN PASSWORD
      // =========================================================
      const access_token = jwt.sign(
        {
          id: registerUser.id,
          fullName: registerUser.fullName,
          email: registerUser.email,
          roleId: registerUser.roleId,
        },
        process.env.SECRET,
        {
          expiresIn: "1d",
        },
      );

      // =========================================================
      // RESPONSE
      // =========================================================
      return res.status(201).json({
        success: true,
        message: "Registrasi berhasil",

        access_token,

        user: {
          id: registerUser.id,
          fullName: registerUser.fullName,
          email: registerUser.email,
          phone: registerUser.phone,
          address: registerUser.address,
          status: registerUser.status,
          roleId: registerUser.roleId,
        },
      });
    } catch (error) {
      console.error("REGISTER USER ERROR:", error);

      return res.status(500).json({
        success: false,
        message: error.message || "Terjadi kesalahan pada server",
      });
    }
  }

  static async loginRole(req, res) {
    try {
      let params = {
        email: req.body.email,
        password: req.body.password,
      };

      console.log(params, "<<<<");

      let loginUser = await User.findOne({
        where: {
          email: params.email,
        },
        include: Role,
      });
      console.log(loginUser);
      if (
        loginUser &&
        bcrypt.compareSync(params.password, loginUser.password)
      ) {
        let access_token = jwt.sign(
          {
            id: loginUser.id,
            email: loginUser.userEmail,
            fullName: loginUser.fullName,
            roleId: loginUser.roleId,
            password: loginUser.password,
            phone: loginUser.phone,
            address: loginUser.address,
          },
          process.env.SECRET,
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
          loginUser,
          access_token,
        });
      } else {
        res.status(400).json("Password / Email yang anda masukkan SALAH");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async resetPassword(req, res) {
    try {
      const { email, passwordBaru } = req.body;

      if (!email || !passwordBaru) {
        return res.status(400).json({
          message: "Email dan password baru wajib diisi!",
        });
      }

      // 1. Enkripsi manual password baru di sini
      const saltRound = 10;
      const passwordTerenkripsi = bcrypt.hashSync(passwordBaru, saltRound);

      // 2. Simpan hasil enkripsi ke database (bukan text mentah)
      const [updatedRows] = await User.update(
        {
          password: passwordTerenkripsi,
        },
        {
          where: {
            email: email,
          },
        },
      );

      if (updatedRows === 0) {
        return res.status(404).json({
          message: "User tidak ditemukan!",
        });
      }

      return res.status(200).json({
        message: "Password berhasil di-reset secara manual!",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
};
