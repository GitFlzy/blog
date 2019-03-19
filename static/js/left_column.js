var navTemplate = function(user) {
    var avatar = user.avatar
    var subtitle = user.subtitle
    var name = user.username
    var t = `
        <div class="overlay" style="background: #4d4d4d"></div>
        <div class="intrude-less">
            <header id="header" class="inner">
                <a href="/static/assets/blogImg/${avatar}" class="profilepic">
                    <img src="/static/assets/blogImg/${avatar}" class="js-avatar">
                </a>
                <hgroup>
                    <h1 class="header-author"><a href="/admin/profile">${name}</a></h1>
                </hgroup>

                <p class="header-subtitle">${subtitle}</p>

                <nav class="header-nav">
                    <div class="social">
                        <a class="github" target="_blank" href="https://www.github.com" title="github"><i class="icon-github"></i></a>
                    </div>
                </nav>
                <nav class="header-menu">
                </nav>

            </header>
        </div>
    `
    return t
}

var loadLeftColumn = function(nav) {
    var leftCol = nav
    var header = e('.left-col')
    // log('header before insert', header)
    header.insertAdjacentHTML('afterbegin', leftCol)
    var menu = header.querySelector('.header-menu')
    var t = `
        <ul>
            <li><a href="/">主页</a></li>
        </ul>
    `
    menu.insertAdjacentHTML('afterbegin', t)
}

var loadMobileNav = function(nav) {
    var header = e('#mobile-nav')
    header.insertAdjacentHTML('afterbegin', nav)
    var menu = header.querySelector('.header-menu')
    var t = `
        <ul style="width: 50%">
            <li style="width: 50%"><a href="/">主页</a></li>
        </ul>
    `
    menu.insertAdjacentHTML('afterbegin', t)
}

var loadProfile = function() {
    apiUserProfile(function(r){
        var user = JSON.parse(r)
        var nav = navTemplate(user)
        loadLeftColumn(nav)
        loadMobileNav(nav)
    })
}