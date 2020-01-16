// 导入koa模块
const Koa = require('koa');
const axios = require('axios')

// 创建koa的实例app
const app = new Koa();

function getPhoneNumber(infoId) {
  return new Promise((resolve, reject) => {
    axios.get('https://miniappfang.58.com/shop/api/virtualPhone?infoId=' + infoId).then(res => {
      if (res.data.code === 200) {
        resolve(res.data)
      } else {
        reject(res.data)
      }
    }).catch(err => {
      console.log(err);
      reject(err)
    })
  })
}

app.use(async ctx => {
  console.log(ctx.request.query['info_id']);
  let infoId = parseInt(ctx.request.query['info_id'] || '')
  let result = {}
  if (infoId) {
    try {
      result = await getPhoneNumber(infoId)
    } catch (err) {
      result = err
    }
  }
  ctx.body = result
})

// 监听端口
app.listen(3000, () => {
  console.log("服务器已启动，http://localhost:3000");
})