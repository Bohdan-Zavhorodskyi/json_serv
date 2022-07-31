import { Response } from "express";
import StatusCodes from "http-status-codes";

import { failResponse } from "./responses/baseResponses";

interface IJsonFile {
  client_name: string;
  client_camelcase: string;
  db_instance_name: string;
  client_region: string;
  awsaccess_key: string;
  awssecret_key: string;
  db_master_user: string;
}

const requiredFields = [
  "client_name",
  "client_camelcase",
  "db_instance_name",
  "client_region",
  "awsaccess_key",
  "awssecret_key",
  "db_master_user",
];

const minLength = 4;
const defaultValueType = "string";

const parseJSON = (json: string): void | IJsonFile => {
  const parsedJson = JSON.parse(json);

  if (typeof parsedJson !== "object") {
    return parseJSON(parsedJson);
  }

  return parsedJson;
};

export const validateJSON = async (res: Response, json: string) => {
  try {
    const parsedJson = parseJSON(json);

    if (typeof parsedJson !== "object") {
      throw new Error("JSON is not a object.");
    }

    const objectValues = Object.entries(parsedJson);
    const objectKeys = Object.keys(parsedJson);

    const requiredFieldsErrors: string[] = [];
    const validationFieldsErrors: string[] = [];

    requiredFields.map((item) => {
      if (!objectKeys.includes(item)) {
        requiredFieldsErrors.push(`${item} field is required in object`);
      }
    });

    objectValues.map(([key, value]) => {
      if (value < minLength || typeof value !== defaultValueType) {
        validationFieldsErrors.push(
          `field ${key} should be min_length: ${minLength}`
        );
      }
    });

    if (requiredFieldsErrors.length && validationFieldsErrors.length) {
      return failResponse(res, StatusCodes.BAD_REQUEST, {
        requiredFieldsErrors: requiredFieldsErrors.map((item) => item),
        validationErrors: validationFieldsErrors.map((item) => item),
      });
    }

    if (requiredFieldsErrors.length) {
      return failResponse(res, StatusCodes.BAD_REQUEST, {
        requiredFieldsErrors: requiredFieldsErrors.map((item) => item),
      });
    }

    if (validationFieldsErrors.length) {
      return failResponse(res, StatusCodes.BAD_REQUEST, {
        validationErrors: validationFieldsErrors.map((item) => item),
      });
    }
  } catch (error) {
    return failResponse(res, StatusCodes.BAD_REQUEST, {
      message: error.message,
    });
  }
};
