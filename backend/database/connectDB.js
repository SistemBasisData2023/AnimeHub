const {Client} = require("pg");

const db = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDB,
    password: process.env.PGPASS,
    port: process.env.PGPORT,
    sslmode: 'require',
    ssl: true
});

const connectDB = async () => {
    try{
        await db.connect();
        console.log("Database berhasil terkoneksi")
    }catch(err){
        console.error("Database gagal terkoneksi " + err.message)
    }
};

module.exports = {connectDB, db};