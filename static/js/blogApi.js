const ajax = function(method, url, data, responseCallBack) {
    let xmlHttp = new XMLHttpRequest()
    xmlHttp.open(method, url, true)
    xmlHttp.setRequestHeader('Content-Type', 'application/json')
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4) {
            responseCallBack(xmlHttp.response)
        }
    }
    data = JSON.stringify(data)
    xmlHttp.send(data)
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

function apiAllBlogs(callback) {
    const path = '/api/blog/all'
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

let apiBlogDelete = function(blogId, callback) {
    let path = `/api/blog/delete/${blogId}`
    // console.log('delete callback', callback)
    ajaxDelete(path, callback)
}

const apiBlogAbout = function(callback) {
    let path = '/about'
    ajaxGet(path, callback)
}