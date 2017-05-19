module.exports = {
  port: 8088, //端口
  mongodb: 'mongodb://localhost/huizhong', //mongodb数据库链接
  redis : {//redis数据库链接
    host: '127.0.0.1',
    port: 6379,
    ttl: 1800 // 过期时间
  },
  uploadPath : '/root/huizhong/public/uploads/', //上传图片绝对路径
  uploadUrl : '/uploads/', //上传图片相对路径
  logsPath : 'logs/log.log', //日志存放路径
  //微信配置
  weixin : {
    appid : 'wxbe7555e2d3ec2ed2',
    appsecret : '8062cb864dc0186067c987b33a5e4dd7',
    redirectUrl : 'http://hz.tunnel.qydev.com/'
  },
  playbackId : '5715eabc3f2039a4108ba05c', //回放默认播放视频id
  openAccountLink : 'http://wechat1.gdmex.com/register/0122hz/sc/205680#pageSignin',//开户链接
  tradingLink : 'http://wechat1.gdmex.com/wp/0122hz?openid=oVpotuD6ldHJJnoVY5Bt-_F_Kc18&nickname=andy&sex=1&language=zh_CN&city=%E5%B9%BF%E5%B7%9E&province=%E5%B9%BF%E4%B8%9C&country=%E4%B8%AD%E5%9B%BD&headimgurl=http%3A%2F%2Fwx.qlogo.cn%2Fmmopen%2FUg9eTugvLUACicrcj1yPSAdGkXcB51rib5ZKNsOlsMe6zHhBdxZmD2cOuGtM1rezLUJLv3riclbNH0rk8YmO6bN0HXwCYGxDO38%2F0&unionid=oGQYBwWAcl81-kE9sqMLurEgtKbc', //交易链接
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
      account: '../appAdmin/routes/account.server.routes',
      page: '../appAdmin/routes/page.server.routes'
    }
  }
};