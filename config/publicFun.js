module.exports  = {
    systemInfo : function(param){
        var systemInfo = {};
        for(var i=0;i<param.length;i++){
            systemInfo[param[i].item] = param[i].value;
        }
        return systemInfo;
    }
};
