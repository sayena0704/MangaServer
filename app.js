import express from "express"
import {config} from "dotenv"
import ErrorMiddleware from "./Middlewares/Error.js";
import cookieParser from "cookie-parser";
import cors from "cors"
config({
    path: "./Config/config.env",
});

const app = express();

//  using Middlewares
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET','POST','PUT','DELETE'],
}))

import manga from "./Routes/mangaRoutes.js";
import user from "./Routes/userRoutes.js";
import payment from "./Routes/paymentRoutes.js";
import other from "./Routes/otherRoutes.js";

app.use("/api/v1", manga);
app.use("/api/v1", user);
app.use("/api/v1", payment);
app.use("/api/v1", other);

export default app;
app.get("/", (req,res) =>
    res.send(`<h1>Site is Working. Click <a href=${process.env.FRONTEND_URL}>here</a> to visit frontend.</h1>`      
    )
);

app.use(ErrorMiddleware)