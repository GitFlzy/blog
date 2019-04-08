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
                    <h1 class="header-author"><a href="/">${name}</a></h1>
                </hgroup>
                <p class="header-subtitle">${subtitle}</p>
                <nav class="header-nav">
                    <div class="social">
                        <a class="github" target="_blank" href="https://github.com/GitFlzy" title="github"><i class="icon-github"></i></a>
                    </div>
                </nav>
                <nav class="header-menu">
                    <ul>
                        <li><a href="/">主页</a></li>
                    </ul>
                </nav>
            </header>
        </div>
    `
    return t
}

var loadProfile = function() {
    apiUserProfile(function(r){
        var user = JSON.parse(r)
        var profile = navTemplate(user)
        var leftCol = document.querySelector('.left-col')
        // log('header before insert', header)
        leftCol.insertAdjacentHTML('beforeend', profile)
    })
}
