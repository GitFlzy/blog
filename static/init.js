var log = function() {
    console.log.apply(console, arguments)
}

/*
 ajax 函数
*/
var ajax = function(method, path, data, responseCallback) {
    var r = new XMLHttpRequest()
    // 设置请求方法和请求地址
    r.open(method, path, true)
    // 设置发送的数据的格式为 application/json
    // 这个不是必须的
    r.setRequestHeader('Content-Type', 'application/json')
    // 注册响应函数
    r.onreadystatechange = function() {
        if(r.readyState === 4) {
            // r.response 存的就是服务器发过来的放在 HTTP BODY 中的数据
            responseCallback(r.response)
        }
    }
    // 把数据转换为 json 格式字符串
    data = JSON.stringify(data)
    log('前端 ajax 数据', data)
    // 发送请求
    r.send(data)
}

var e = function(sel) {
    return document.querySelector(sel)
}

var apiBlogCommentAdd = function(form, callback) {
    var path = '/api/blog/comment/add'
    ajax('POST', path, form, callback)
}

var apiBlogAll = function(callback) {
    var path = '/api/blog/'
    ajax('GET', path, '', callback)
}
