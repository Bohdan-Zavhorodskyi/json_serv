import fs from 'fs-extra';

export const removeFile = (pathname: string) => {
  fs.remove(pathname, (err) => {
    if (err) {
      return false;
    }
    return true;
  });
};
