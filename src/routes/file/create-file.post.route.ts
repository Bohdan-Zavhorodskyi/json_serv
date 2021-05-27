import { exec } from "child_process";
import { Request, Response } from "express";
import path from "path";

import { validateJSON } from '../../helpers/validation';
import { removeFile } from "../../helpers/fileService";

export const createFile = async (req: Request, res: Response) => {
  let sampleFile: any;
  let uploadPath: string;
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    sampleFile = req.files.test;
    uploadPath = path.resolve(__dirname + '/uploads/' + sampleFile.name);

    const bufferFile = sampleFile.data.toString();
    const jsonFile = JSON.stringify(bufferFile);
    await validateJSON(res, jsonFile);

    sampleFile.mv(uploadPath);

    const cmd = `cd ../ && docker-compose run ansible ansible-playbook -i inventory.ini playbooks/infra_full.yml - e "uploads/${sampleFile}" --tags "sometag"`;

    const executionCommand = exec(cmd);

    executionCommand.on('exit', (code) => {
      if (code === 1) {
        removeFile(uploadPath);
        throw new Error('Something went wrong on the command execution');
      }

      return res.status(200).send('File uploaded to ' + uploadPath);
    });
  } catch (error) {

    return res.status(500).send({ message: error.message })
  }
};
