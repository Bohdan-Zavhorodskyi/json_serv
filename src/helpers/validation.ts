import { Response } from "express";
import StatusCodes from "http-status-codes";

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

    const objectValues = Object.values(parsedJson);
    const objectKeys = Object.keys(parsedJson);

    await Promise.all(
      requiredFields.map((item) => {
        if (!objectKeys.includes(item)) {
          throw new Error(`The next field is required in object => ${item}`);
        }
      })
    );

    await Promise.all(
      objectValues.map((value) => {
        if (value < minLength || typeof value !== defaultValueType) {
          throw new Error(
            `The next field is not passed validation should be min_length: ${minLength}`
          );
        }
      })
    );
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).send({ message: error.message });
  }
};
