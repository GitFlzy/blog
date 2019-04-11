let navTemplate = function(user) {
    let avatar = user.avatar
    let subtitle = user.subtitle
    let name = user.username
    let t = `
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
                        <li><div class="homepage link">主页</div></li>
                    </ul>
                </nav>
            </header>
        </div>
    `
    return t
}

let clickHomePage = function() {
    // log('点击了主页按钮')
    loadBlogIndex()
}

let loadProfile = function() {
    apiUserProfile(function(r){
        let user = JSON.parse(r)
        let profile = navTemplate(user)
        let leftCol = e('.left-col')
        leftCol.insertAdjacentHTML('beforeend', profile)
        let homepage = e('.homepage')
        bindClickEvent(homepage, loadBlogIndex)
    })
}
