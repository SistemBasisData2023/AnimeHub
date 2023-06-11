const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const { connectDB } = require('./database/connectDB');
const animeRoutes = require('./routes/animeRoutes');
const accountRoutes = require('./routes/accountRoutes');

connectDB();

const app = express();

app.use(
  express.static(path.join(__dirname, 'public')),
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    exposedHeaders: ['set-cookie']
  }),
  express.json(),
  express.urlencoded({ extended: true }),
  session({
    secret: 'ini-contoh-secret',
    saveUninitialized: false,
    resave: false
  })
);

app.use("/", accountRoutes);
app.use("/", animeRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(process.env.PORT || 5500, () => {
  console.log(`App Started on PORT ${process.env.PORT || 5500}`);
});
