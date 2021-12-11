const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const compression = require('compression')
const helmet = require('helmet')
const userRoutes = require('./routes/user.routes')
const roleRoutes = require('./routes/role.routes')
const postRoutes = require('./routes/post.routes')
const commentRoutes = require('./routes/comment.routes')
const networkRoutes = require('./routes/network.routes')

const app = express()


app.use(morgan('dev'))
app.use(cors({origin: ["*"],}))
app.use(compression())
app.use(helmet())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use('/api/user', userRoutes)
app.use('/api/role', roleRoutes)
app.use('/api/post', postRoutes)
app.use('/api/comment', commentRoutes)
app.use('/api/network', networkRoutes)

// app.use(identifyError,handleError)

function identifyError(req,res,next){
    const err = new Error("Endpoint Not Found")
    err.status = 404
    next(err)
}
function handleError(err,req,res){
    // res.header("Access-Control-Allow-Origin", "*")
    res.status(err.status || 500).json({
       error: {
            message: err.message || "endpoint not found",
            statusCode: err.status || 500,
            redirect: true,
            to: process.env.HOST
       }
    })
}


module.exports = app;
