const express = require('express')
require('./db/mongodb')
require('dotenv').config()
const cors = require('cors');
const bodyParser = require('body-parser');

const userRouter = require('./routes/user')
const postRouter = require('./routes/post')

const app = express()

app.use(bodyParser.json())

// var allowedOrigins = ['https://life-saver-app.herokuapp.com',
//                       'http://localhost:3000', 'http://localhost:4200', 'http://192.168.0.5:3000'];

// app.use(cors({
//   origin: function(origin, callback){
//     // allow requests with no origin
//     // (like mobile apps or curl requests)
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){
//       var msg = 'The CORS policy for this site does not ' +
//                 'allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },

//   exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],

//   credentials: true,
// }));


app.use(userRouter)
app.use(postRouter)

const port = process.env.PORT;

app.listen(port, () => {
    console.log('Server running on port ' + port)
})