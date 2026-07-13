if(process.env.NODE_ENV != 'production'){
  require('dotenv').config()
}
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000
app.use(cors())
const routes = require('./routes/')
const errorHandler = require('./middlewares/errorHandler')

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(routes)
app.use(errorHandler)

app.listen(port, ()=>{
  console.log('dis app listening to ' + port + ' y pal')
})

module.exports=app