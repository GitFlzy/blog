var bindEventBlogDelete = function() {
    var main = e('.contents')
    log('main', main)
    main.addEventListener('click', function(event){
        var self = event.target
        if (self.classList.contains('delete-button')) {
            log('点击了删除按钮')
            var blogId = self.dataset.blogId
            log('blog id', blogId)
            apiBlogDelete(blogId, function(r){
                log('后端返回的数据：', r)
                // 找到要删除的元素，删除
                var article = self.closest('.article-content')
                article.remove()
            })
        }
    })
}

var bindBlogEvents = function() {
    bindEventBlogDelete()
}

var __main = function() {
    bindBlogEvents()
}

__main()
