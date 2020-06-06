var baseUrlCon = {
    baseAPI: "https://api.xfunction.cn/",
};
/*
        (function($) {…})(jQuery); 匿名函数
        相当于
            funtion output(s){…};
            output(jQuery);
        或者
            var fn=function(s){…};
            fn(jQuery);

    $(function(){…});
相当于
    $(document).ready(function(){ … });
*/

(function($) {
    //序列化表单字段为json对象
    $.fn.serializeFormToJson = function() {
        var arr = $(this).serializeArray(); //form表单数据 name：value
        var param = {};
        $.each(arr, function() {
            if (param[this.name] !== undefined) {
                if (!param[this.name].push) {
                    param[this.name] = [param[this.name]];
                }
                param[this.name].push(this.value);
            } else {
                param[this.name] = this.value;
            }
        });
        return param;
    };

    $.fn.fillForm = function(data) {
        var $form = $(this);
        $.each(data, function(key, value) {
            if ($form.find('[name="' + key + '"]').attr('type') == 'radio') {
                $form.find('[name="' + key + '"][value="' + value + '"]').prop('checked', true);
            } else if (typeof(value) === "boolean") {
                $form.find("[name='" + key + "']").val(value + 0);
            } else {
                $form.find("[name='" + key + "']").val(value);
            }
        })
    }

})(jQuery);

$(function() {
    //jQuery.ajaxSetup({//方法设置全局 AJAX 默认选项。
    $.ajaxSetup({
        //async: true, // 默认为true 
        //cache: true, // 默认为true
        beforeSend: function(xhr) {
            console.log("beforeSend");
            $("#progressBar").removeClass("d-none");
        }, //发送请求前可修改 XMLHttpRequest 对象的函数，如添加自定义 HTTP 头。
        //context: this,  // 用于设置 Ajax 相关回调函数的上下文
        //dataFilter: function(data, type) {},               
        global: true, // 默认为true 是否触发全局 AJAX 事件。默认值: true。设置为 false 将不会触发全局 AJAX 事件，如 ajaxStart 或 ajaxStop 可用于控制不同的 Ajax 事件。
        //ifModified: false, // 是否仅在最后一次请求以来响应发生改变时才请求成功。默认是 false
        //jsonp: "", // 重写回调函数的字符串
        //jsonpCallback: "", //回调函数的名称
        //username: "",
        //password: "",
        //processData: true, // 规定通过请求发送的数据是否转换为查询字符串。默认是 true。
        //scriptCharset: , // 	规定请求的字符集。
        //timeout: ///设置本地的请求超时时间（以毫秒计）
        //traditional: // 布尔值，规定是否使用参数序列化的传统样式。
        //xhr:
        type: "post",
        contentType: 'application/json', // 默认是："application/x-www-form-urlencoded"
        dataType: 'json',
        /// API侧 仅授权会主动抛出 501 服务器代码，其它不会主动抛出服务器错误，而是走 200 中的 业务代码
        error: function(xhr, status, error) {
            if (xhr.readyState == 4) {
                switch (xhr.status) {
                    case 501: // 业务错误
                        if (xhr.responseJSON.code == '4000' || xhr.responseJSON.code == '4001') {
                            // 未授权，请登录
                        } else {
                            toastr.error(xhr.responseJSON.code + ":" + xhr.responseJSON.msg + " " + (xhr.responseJSON.errorMsg ? xhr.responseJSON.errorMsg : ""));
                        }
                        break;
                    default: // 服务器错误                        
                        alert(xhr.responseText); // 直接弹出 
                        break;
                }
            } else {
                toastr.error('网络错误，请检查网络');
            }
        },
        complete: function(xhr, status) { // 只用于打印日志
            $("#progressBar").addClass("d-none");

            // 以下JS原生写法，去除所有form的合法性校验
            var forms = document.getElementsByClassName('needs-validation');
            Array.prototype.filter.call(forms, function(form) {
                form.classList.remove('was-validated');
            });

            console.log("ajax:" + this.url);
            console.log("   data:" + this.data);
            console.log(xhr);
            console.log(status);
        },
    });


    toastr.options = {
        "animation": true,
        "autohide": true,
        "delay": 500,


        "closeButton": true, // true/false
        "debug": false, // true/false
        "newestOnTop": false, // true/false
        "progressBar": true, // true/false
        "positionClass": "md-toast-bottom-center", // md-toast-top-right / md-toast-top-left / md-toast-bottom-right /  md-toast-bottom-left
        "preventDuplicates": false, // true/false
        "onclick": null,
        "showDuration": "300", // in milliseconds
        "hideDuration": "1000", // in milliseconds
        "timeOut": "5000", // in milliseconds
        "extendedTimeOut": "1000", // in milliseconds
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
});


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

function getUrlParam(param) {
    var paras = param;
    var url = document.location.href;
    url = url.replace(/prmt/g, "&");
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = {};
    for (var i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("="))] = j.substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[paras];
    if (typeof(returnValue) == "undefined") {
        return "";
    } else {
        return returnValue;
    };
}

function checkUrl(url) {
    if (isEmptyOrNull(url)) return false;
    url = url.toLowerCase();
    var reg = /^(http:\/\/|https:\/\/)(.)+$/;
    if (!reg.test(url)) {
        return false;
    } else {
        return true;
    }
}

function checkOurUrl(url) {
    url = url.toLowerCase();
    if (url.indexOf("xfu.biz") == -1 && url.indexOf("xfunction.cn") == -1) {
        return true;
    } else {
        return false;
    }
}


function isEmpty(str) {
    if (str === '' || str === undefined || str == null) {
        return true;
    } else {
        return false;
    }
}


function getUserAvatar() {
    var userInfo = window.localStorage.getItem("userInfo");
    if (isEmpty(userInfo)) {
        return null;
    } else {
        return JSON.parse(userInfo).userAvatar;
    }
}

function logout() {
    window.localStorage.removeItem("userInfo");
    window.location.href = "index.html";
}