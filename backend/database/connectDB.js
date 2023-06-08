const {Client} = require("pg");

const db = new Client({
    user: 'laode.alif',
    host: 'ep-wild-shadow-492151.ap-southeast-1.aws.neon.tech',
    database: 'animehub',
    password: 'Fm8Wq6ITNhkH',
    port: 5432,
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