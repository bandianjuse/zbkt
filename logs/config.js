module.exports = {
  port: 81, //端口
  mongodb: 'mongodb://admin:12345678@localhost/huizhong', //mongodb数据库链接
  redis : {//mongodb数据库链接
    host: '127.0.0.1',
    port: 6379,
    ttl: 1800 // 过期时间
  },
  uploadPath : '/root/huizhong/public/uploads/', //上传图片绝对路径
  uploadUrl : '/uploads/', //上传图片相对路径
  logsPath : 'logs/log.log', //日志存放路径
  //微信配置
  weixin : {
    appid : 'wx9d6eb5f6ecb5b15a',
    appsecret : 'bfb9c0f91fbf0921a50d44df41d31847',
    redirectUrl : 'http://www.mayiweiketang.com/'
  },
  //路由配置
  routes:{
    //前端路由
    phone : {
      user: '../app/routes/user.server.routes',
      live: '../app/routes/live.server.routes',
      playback: '../app/routes/playback.server.routes',
      page: '../app/routes/page.server.routes'
    },
    //后端路由
    admin : {
      admin: '../appAdmin/routes/admin.server.routes',
      system: '../appAdmin/routes/system.server.routes',
      distribution: '../appAdmin/routes/distribution.server.routes',
      register: '../appAdmin/routes/register.server.routes',
      account: '../appAdmin/routes/account.server.routes'
    }
  }
};
