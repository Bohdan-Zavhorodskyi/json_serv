import Router, { Request, Response } from "express";
import { createFile } from "./create-file.post.route";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  createFile(req, res);
});

export default router;
