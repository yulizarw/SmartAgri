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

    static async listFarm(req, res) {
        try {
            const adminIsLogin = req.userLogin.roleId;

            if (!adminIsLogin) {
                return res.status(401).json({
                    message: "Anda Tidak Memiliki Akses"
                });
            }

            const listAllFarm = await Farm.findAll()

            return res.status(201).json(listAllFarm);

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }

    static async updateFarm(req, res) {
        try {
            const adminIsLogin = req.userLogin.roleId;

            if (!adminIsLogin) {
                return res.status(401).json({
                    message: "Anda Tidak Memiliki Akses"
                });
            }
            let id = req.params.id
            let params = {
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
                    id
                }
            });
            // console.log(searchFarm.name)
            if (searchFarm) {
                const changeDataFarm = await Farm.update(params, {
                    where: {
                        id
                    },
                    returning: true
                })
                return res.status(201).json(`Data pada ${searchFarm.name} telah diganti`)
            }

        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }

    static async deleteFarm(req, res) {
        try {
            const adminIsLogin = req.userLogin.roleId;

            if (!adminIsLogin) {
                return res.status(401).json({
                    message: "Anda Tidak Memiliki Akses"
                });
            }
            let id = req.params.id
            const searchFarm = await Farm.findOne({
                where: {
                    id
                }
            });

            if (!searchFarm){
                return res.status(404).json(`Tidak terdapat data Lahan ini`)
            }

            let hapusFarm = await Farm.destroy({where:{id}})
            return res.status(201).json(`Data ${searchFarm.name} telah dihapus`)
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }

    static async createDevice(req,res) {
        try {
            const adminIsLogin = req.userLogin.roleId;

            if (!adminIsLogin) {
                return res.status(401).json({
                    message: "Anda Tidak Memiliki Akses"
                });
            }

            let params = {
                deviceCode: req.body.deviceCode,
                deviceName: req.body.deviceName,
                firmWare: req.body.firmWare,
                ipAddress: req.body.ipAddress,
                status: req.body.status,
                farmId: req.body.farmId,
                macAddress: req.body.macAddress,
                connectionType: req.body.connectionType,
                lastSeen: req.body.lastSeen,
                apikey: "T4nahairku"
            }

            let searchDevice = await Device.findOne({where:{deviceCode:params.deviceCode}})
            if (searchDevice) {
                return res.status(409).json({
                    message: "Device sudah ada"
                });
            }

            let saveDevice = await Device.create(params)
            return res.status(201).json(`${params.deviceCode} sudah tersimpan dalam database`)
        }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }

     static async createSensor(req,res) {
        try {
            const adminIsLogin = req.userLogin.roleId;

            if (!adminIsLogin) {
                return res.status(401).json({
                    message: "Anda Tidak Memiliki Akses"
                });
            }

            let params = {
                sensorType: req.body.sensorType,
                pin: req.body.pin,
                unit: req.body.unit,
                location: req.body.location,
                deviceId: req.body.deviceId,
            }

            let searchDevice = await Sensor.findOne({where:{pin:params.pin}})
            if (searchDevice) {
                return res.status(409).json({
                    message: "Sensor sudah ada untuk pin tersebut"
                });
            }

            let saveDevice = await Sensor.create(params)
            return res.status(201).json(`${params.sensorType} pada ${params.pin} sudah tersimpan dalam database `)
        }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }

}