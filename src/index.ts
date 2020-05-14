import Express from 'express';
import stylus from 'stylus';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import os from 'os';
import chalk from 'chalk';
import fileUpload from 'express-fileupload';
import ncp from 'ncp'
import routes from './routes';
import { exportPort, filePath, PUBLIC_PATH, publicResourceList, shareDir, VIEW_PATH } from './config';
import { getCommonLogString } from './utils/log';
import { resolve } from 'path';

const app = Express();

// copy js
ncp(resolve('./views/js/'), resolve('./public/js/'), err => {
    if (err) {
        console.error(err);
        return
    }
    console.log('完成 JS 文件复制')
})

// network
const ips = os.networkInterfaces();
const avaliableIpv4 = Object.values(ips)
  .map(item => item.filter(item => item.family === 'IPv4' && !item.internal)) // 只输出外网地址
  .reduce((acc, item) => acc.concat(item), []);
const addressStr = avaliableIpv4.map(({ address }) => `http://${address}:${exportPort}`).join('\n\t\t');
console.log('分享地址为：', `\t${addressStr}`);
console.log('分享目录为：', `\t${filePath}（${shareDir ? '' : '不'}含文件夹）`);

// view engine setup
app.set('views', VIEW_PATH);
app.set('view engine', 'pug');

// middlewares
app.use(morgan(
  (tokens, req, res) => {
    const { ip, method, path } = req;
    const { statusCode } = res;
    const stateStr = (statusCode < 400 ? chalk.green : chalk.red)(`${statusCode}-${method}`);
    return `${getCommonLogString(ip)} ${stateStr} ${path} `;
  },
  {
    skip: (req) => (
      publicResourceList.some(item => (req.url === item)) // 静态资源
      || req.res?.getHeader('Content-Type') === 'application/octet-stream' // 下载的文件
    ),
  },
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware({
  src: VIEW_PATH,
  dest: PUBLIC_PATH,
  compress: true,
}));
app.use(Express.static(PUBLIC_PATH));
app.use(fileUpload({
    createParentPath: true
}))

// pages
app.use('/', routes);

app.listen(exportPort);
