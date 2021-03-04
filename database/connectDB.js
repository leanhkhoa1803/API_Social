const mongoose = require("mongoose");

class ConnectMongo {
  constructor() {
    this.gfs = null;
  }

  static getConnect() {
    mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    const conn = mongoose.connection;
    //khoi tao bucket ngay luc ket noi mongodb
    conn.once("open", () => {
      console.log("DB is connected");
      this.gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: process.env.MONGO_BUCKET,
      });
    });
  }
}

exports.ConnectMongo = ConnectMongo;
