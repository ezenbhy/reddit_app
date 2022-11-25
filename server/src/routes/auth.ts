import { Request, Response, Router } from "express";
import { User } from "../entities/User";
import { isEmpty, validate } from "class-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";

import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";

const me = async (_: Request, res: Response) => {
  return res.json(res.locals.user);
};

const mapError = (errors: Object[]) => {
    return errors.reduce((prev: any, err: any) => {
      prev[err.property] = Object.entries(err.constraints)[0][1];
      console.log('Object.entries(err.constraints)',Object.entries(err.constraints))
      console.log('prev',prev);
      return prev;
    }, {});
  };

const register = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;//register컴포넌트에서 보낸거 받기
    console.log(email, username, password);

    try {
        let errors: any = {};
    
        // 이메일과 유저이름이 이미 저장 사용되고 있는 것인지 확인.
        const emailUser = await User.findOneBy({ email });
        const usernameUser = await User.findOneBy({ username });
    
        // 이미 있다면 errors 객체에 넣어줌.
        if (emailUser) errors.email = "이미 해당 이메일 주소가 사용되었습니다.";
        if (usernameUser) errors.username = "이미 이 사용자 이름이 사용되었습니다.";
    
        // 에러가 있다면 return으로 에러를 response 보내줌.
        if (Object.keys(errors).length > 0) {
          return res.status(400).json(errors);
        }
        
        const user = new User();
        user.email = email;
        user.username = username;
        user.password = password;
    
        // 엔티티에 정해 놓은 조건으로 user 데이터의 유효성 검사를 해줌.
        errors = await validate(user); //동일한 값으로 회원가입 하면 에러
        console.log('errors',errors)
    
        if (errors.length > 0) return res.status(400).json(mapError(errors));
    
        // 유저 정보를 user table에 저장.
        await user.save();
        return res.json(user);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error });
      }
}

const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
      let errors: any = {};
      // 비워져있다면 에러를 프론트엔드로 보내주기
      if (isEmpty(username)) errors.username = "사용자 이름은 비워둘 수 없습니다.";
      if (isEmpty(password)) errors.password = "비밀번호는 비워둘 수 없습니다.";
      if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
      }
  
      // 디비에서 유저 찾기
      const user = await User.findOneBy({ username });
  
      if (!user)
        return res
          .status(404)
          .json({ username: "사용자 이름이 등록되지 않았습니다." });
  
      // 유저가 있다면 비밀번호 비교하기
      const passwordMatches = await bcrypt.compare(password, user.password);
  
      // 비밀번호가 다르다면 에러 보내기
      if (!passwordMatches) {
        return res.status(401).json({ password: "비밀번호가 잘못되었습니다." });
      }
  
      // 비밀번호가 맞다면 토큰 생성
      const token = jwt.sign({ username }, process.env.JWT_SECRET);
  
      // 쿠키저장- 웹 브라우저와 웹 서버가 주고 받는 정보
      res.set(
        "Set-Cookie",
        cookie.serialize("token", token, {
          httpOnly: true, //보안관련내용,자바스크립트(클라이언트)는 쿠키값을 가져올수 없게 하는 옵션
          maxAge: 60 * 60 * 24 * 7, //쿠키 만료 시간
          path: "/", //해당 디레터리와 하위 디렉터리에서만 쿠키가 활성화 됨
        })
      );
  
      return res.json({ user, token });
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  };
  
  const logout = async (_: Request, res: Response) => {
    res.set(
      "Set-Cookie",
      cookie.serialize("token", "", { //cookie의 이름,값,옵션을 Set-Cookie 헤더의 문자열로 직렬화한다.
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", //https 에서만 쿠키사용
        sameSite: "strict",//엄격한 모드로 동일한 사이트만 접근할 수 있도록 설정
        expires: new Date(0), //만료일0 즉시 바로 기간 만료 시킴
        path: "/",
      })
    );
    res.status(200).json({ success: true });
  };

const router = Router(); //router객체

router.get("/me", userMiddleware, authMiddleware, me);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", userMiddleware, authMiddleware, logout);
//미들웨어란 클라이언트에서 req(요청),res(응답) 사이 중간(미들)에 위치하는 함수로, 요청과 응답 사이클에서 중간에 거쳐가는 함수들
export default router;