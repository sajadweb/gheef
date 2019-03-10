import 'reflect-metadata';
import * as dotenv from "dotenv";
dotenv.config();
import * as path from 'path';
import * as Multer from 'multer';
import * as FTPStorage from 'multer-ftp';
import { startDB, models } from './db';
import createServer from './createServer';
import { deCode, random, LogCatch, LogApi } from "./tools";
const db = startDB();
const context = {
    models,
    db,
    pubsub: null
};
const server = createServer(context);
server.express.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// //TODO USE express middleware to handel Cookies (JWT)
server.express.use((req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        const user = deCode(token);
        if (user) {
            req["userId"] = user.id;
        } else {
            LogApi(`ip:${req.ip}:401:not authorized:Api:token:${JSON.stringify(req.headers)}`)
            res.status(401).send("not authorized");
            return;
        }
    }
    next();
});

server.express.use(async (req, res, next) => {
    if (!req["userId"]) return next();
    const User = models.User
    const user = await User.findById(req["userId"]);
    if (user) {
        req["user"] = user;
    }
    next();
});
// TODO USE express middleware to  populate current user
server.express.post("/upload", function (req, res, next) {
    if (!req["userId"]) {
        return res.send({
            success: "123"
        });
    }
    let ftpstorage = new FTPStorage({
        basepath: '/public_html/uploads',
        ftp: {
            host: process.env.FTP_HOST,
            secure: false, // enables FTPS/FTP with TLS
            user: process.env.FTP_USER,
            password: process.env.FTP_PASWORD
        },
        destination: function (req, file, options, callback) {
            callback(null, '/public_html/uploads/' + Date.now() + random(5) + path.extname(file.originalname)) // custom file destination, file extension is added to the end of the path
        },
        transformFile: function (req, file, callback) {
            // transform the file before uploading it
            //   file.stream is a ReadableStream of the file
            //   callback(error, < ReadableStream | Buffer | String >)
            callback(null, file.stream)
        }
    })

    let upload = Multer({ storage: ftpstorage }).single("photo")
    upload(req, res, function (err) {
        if (!req.file) {
            console.log("sasassa")
            return res.send({
                success: false
            });

        } else {
            const host = process.env.FRONTEND_URL+"/";
            const filePath = req.file.path.replace(/\/public_html\//, '');
            let Photo = models.Photo;
            let photos = new Photo({
                user: req["userId"],
                path: filePath
            });

            photos.save(function (err, data) {
                return res.send({
                    success: true,
                    file: filePath,
                    host: host,
                    data: data.id
                })
            });
        }
    });
})

server.start({
    endpoint: '/graphql',
    playground: '/',
    getEndpoint: true,
    cors: {
        credentials: true
    },
    formatError(err: any): any {
        LogCatch(JSON.stringify(err))
        return err;
    },
    cacheControl: false,
    debug: false

}, deets => {
    console.log(`server is now running on port ${deets.port}`);
})