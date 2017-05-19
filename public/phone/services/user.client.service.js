angular.module('webapp')
    .service("UserService", ["$http", "$q", UserService])

function UserService($http, $q) {
  function handleRequest(method, url, data) {
    var defered = $q.defer();
    var config = {
      method: method,
      url: url
    };

    if("POST" === method) {
      config.data = data
    } else if('GET' === method) {
      config.params = data;
    }

    $http(config).success(function(data){
      defered.resolve(data);
    }).error(function(err){
      defered.reject(err);
    });

    return defered.promise;
  }
  return {
    login: function(data){
      return handleRequest('POST', '/', data);
    },
    save : function(data){
      return handleRequest('POST', '/user', data);
    },
    logout : function(){
      return handleRequest('POST', '/logout');
    },
    sendSMS : function(data){
      var username = "szsyd";
      var password_md5 = "4e348b7f9a7dd9f72bf40f5ad366b2e2";
      var apikey = "bbc64e817627e35089fe12d85391f9b2";
      var mobile = data.phone;
      var content = "您正在注册微交易直播课堂，验证码 ："+data.code+"，请您在5分钟内完成验证，勿将验证码泄露给他人。";
      var url = 'http://m.5c.com.cn/api/send/index.php?username='+username+'&password_md5='+password_md5+'&apikey='+apikey+'&mobile='+mobile+'&content='+content+'&encode=utf8';

      return $http.jsonp(url);
    }
  }
}
