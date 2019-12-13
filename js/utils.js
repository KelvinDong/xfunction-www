
function isEmptyOrNull(str) {
	if (typeof(str) == "number") {
		return false;
	} else {
		if (str == null || str == "null" || str == "" || typeof(str) == "undefined")
			return true;
		else
			return false;
	}
};

function getUrlParam(param){
	var paras=param;
    var url = document.location.href;
    url = url.replace(/prmt/g,"&");
	var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");    
    var paraObj = {};
    for (var i = 0; j = paraString[i]; i++) {    
        paraObj[j.substring(0, j.indexOf("="))] = j.substring(j.indexOf("=") + 1, j.length);    
    }    
    var returnValue = paraObj[paras];    
    if (typeof (returnValue) == "undefined") {    
        return "";
    } else {    
        return returnValue;    
    };
}

function checkUrl(url){
	 if(isEmptyOrNull(url)) return false;
	 url = url.toLowerCase();	
	 var reg=/^(http:\/\/|https:\/\/)(.)+$/;
	 if(!reg.test(url)){
		 return false;
	 }
	 else{
		return true;
	 }
}

function checkOurUrl(url){
	url = url.toLowerCase();		
	if(url.indexOf("xfu.biz") == -1 && url.indexOf("xfunction.cn") == -1){
		return true;
	}else{
		return false;
	}
}




