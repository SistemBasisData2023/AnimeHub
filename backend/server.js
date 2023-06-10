
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path')

//initialize the app as an express app
const app = express();

const { connectDB } = require('./database/connectDB')
const animeRoutes = require('./routes/animeRoutes')
const accountRoutes = require('./routes/accountRoutes')
connectDB();

app.use(
    session({
        secret: 'ini contoh secret',
        saveUninitialized: false,
        resave: false
    })
);
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
const corsOptions = {
    origin: '*',
    Credentials: true,
    optionsSuccessStatus: 200
};

var temp;

app.use(cors(corsOptions))
app.use(express.static(path.join(__dirname, 'public')));
app.use("/", accountRoutes)
app.use("/", animeRoutes)
app.listen(process.env.PORT || 5500, () => {
    console.log(`App Started on PORT ${process.env.PORT || 5500}`);
});
