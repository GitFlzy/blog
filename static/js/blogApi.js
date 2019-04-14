let ajax = function(method, path, data, responseCallback) {
    let r = new XMLHttpRequest()
    // 设置请求方法和请求地址
    r.open(method, path, true)
    r.setRequestHeader('Content-Type', 'application/json')
    r.onreadystatechange = function() {
        if(r.readyState === 4) {
            responseCallback(r.response)
        }
    }
    // 把数据转换为 json 格式字符串
    data = JSON.stringify(data)
    r.send(data)
}

let ajaxGet = function(path, callback) {
    ajax('GET', path, '', callback)
}

let ajaxPost = function(path, data, callback) {
    ajax('POST', path, data, callback)
}

let ajaxDelete = function(path, callback) {
    ajax('DELETE', path, '', callback)
}

let ajaxPut = function(path, data, callback) {
    ajax('PUT', path, data, callback)
}

let apiBlogAll = function(callback) {
    let path = '/api/blog/all'
    ajaxGet(path, callback)
}

let apiUserProfile = function(callback) {
    let path = '/api/blog/user/profile'
    ajaxGet(path, callback)
}

let apiBlogById = function(blogId, callback) {
    let path =`/api/blog/${blogId}`
    ajaxGet(path, callback)
}

let apiAllBlogsAbstract = function(callback) {
    let path = '/api/blog/all/abstract'
    ajaxGet(path, callback)
}

let apiBlogLogin = function(form, callback) {
    let path = '/api/blog/login'
    ajaxPost(path, form, callback)
}
