angular.module('webapp')
    .controller('UserController', ['$scope','$timeout', 'UserService', UserController])
    .controller('UserSetController', ['$scope','$location','UserService', UserSetController]);

function UserController($scope,$timeout, UserService) {
  $scope.val = "获取验证码";


  //验证表单
  $scope.login = function(){
    if(isPhone()) return;
    if(isCheckCode()) return;
    if($scope.checkCode != $scope.sendCode){
      $.toast("验证码错误");
      return;
    }
    $.showIndicator();
    var data = {
      id : $scope.id,
      phone : $scope.phone,
      wx:$scope.wx
    };
    UserService.login(data).then(
        function(data){
          if(data.error === 1){
            $.toast("登录失败");
          }else{
            window.location.href = data.url;
          }
          $.hideIndicator();
        },
        function(err){}
    );
  };
  $scope.getCheckCode = function(){
    if(isPhone()) return;
    $scope.disabled = true;
    $scope.ing = "ing";

    var i = 59;
    var clear = $timeout(count,1000);

    function count(){
      i--;
      $scope.val = "重发"+i+"s";
      var clear = $timeout(count,1000);
      if(i == 0){
        $scope.disabled = false;
        $scope.ing = "";
        $scope.val = "获取验证码";
        $timeout.cancel(clear);
      }

    }

    var data = {
      phone : $scope.phone,
      code : MathRand()
    };

    $scope.sendCode = data.code;
    

    //发送短信
    //UserService.sendSMS(data);
    alert(data.code)
  };

  //验证手机号码
  function isPhone(){
    if($scope.phone === undefined || $scope.phone === "" ){
      $.toast("请输入手机号码");
      return true;
    }else{
      var reg = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i ;
      if(!reg.test($scope.phone) ){
        $.toast("手机号码格式错误");
        return true;
      }
    }
  }
  //验证码验证
  function isCheckCode(){
    if($scope.checkCode === undefined || $scope.checkCode === "" ){
      $.toast("请输入验证码");
      return true;
    }
  }
}

function UserSetController($scope,$location,UserService,UserSetController){
  var userInfo = JSON.parse($("#userInfo").val());
  var name = userInfo.name;
  var region = userInfo.region;

  $scope.user = userInfo;
  $scope.logout = function(){
    UserService.logout().then(
        function(data){
          if(data.core == "1"){
            $.router.load("/");
          }
        }
    );
  };
  $scope.submit = function(){
    if($scope.user.name == "" || $scope.user.name == undefined){
      $scope.user.name = name;
    }

    if($scope.user.email != null){
      var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      if(!reg.test($scope.user.email) ){
        $.toast("邮箱格式错误");
        return true;
      }
    }
    $.showIndicator();
    $scope.user.region = $("#city-picker").val();
    UserService.save($scope.user).then(
        function(data){
          if(data.core == "1"){
            $.toast("修改成功");
            $scope.user = data.data;
            $(".xm").find("a").text(data.data.name);
            $(".tx").attr("src",data.data.portrait);
          }else{
            $.toast("修改失败");
          }
          $.hideIndicator();
        }
    );
  };
}

//随机6位数字验证码
function MathRand() {
  var Num = "";
  for (var i = 0; i < 6; i++) {
    Num += Math.floor(Math.random() * 10);
  }
  return Num;
}