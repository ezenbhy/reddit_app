import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";

//request 요청할때 웹 브라우저가 보낸 정보가 담겨있다.
//response 응답할때 웹 브라우저에 전송할 정보가 담겨있다.
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: User | undefined = res.locals.user;
    //유저 정보가 없다면 throw error
    if (!user) throw new Error("Unauthenticated");

    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Unauthenticated" });
  }
};