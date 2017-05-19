angular.module('webapp')
    .factory('socket',function(){
      return {
        socket : io(),
        onMessage : function(){
          this.socket.on('message',function(data){
            var message = $("#message").clone(true);
            message.show();
            message.appendTo($(".other-content"))
          });
        },
        emitMessage : function(content){
          this.socket.emit('message',content);
        }
      }
    })
    .controller('LiveController', ['$scope','socket',LiveController]);

function LiveController($scope,socket) {

  $scope.operate = function(){
    $.modal({
      title:  '评论',
      verticalButtons: true,
      extraClass: "modal-style",
      buttons: [
        {
          text: '私聊',
          onClick: function() {
            $.popup('.popup-private-chat');
          }
        },
        {
          text: '禁言',
          onClick: function() {

          }
        },
        {
          text: '取消',
          close: true
        }
      ],
    })
  };
}
