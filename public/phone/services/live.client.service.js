angular.module('webapp')
  .service("LiveService", ["$http", "$q", LiveService]);


function LiveService($http, $q) {
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
    socket : io(),
    message : [],
    getMessage : function(){
      var message = this.message;
      this.socket.on('message',function(data){
        message.push({
          content : data
        });
      });
      return message;
    },
    sendMessage : function(content){
      this.socket.emit('message',content);
    }
  }
}