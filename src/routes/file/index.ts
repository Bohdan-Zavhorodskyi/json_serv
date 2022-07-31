import Router, { Request, Response } from "express";
import { checkFile } from "./check-file.post.route";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  checkFile(req, res);
});

export default router;
