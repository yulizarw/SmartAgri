const axios = require('axios')
const {
    Role,
    Farm,
    Sensor,
    Device,
    User
} = require('../models')

module.exports = class adminController {
    static async changeRole(req, res) {
        try {
            const adminIsLogin = req.userLogin.roleId
            const id = req.params.id

            let params = {
                roleId: req.body.roleId
            }
            let filterUser = await User.findOne({
                where: {
                    id
                }
            })
            console.log(filterUser.roleId)

            if (adminIsLogin == 1) {

                if (filterUser) {
                    if (!filterUser.roleId) {
                        let editRoleUser = await User.update(params, {
                            where: {
                                id
                            },
                            returning: true
                        })
                        if (editRoleUser[0] == 0) {
                            res.status(400).json('Pengguna Tidak Terdaftar')

                        } else if (!params) {
                            res.status(400).json('Silahkan isi detail Role')
                        } else {
                            res.status(200).json(`User with id ${id} has been updated`)
                        }
                    } else {
                        res.status(409).json('User sudah memiliki role')
                    }

                } else {
                    res.status(404).json('Pengguna Tidak Terdaftar')
                }
            } else {
                res.status(401).json('Anda Tidak Memiliki Akses Ini')
            }


        } catch (err) {
            res.status(500).json(error)
        }
    }

    // static async createFarm(req, res) {
    //     try {
    //         let adminIsLogin = req.userLogin.roleId
    //         let params = {
    //             name: req.body.name,
    //             // area itu luas lahan yang dihitung dari frontendaja
    //             area: req.body.area,
    //             latitude: req.body.latitude,
    //             longitude: req.body.longitude,
    //             polygon: req.body.polygon,
    //             address: req.body.address,
    //             status: req.body.status,
    //             userId: req.body.userId
    //         }
    //         if (adminIsLogin) {
    //             let searchFarm = await Farm.findOne({
    //                 where: {
    //                     name: params.name
    //                 }
    //             })
    //             if (!searchFarm) {
    //                 let buatFarm = await Farm.create(params)
    //                 if (buatFarm) {
    //                     res.status(201).json('Lahan Berhasil dibuat')
    //                 } else {
    //                     res.status(400).json('Lahan Tidak Berhasil dibuat')
    //                 }
    //             } else {
    //                 res.status(409).json('Lahan sudah ada')
    //             }
    //         } else {
    //             res.status(401).json('Anda Tidak Memiliki Akses Ini')
    //         }
    //     } catch (err) {
    //         res.status(500).json(err)
    //     }
    // }
    static async createFarm(req, res) {

        try {

            const adminIsLogin = req.userLogin.roleId;

            if (!adminIsLogin) {
                return res.status(401).json({
                    message: "Anda Tidak Memiliki Akses"
                });
            }

            const params = {
                name: req.body.name,
                area: req.body.area,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                polygon: req.body.polygon,
                address: req.body.address,
                status: req.body.status,
                userId: req.body.userId
            };

            const searchFarm = await Farm.findOne({
                where: {
                    name: params.name
                }
            });

            if (searchFarm) {
                return res.status(409).json({
                    message: "Lahan sudah ada"
                });
            }

            const farm = await Farm.create(params);

            return res.status(201).json({
                success: true,
                data: farm
            });

        } catch (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

    }

}