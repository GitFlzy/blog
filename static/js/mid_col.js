let articleTemplate = function(blog) {
    let id = blog.id
    let title = blog.title
    let content = markedIt(blog.content)
    let dateTime = formatedTime(blog.ct)
    let t = `
        <article id="post-${id}" class="article article-type-post" data-id=${blog.id}>
            <div class="article-inner">
                <header class="article-header">
                    <h1 class="article-title link" itemprop="name">
                        ${title}
                    </h1>
                    <time class="archive-article-date" datetime=${dateTime} itemprop="datePublished">
                        <i class="icon-calendar icon"></i>
                        ${dateTime}
                    </time>
                </header>
                <div class="article-entry markdown-text" itemprop="articleBody">
                    ${content}
                </div>

            </div>
            <div id="comments" class="comments-area invisible">
                <div class="comments-list">
                </div>
            </div>
        </article>
    `
    return t
}

let infoTemplate = function() {
    let t = `
        <div class="article-info article-info-index">
            <div class="article-tag tagcloud">
                <i class="icon-price-tags icon"></i>
                <ul class="article-tag-list">
                </ul>
            </div>
            <div class="article-more-link link">
                展开全文 >>
            </div>
        <div class="clearfix"></div>
        </div>
    `
    return t
}

let displayArticle = function() {
    let midCol = document.querySelector('.mid-col')
    midCol.classList.remove('invisible')
}


let insertArticles = function(element, blogs) {
    for (let i = 0; i < blogs.length; ++i) {
        let blog = blogs[i]
        let article = articleTemplate(blog)
        element.insertAdjacentHTML('beforeend', article)
        insertArticleInfo(article)
    }
}

let insertArticleMain = function(blog) {
    // log('insert article main')
    let article = articleTemplate(blog)
    let articleList = e('.article-list')
    articleList.insertAdjacentHTML('beforeend', article)
}

let clearPage = function() {
    let classList = e('.article-list')
    removeAllChild(classList)
}

let loadDetailPage = function(blogId) {
    apiBlogById(blogId, function(formData){
        let form = JSON.parse(formData)
        // log('后端返回的 form', form)
        let status = form.status
        if (status) {
            let blog = form.blog
            clearPage()
            insertArticleMain(blog)
            pushHistory(`/articles/${blog.id}`)
        } else {
            // 返回一个 404 页面
            log('地址不正确, 返回 404 页面')
            let url = form.location
            location.pathname = url
        }
    })
}

let loadArticles = function(blogs) {
    clearPage()
    for (let i = 0; i < blogs.length; ++i) {
        let blog = blogs[i]
        insertArticleMain(blog)
    }
    pushHistory()
}

let insertArticlesInfo = function() {
    let articles = es('.article')
    // log('articles', articles)
    for (let i = 0; i < articles.length; ++i) {
        let ars = articles[i]
        let inner = findChild(ars, '.article-inner')
        let info = infoTemplate()
        inner.insertAdjacentHTML('beforeend', info)
    }
}

let clickArticle = function(event) {
    // log('点击事件', event.target)
    let target = event.target
    let article = target.closest('.article')
    let blogId = parseInt(article.dataset.id)
    loadDetailPage(blogId)
}

let bindEventsToAllArticles = function() {
    let title = '.article-title'
    let detail = '.article-more-link'
    let selectors = [title, detail]
    for (let i = 0; i < selectors.length; ++i) {
        let selector = selectors[i]
        bindAllClickEvent(selector, clickArticle)
    }
}

let loadInfoOfArticles = function() {
    insertArticlesInfo()
    bindEventsToAllArticles()
}

let loadBlogIndex = function() {
    apiAllBlogAbstract(function(formData){
        let form = JSON.parse(formData)
        // log('加载主页 传过来的 form', form)
        let blogs = form.blogs
        loadArticles(blogs)
        loadInfoOfArticles()
    })
}
