import { Request, Response } from "express";
import StatusCodes from "http-status-codes";

export const healthCheck = async (req: Request, res: Response) => {
  res
    .status(StatusCodes.OK)
    .json({ message: "The server is live", date: new Date() })
    .send();
};
