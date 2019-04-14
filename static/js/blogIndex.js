let infoTemplate = function() {
    let t = `
        <div class="article-info article-info-index">
            <div class="article-tag tagcloud">
                <i class="icon-price-tags icon"></i>
                <ul class="article-tag-list">
                </ul>
            </div>
            <div class="article-more-link">
            <div class="article-more-a link">
                展开全文 >>
            </div>
            </div>
        <div class="clearfix"></div>
        </div>
    `
    return t
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

let insertArticles = function(blogs) {
    for (let i = 0; i < blogs.length; ++i) {
        let blog = blogs[i]
        insertArticleMain(blog)
    }
}

let showArticles = function(blogs) {
    clearPage()
    insertArticles(blogs)
    insertArticlesInfo()
    scrollToTop()
}

let clickArticle = function(event) {
    // log('点击事件', event.target)
    let target = event.target
    let article = target.closest('.article')
    let blogId = parseInt(article.dataset.id)
    loadDetailPage(blogId)
    pushHistory(`/articles/${blogId}`)
}

let bindEventsToAllArticles = function() {
    let title = '.article-title'
    let detail = '.article-more-link'
    let selectors = [title, detail]
    for (let i = 0; i < selectors.length; ++i) {
        let selector = selectors[i]
        bindClickEventToAll(selector, clickArticle)
    }
}

let loadIndexPage = function() {
    apiAllBlogsAbstract(function(data){
        let blogs = JSON.parse(data)
        showArticles(blogs)
        bindEventsToAllArticles()
    })
}