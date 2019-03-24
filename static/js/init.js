var log = function() {
    console.log.apply(console, arguments)
}

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
    // 发送请求
    r.send(data)
}

var e = function(sel) {
    return document.querySelector(sel)
}

var ajaxGet = function(path, callback) {
    ajax('GET', path, '', callback)
}

var ajaxPost = function(path, data, callback) {
    ajax('POST', path, data, callback)
}

var ajaxDelete = function(path, callback) {
    ajax('DELETE', path, '', callback)
}

var ajaxPut = function(path, data, callback) {
    ajax('PUT', path, data, callback)
}

var apiBlogCommentAdd = function(form, callback) {
    var path = '/api/blog/comment/add'
    ajaxPost(path, form, callback)
}

var apiBlogAll = function(callback) {
    var path = '/api/blog/'
    ajaxGet(path, callback)
}

var apiCommentsAll = function(blogId, callback) {
    var path = '/api/blog/' + blogId + '/comment/all'
    ajaxGet(path, callback)
}

var apiBlogDelete = function(blogId, callback) {
    var path = '/api/blog/delete/' + blogId
    ajaxDelete(path, callback)
}

var apiUserProfile = function(callback) {
    var path = '/api/blog/user/profile'
    ajaxGet(path, callback)
}

var apiSendChat = function(form, callback) {
    // var roomId = form.roomId
    var path = '/api/blog/chat/room/' + form.room_id + '?action=send'
    ajaxPost(path, form, callback)
}

var apiChatAll = function(callback) {
    var path = '/api/blog/chat/room'
    ajaxGet(path, callback)
}

var apiChatByRoom = function(form, callback) {
    var path = '/api/blog/chat/room/' + form.roomId
    ajaxGet(path, callback)
}