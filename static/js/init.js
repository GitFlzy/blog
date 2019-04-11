let log = function() {
    console.log.apply(console, arguments)
}

let e = function(selector) {
    return document.querySelector(selector)
}

let es = function(selector) {
    return document.querySelectorAll(selector)
}

let bindEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}

let bindAll = function(selector, eventName, callback) {
    let elements = document.querySelectorAll(selector)
    for(let i = 0; i < elements.length; i++) {
        let e = elements[i]
        bindEvent(e, eventName, callback)
    }
}

let bindClickEvent = function(element, callback) {
    bindEvent(element, 'click', callback)
}

let bindAllClickEvent = function(selector, callback) {
    bindAll(selector, 'click', callback)
}

let findChild = function(element, selector) {
    return element.querySelector(selector)
}

let removeAllChild = function(parent) {
    while (parent.hasChildNodes()) {
        parent.firstChild.remove()
    }
}

let scrollToTop = function() {
    
}

let markedIt = function(text) {
    let md = new Remarkable()
    let marked = md.render(text)
    // log('type of marked', typeof(marked))
    return marked
}

let pushHistory = function(pathName='/', title='') {
    let state = {
        pathName: pathName,
    }
    history.pushState(state, title, pathName)
    if (title != '') {
        document.title = title
    }
}


let ajax = function(method, path, data, responseCallback) {
    let r = new XMLHttpRequest()
    // 设置请求方法和请求地址
    r.open(method, path, true)
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

let apiBlogCommentAdd = function(form, callback) {
    let path = '/api/blog/comment/add'
    ajaxPost(path, form, callback)
}

let apiBlogAll = function(callback) {
    let path = '/api/blog/all'
    ajaxGet(path, callback)
}

let apiCommentsAll = function(blogId, callback) {
    let path = '/api/blog/' + blogId + '/comment/all'
    ajaxGet(path, callback)
}

let apiBlogDelete = function(blogId, callback) {
    let path = '/api/blog/delete/' + blogId
    ajaxDelete(path, callback)
}

let apiUserProfile = function(callback) {
    let path = '/api/blog/user/profile'
    ajaxGet(path, callback)
}

let apiSendChat = function(form, callback) {
    // let roomId = form.roomId
    let path = '/api/blog/chat/room/' + form.room_id + '?action=send'
    ajaxPost(path, form, callback)
}

let apiChatAll = function(callback) {
    let path = '/api/blog/chat/room'
    ajaxGet(path, callback)
}

let apiChatByRoom = function(form, callback) {
    let path = '/api/blog/chat/room/' + form.roomId
    ajaxGet(path, callback)
}

let apiBlogAdd = function(form, callback) {
    let path = '/api/blog/add'
    // log('form 表单为', form, typeof(form))
    ajaxPost(path, form, callback)
}

let apiBlogById = function(blogId, callback) {
    let path =`/api/blog/${blogId}`
    ajaxGet(path, callback)
}

let apiAllBlogAbstract = function(callback) {
    let path = '/api/blog/all/abstract'
    ajaxGet(path, callback)
}