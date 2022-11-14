import express from "express";
import morgan from "morgan";
import { AppDataSource } from "./data-source" //
import authRoutes from './routes/auth';
import subRoutes from './routes/subs';

import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

import postRoutes from './routes/posts';

import voteRoutes from './routes/votes';

import userRoutes from './routes/users';

const app = express();

// const origin = process.env.ORIGIN;
const origin = "http://localhost:3000";

app.use(
    cors({
    origin,
    credentials: true
}))

app.use(express.json());//json으로 이루어진 request body를 받을 경우 사용
app.use(morgan('dev'));//요청과 응답에 대한 정보를 콘솔에 기록
app.use(cookieParser());//요청된 쿠키를 쉽게 추출할 수 있도록 도와주는 미들웨어
dotenv.config();

app.get("/", (_, res) => res.send("running"));
app.use("/api/auth", authRoutes) // app.use("url", 함수) url이 들어오면 함수실행한다.
app.use("/api/subs", subRoutes)


app.use(express.static("public"));//public 폴더 안에 데이터들 사용

app.use("/api/posts", postRoutes)

app.use("/api/votes", voteRoutes)

app.use("/api/users", userRoutes)

let port = 4000;

app.listen(port, async () => { 
    console.log(`server running at http://localhost:${port}`);

    //4000포트로 서버 오픈
    AppDataSource.initialize().then(() => {
        console.log("database initialized")
    }).catch(error => console.log(error))
});    