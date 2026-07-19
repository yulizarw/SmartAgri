const {User, Admin} = require("../models")
const jwt = require('jsonwebtoken')
const config =require('../config/config')

const authentication = async (req, res, next) => {
  try {
    //   const { access_token } = req.headers;
    const access_token = req.headers['access_token'] || req.query.access_token;
    //   console.log(access_token)
      if (access_token) {
          req.userLogin = jwt.verify(access_token, process.env.SECRET);
        
         
          
          if (req.userLogin.role.toLowerCase() === "admin") {
              await User.findByPk(req.userLogin.id) 
                  .then((admin) => {
                      if (!admin) {
                          res.status(400).json("Wrong Auth");
                      }
                      next();
                  })
                  .catch((err) => {
                      res.status(500).json(err);
                  });
          } else if (req.userLogin.role.toLowerCase()=== "siswa") {
              await User.findByPk(req.userLogin.id).then((siswa) => {
                  if (!siswa) {
                      res.status(400).json("Wrong Auth");
                  }
                  next();
              });
          } else if (req.userLogin.role.toLowerCase() === "guru") {
              await User.findByPk(req.userLogin.id)
                  .then((guru) => {
                      if (!guru) {
                          res.status(400).json("Wrong Auth");
                      }
                      next()
                  })
          } else if (req.userLogin.role.toLowerCase() === "petani") {
              await dosenPembimbing.findByPk(req.userLogin.id)
                  .then((petani) => {
                      if (!petani) {
                          res.status(400).json("Wrong Auth");
                      }
                      next()
                  })
          } 
        
      } else {
          res.status(401).json("You are unauthorized to do this");
        //   console.log(access_token,'a')
          
      }
  } catch (error) {
      res.status(500).json(error.message)
      console.log(error)
  }
};

module.exports = { authentication };