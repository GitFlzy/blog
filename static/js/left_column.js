var leftColTemplate = function() {
    var t = `
        <div class="overlay" style="background: #4d4d4d"></div>
        <div class="intrude-less">
            <header id="header" class="inner">
                <a href="/" class="profilepic">
                    <img src="/static/assets/blogImg/cute.png" class="js-avatar">
                </a>
                <hgroup>
                    <h1 class="header-author"><a href="/">username</a></h1>
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
