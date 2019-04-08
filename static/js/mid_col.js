var contentTemplate = function(blog) {
    var id = blog.id
    var title = blog.title
    var content = blog.content
    var dateTime = blog.ct
    var t = `
        <article id="post-${id}" class="article article-type-post "
            data-blog-id=${id}>
            <div class="article-inner">
                <header class="article-header">
                    <h1 class="article-title" itemprop="name">
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

var articleInfo = function(blog_id) {
    var t = `
        <div class="article-info article-info-index">
            <div class="article-tag tagcloud">
                <i class="icon-price-tags icon"></i>
                <ul class="article-tag-list">
                </ul>
            </div>
            <p class="article-more-link">
                <a class="article-more-a" href="/articles/${blog_id}">
                    展开全文 >>
                </a>
            </p>
        <div class="clearfix"></div>
        </div>
    `
    return t
}

var displayArticle = function() {
    var midCol = document.querySelector('.mid-col')
    midCol.classList.remove('invisible')
}

var insertArticle = function(blog) {
    var article = contentTemplate(blog)
    var midCol = document.querySelector('.mid-col')
    midCol.insertAdjacentHTML('beforeend', article)
}

var insertArticleInfo = function(blog_id) {
    var article = document.querySelector(`#post-${blog_id}`)
    var info = articleInfo(blog_id)
    article.insertAdjacentHTML('beforeend', info)
}

var loadArticleDetail = function(blog) {
    insertArticle(blog)
    displayArticle()
}

var loadArticlePart = function(blogs) {
    // console.log('调用了文章节选, 未完成')
    for (var i = 0; i < blogs.length; ++i) {
        var blog = blogs[i]
        insertArticle(blog)
        insertArticleInfo(blog.id)    
    }
    displayArticle()
}