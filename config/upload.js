var multipart = require('connect-multiparty');
var User  = require('../app/models/user.server.model');
var fs = require('fs');
var config = require('./config');

module.exports  = function(app){
    app.post('/upload', multipart(), function (req, res) {
        var id = req.session.user._id;
        var files = req.files.upload;//文件请求
        var path = config.uploadPath + id;//存放路径
        var url = config.uploadUrl + id;//相对路径
        var filename = files.originalFilename;
        var suffix = filename.substring(filename.lastIndexOf("."), filename.length);
        var newFilename = getDate() + suffix;
        var targetPath = path + '/' + newFilename;
        var newPath = url + '/' + newFilename;

        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        fs.createReadStream(files.path).pipe(fs.createWriteStream(targetPath));//将文件从临时文件已到文件夹
        req.session.user.portrait = newPath;
        //将图片路径存到数据库
        User.update({_id:id},{$set:{portrait:newPath}},function(err){
            res.json({code: 1, path: newPath});
        });

    });
};
function getDate() {
    var myDate = new Date();
    var year = myDate.getFullYear().toString();
    var month = myDate.getMonth().toString();
    var date = myDate.getDate().toString();
    var hours = myDate.getHours().toString();
    var minutes = myDate.getMinutes().toString();
    var milliseconds = myDate.getMilliseconds().toString();
    return year + month + date + hours + minutes + milliseconds;
}
