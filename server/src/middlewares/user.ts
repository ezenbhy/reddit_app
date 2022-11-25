import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {

//먼저 Sub을 생성할 수 있는 유저인지 체크를 위해 유저 정보 가져오기(요청에서 보내주는 토큰을 이용)
//요청의 쿠키에 담겨있는 토큰을 가져오기
const token = req.cookies.token;
console.log('token', token);

if (!token) return next();

//verify 메소드와 jwt secret을 이용해서 토큰 Decode 디코딩
const { username }: any = jwt.verify(token, process.env.JWT_SECRET);

//토큰에서 나온 유저 이름을 이용해서 유저 정보 데이터베이스에서 가져오기
const user = await User.findOneBy({ username });
console.log('user',user);

//유저 정보가 없다면 throw error
if (!user) throw new Error("Unauthenticated");

// 유저 정보를 res.local.user에 넣어주기
res.locals.user = user;

//유저 정보가 있다면 sub 이름과 제목이 이미 있는 것인지 체크

// Sub Instance 생성 후 데이터베이스에 저장

//저장한 정보 프론트엔드로 전달해주기
return next();
} catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Something went wrong" });
}
};