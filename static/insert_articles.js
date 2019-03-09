

var articleTemplate = function(blog) {
    var id = blog.id
    var author = blog.author
    var title = blog.title
    var date = blog.ct
    var content = blog.content

    var template = `
        <article id="post-${id}">
            作者: ${author}
            标题:<a href="/articles/${id}" rel="bookmark">
                ${title}
                </a>
            内容: ${content}
            @ ${date}
        </article>
    `
    return template
}

var insertBlog = function(blog) {
    var article = articleTemplate(blog)
    var blogFrame = e('.contents')
    blogFrame.insertAdjacentHTML('beforeend', article)
}

var loadBlogAllArticles = function() {
    apiBlogAll(function(r){
        // 解析为 数组
        var blogs = JSON.parse(r)
        // 循环添加到页面中
        for(var i = 0; i < blogs.length; i++) {
            var blog = blogs[i]
            insertBlog(blog)
        }
    })
}

var __main = function() {
    log('debug start insert articles')
    loadBlogAllArticles()
    log('debug, 插入所有文章')
}

__main()