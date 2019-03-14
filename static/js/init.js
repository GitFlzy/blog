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

var ajaxPut = function(path, callback) {
    ajax('PUT', path, '', callback)
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

var apiCommentAgree = function(commentId, callback) {
    var path = '/api/blog/comment/agree/' + commentId
    ajaxPut(path, callback)
}

var leftColTemplate = function() {
    var t = `
        <div class="overlay" style="background: #4d4d4d"></div>
        <div class="intrude-less">
            <header id="header" class="inner">
                <a href="/" class="profilepic">
                    <img src="/assets/blogImg/litten.png" class="js-avatar">
                </a>
                <hgroup>
                    <h1 class="header-author"><a href="/">Litten</a></h1>
                </hgroup>

                <p class="header-subtitle">付出 xx 不一定就能得到 yy</p>

                <nav class="header-menu">
                    <ul>
                        <li><a href="/">主页</a></li>
                        <li><a href="/classfication">分类</a></li>
                    </ul>
                </nav>
                <nav class="header-smart-menu">


                    <a q-on="click: openSlider(e, 'innerArchive')" href="javascript:void(0)">所有文章</a>

                </nav>
                <nav class="header-nav">
                    <div class="social">
                        <a class="github" target="_blank" href="https://www.github.com" title="github"><i class="icon-github"></i></a>
                    </div>
                </nav>
            </header>
        </div>
    `
    return t
}

var loadLeftColumn = function() {
    var leftCol = leftColTemplate()
    var header = e('.left-col')
    header.insertAdjacentHTML('afterbegin', leftCol)
}
