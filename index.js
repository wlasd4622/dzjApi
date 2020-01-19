// 导入koa模块
const Koa = require('koa');
const axios = require('axios')
const moment = require('moment')
const fs = require('fs')
// 创建koa的实例app
const app = new Koa();

function getPhoneNumber(infoId = "") {
  return new Promise((resolve, reject) => {
    setTimeout(_ => {
      axios.get('https://miniappfang.58.com/shop/api/virtualPhone?infoId=' + infoId).then(res => {
        if (res.data.code === 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      }).catch(err => {
        reject(err)
      })
    }, parseInt(Math.random() * 30 + 10) * 1000)
  })
}

function getClientIP(req) {
  return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
    req.connection.remoteAddress || // 判断 connection 的远程 IP
    req.socket.remoteAddress || // 判断后端的 socket 的 IP
    req.connection.socket.remoteAddress;
};

app.use(async ctx => {
  if (ctx.req.url.includes('/log')) {
    result = fs.readFileSync('./logs/all-the-logs.log')
    ctx.response.type = 'text/html';
    ctx.response.body = `<div>${result.toString().replace(/\n/g, '</br>')}</dov>`;
  } else {
    // 挂载日志模块
    ctx.util = {
      log: require('./utils/log')
    }
    let result = {}
    ctx.util.log.info('--------------------------------------------');
    try {
      ctx.util.log.info(`${ctx.request.query['info_id']}`);
      let info = getClientIP(ctx.req)
      ctx.util.log.info(`${info}`);
      let infoId = parseInt(ctx.request.query['info_id'] || '')
      if (infoId) {
        try {
          result = await getPhoneNumber(infoId)
        } catch (err) {
          result = err
        }
      }
    } catch (err) {
      ctx.util.log.info(err);
    }
    ctx.util.log.info(`${JSON.stringify(result)}`);
    ctx.util.log.info('--------------------------------------------');
    ctx.body = result
  }
})

// 监听端口
app.listen(3000, () => {
  console.log("服务器已启动，http://localhost:3000");
})


