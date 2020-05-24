function loadIndex(record) {
    function postTemplate(blog) {
        let b = blog
        let ut = utils.timeFormat(b.updated_time)
        let excerpt = marked(b.excerpt)
        let title = b.title.replace('#', '')
        let path = '/post/' + b.id

        const t = `
            <div class="post-item" data-path=${path}>
                <div>
                    <img class="post-cover link nav-link" src=${b.cover_name} data-path="${path}"></img>
                </div>
                <div class="post-content">
                    <div class="post-title link nav-link">${title}</div>
                    <div class="post-excerpt">${excerpt}</div>
                    <div class="update-time">${ut}</div>
                </div>
            </div>
        `
        return t
    }

    function pageTemplate(number=1) {
        let pn = number
        const t = `
            <div class="pagination">
                <div class="page-number link underline" data-pn="${pn}">${pn}</div>
            </div>
        `
        return t
    }

    function insertBlogs(wrap, blogs) {
        utils.appendChildren(wrap, blogs, postTemplate)
    }
    
    function insertPagination() {
        number = 1
        utils.appendHTML('.main-content', number, pageTemplate)
    }

    function insertIndexBody(blogs) {
        let wrap = buildWrapWithClass('content-wrap')
        insertBlogs(wrap, blogs)
        insertPagination()
    }

    function clean() {
        utils.clean('.main-content')
    }

    function load(data) {
        let blogs = utils.dataSolver(data, 'INDEX')
        clean()
        insertIndexBody(blogs)

        hideSidebar()
        showMenuToggle()
    }

    utils.apiAllBlogs(load)
}
