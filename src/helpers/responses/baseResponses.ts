import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export const successResponse = (
  res: Response,
  httpCode: StatusCodes = StatusCodes.OK,
  data = {}
) => {
  const dataObject = typeof data === "object" ? data : { message: data };

  res.status(httpCode).send(dataObject);
};

export const failResponse = (
  res: Response,
  httpCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR,
  data = {}
) => {
  // can be improved with custom error code exceptions
  const dataObject = typeof data === "object" ? data : { message: data };

  res.status(httpCode).send(dataObject);
};
