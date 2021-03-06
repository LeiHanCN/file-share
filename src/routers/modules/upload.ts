import Express from 'express';
import path from 'path';
import fs from 'fs';
import { getCommonLogString } from '../../utils/log';
import { filePath, forceMode, writeMode } from '../../config';
import { toAutoUnit } from '../../utils/number';

export default async (req: Express.Request, res: Express.Response) => {
  if (!req.files) {
    res.statusCode = 400;
    return res.end();
  }
  if (!writeMode) {
    res.statusCode = 403;
    return res.end();
  }
  const basePath = path.join(filePath, req.path.replace(/(\/upload|..\/)/, ''));
  // 检查是否可写
  try {
    fs.accessSync(basePath, fs.constants.W_OK);
  } catch (e) {
    console.error(getCommonLogString(req.ip), `上传失败：【${basePath}】`, e.message);
    res.statusCode = 403;
    return res.end();
  }
  const uploadList = Array.isArray(req.files.fileList) ? req.files.fileList : [req.files.fileList];
  // 处理所有文件
  for (const file of uploadList) {
    const fileDist = path.join(basePath, file.name);
    // 检查文件状态
    try {

      const fileState = fs.statSync(fileDist);
      if (fileState.isFile() && !forceMode) {
        // 文件存在且未开放写入
        console.error(getCommonLogString(req.ip), `上传文件失败:【${fileDist}】，文件已存在，且非强制写入模式（-wf）。`);
        res.statusCode = 403;
        return res.end();
      }
    } catch (e) {
      file.mv(fileDist);
      console.log(getCommonLogString(req.ip), `上传文件(${file.mimetype}):【${fileDist}】(${toAutoUnit(file.size)}B)`);
    }
  }

  // success
  res.statusCode = 201;
  return res.end();
}