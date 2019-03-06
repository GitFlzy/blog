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

var messageTemplate = function(message) {
    var t = `
        <div class="account-form-error show-error">
            <span class="fatal-msg hide">${message}</span>
        </div>
    `
    return t
}

var addEventRegister = function() {
    var registerButton = document.querySelector('.register-button')
    registerButton.addEventListener('click', function(event){
        var usernameCell = document.querySelector('#username')
        var passwordCell = document.querySelector('#password')
        var username = usernameCell.value
        var password = passwordCell.value
        var userForm = {
            'username': username,
            'password': password,
        }
        apiUserRegister(userForm, function(r){
            log('后端注册事件结束')
            var statusForm = JSON.parse(r)
            var status = statusForm.status
            var message = statusForm.message
            log('拿到的状态表', statusForm)
            if (status == 'failed') {
                usernameCell.value = ''
                passwordCell.value = ''
                var errorMessage = messageTemplate(message)
                var accountField = document.querySelector('.account-form-field')
                var messageCell = document.querySelector('.account-form-error')
                log('找到的错误信息', messageCell)
                if (messageCell === null) {
                    accountField.insertAdjacentHTML('beforebegin', errorMessage)
                }
            } else {
            // 如果注册成功, 跳转到登录页面, 并且在登录页面上方显示注册成功
                log('注册成功')
                apiRequestLoginRoute(function(r){
                log('返回登录页面')
                var messageCell = document.querySelector('.account-form-error')
                var registerMessage = messageTemplate(message)
                    if (messageCell === null) {
                        accountField.insertAdjacentHTML('beforebegin', registerMessage)
                    }
                })

            }
        })
    })
}


var apiUserRegister = function(form, callback) {
    path = '/register'
    ajax('POST', path, form, callback)
}

var apiRequestLoginRoute = function(callback) {
    path = '/?action=login'
    ajax('GET', path, '', callback)
}

var _main = function() {
    addEventRegister()
}

_main()