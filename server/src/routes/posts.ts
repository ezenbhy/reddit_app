import { Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";

import Post from "../entities/Post";
import Sub from "../entities/Sub";

import Comment from "../entities/Comment";



const createPost = async (req: Request, res: Response) => {
    const { title, body, sub } = req.body; //post로 전달한 값
    if (title.trim() === "") {
      return res.status(400).json({ title: "제목은 비워둘 수 없습니다." });
    }
  
    const user = res.locals.user;
  
    try {
      const subRecord = await Sub.findOneByOrFail({ name: sub });
      const post = new Post();
      post.title = title;
      post.body = body;
      post.user = user;
      post.sub = subRecord;
  
      await post.save();
  
      return res.json(post);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "문제가 발생했습니다." });
    }
  };

  const getPost = async (req: Request, res: Response) => {
    const { identifier, slug } = req.params;//전달한 param 값
    try {
      const post = await Post.findOneOrFail({
        where: { identifier, slug },
        relations: ["sub", "votes"],
      });
  
      if (res.locals.user) {
        post.setUserVote(res.locals.user);
      }
  
      return res.send(post);
    } catch (error) {
      console.log(error);
      return res.status(404).json({ error: "게시물을 찾을 수 없습니다." });
    }
  };
  
  const createPostComment = async (req: Request, res: Response) => {
    const { identifier, slug } = req.params;
    const body = req.body.body;
    try {
      const post = await Post.findOneByOrFail({ identifier, slug });
      const comment = new Comment();
      comment.body = body;
      comment.user = res.locals.user;
      comment.post = post;
  
      if (res.locals.user) {
        post.setUserVote(res.locals.user);
      }
  
      await comment.save();
      return res.json(comment);
    } catch (error) {
      console.log(error);
      return res.status(404).json({ error: "게시물을 찾을 수 없습니다." });
    }
  };

  const getPostComments = async (req: Request, res: Response) => {
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
  const { identifier, slug } = req.params;
  try {
    const post = await Post.findOneByOrFail({ identifier, slug });
    const comments = await Comment.find({
      where: { postId: post.id },
      order: { createdAt: "DESC" },
      relations: ["votes"],
    });
    if (res.locals.user) {
      comments.forEach((c) => c.setUserVote(res.locals.user));
    }
    return res.json(comments);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

const getPosts = async(req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const perPage: number = (req.query.count || 3) as number;

  try {
    const posts = await Post.find({
      order: {createdAt: "DESC"},
      relations: ["sub", "votes", "comments"],
      skip: currentPage * perPage,
      take: perPage
    })

    if(res.locals.user) {
      posts.forEach(p => p.setUserVote(res.locals.user)); 
    }

    return res.json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생했습니다."});
  }
}



const router = Router();
router.post("/", userMiddleware, authMiddleware, createPost);

router.get("/:identifier/:slug", userMiddleware, getPost);

router.post("/:identifier/:slug/comments", userMiddleware, createPostComment);
router.get("/:identifier/:slug/comments", userMiddleware, getPostComments);

router.get("/", userMiddleware, getPosts);
//get 같은 경우 URL에 parameter를 함께 보내 요청하지만, 
//post는 request body에 parameter를 보내서 정보를 추출해야 한다.
//미들웨어란 클라이언트에서 req(요청),res(응답) 사이 중간(미들)에 위치하는 함수로, 요청과 응답 사이클에서 중간에 거쳐가는 함수들
export default router;