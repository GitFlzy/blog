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

let insertArticleMain = function(blog) {
    // log('insert article main')
    let article = articleTemplate(blog)
    let articleList = e('.article-list')
    articleList.insertAdjacentHTML('beforeend', article)
}

let showBlogDetail = function(blog) {
    clearPage()
    insertArticleMain(blog)
}

let showErrorPage = function(error=404) {
    log('show error page 404')
    clearPage()
    let content = '待更新'
    let midCol = e('.mid-col')
    midCol.innerHTML = content
}

let loadDetailPage = function(blogId) {
    apiBlogById(blogId, function(formData){
        let form = JSON.parse(formData)
        // log('后端返回的 form', form)
        let status = form.status
        if (status) {
            let blog = form.blog
            showBlogDetail(blog)
        } else {
            // 返回一个 404 页面
            log('地址不正确, 返回 404 页面')
            showErrorPage(404)
        }
        scrollToTop()
    })
}
