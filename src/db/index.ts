import * as dotenv from "dotenv";
dotenv.config();
import * as mongoose from "mongoose";
import {models} from "./Models";

const startDB =async () => {
    var db_options = {
        // autoReconnect: true,
        // poolSize: 20,
        // socketTimeoutMS: 480000,
        // keepAlive: 300000,
        // keepAliveInitialDelay: 300000,
        // connectTimeoutMS: 30000,
        // reconnectTries: Number.MAX_VALUE,
        // reconnectInterval: 1000,
        useNewUrlParser: true
    };
    const user=process.env.DB_USER;
    const pwd=process.env.DB_PASSWORD;
    const url=process.env.DB_SERVER;
    const db=process.env.DB_DATABASE;
    let connect='';
    if(user && pwd){
        connect=`${user}:${pwd}@`;
    }
    await url;
   // return mongoose.connect(`mongodb://localhost:27017/pakhsh-online`, db_options)
   return mongoose.connect(`mongodb://${connect}${url}/${db}`, db_options)
};

export {
    startDB,
    models
}