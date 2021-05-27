import Router, { Request, Response } from "express";

import { healthCheck } from "./health-check.get.route";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  healthCheck(req, res);
});

export default router;
