import { exec } from "child_process";
import { Request, Response } from "express";
import path from "path";
import fileUpload from "express-fileupload";
import { StatusCodes } from "http-status-codes";

import { validateJSON } from "../../helpers/validation";
import { removeFile } from "../../helpers/fileService";
import {
  failResponse,
  successResponse,
} from "../../helpers/responses/baseResponses";

export const checkFile = async (req: Request, res: Response) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return failResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "No files were uploaded."
      );
    }
    const fileFieldName = Object.keys(req.files)[0];

    const sampleFile = req.files[fileFieldName] as fileUpload.UploadedFile;
    const uploadPath = path.resolve(__dirname + "/uploads/" + sampleFile.name);
    const bufferFileData = sampleFile.data.toString();

    await validateJSON(res, bufferFileData);

    await sampleFile.mv(uploadPath);

    const cmd = `cd ../ && docker-compose run ansible ansible-playbook -i inventory.ini playbooks/infra_full.yml - e "uploads/${sampleFile}" --tags "sometag"`;

    const executionCommand = exec(cmd);

    executionCommand.on("exit", (code) => {
      if (code === 1) {
        removeFile(uploadPath);
        return failResponse(
          res,
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Something went wrong on the command execution"
        );
      }

      return successResponse(
        res,
        StatusCodes.OK,
        "File uploaded to " + uploadPath
      );
    });
  } catch (error) {
    return failResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};
