let loginEvent = function(event) {
    // log('点击了登录按钮')
    let username = e('.username').value
    let password = e('.password').value
    let inputForm = {
        username: username,
        password: password,
    }

    // log('form', inputForm)
    apiBlogLogin(inputForm, function(data){
        let form = JSON.parse(data)
        let status = form.status
        if (status) {
            // log('登录成功')
            alert('登录成功')
            let redirect = function(url=form.location) {
                location.href = url
            }
            setTimeout(redirect, 2000)
        } else {
            alert('登录失败, 用户名或密码错误')
        }
    })
}

let login = function() {
    let loginButton = e('.login-button')
    bindClickEvent(loginButton, loginEvent)
}

let main = function() {
    login()
}

main()
