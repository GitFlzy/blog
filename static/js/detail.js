function loadDetail(path) {
    function TOC() {
        let register = registerSidebarTOC

        function empty() {
            let headings = utils.es('.nav-item')
            return headings.length === 0
        }

        function clean() {
            utils.clean('.toc-nav')
        }

        return {
            clean,
            empty,
            register,
        }
    }

    function loadToggle(TOC) {
        if (TOC.empty()) {
            hideSidebar()
            showMenuToggle()
        } else {
            // console.log('detail page, has toc')
            showSidebar()
            showCloseToggle()
        }
    }

    function loadSidebar() {
        let toc = TOC()
        toc.clean()
        toc.register()
        return toc
    }

    function itemTemplate(blog) {
        let title = blog.title.replace('#', '')
        let nextTitle = blog.next_title.replace('#', '')
        let prevTitle = blog.previous_title.replace('#', '')

        let ct = utils.timeFormat(blog.created_time)
        let ut = utils.timeFormat(blog.updated_time)

        let body = marked(blog.body)

        let nextId = blog.next_id
        let prevId = blog.previous_id
        let nextPath = '/post/' + nextId
        let prevPath = '/post/' + prevId

        return `
            <article class="post-block">
                <div class="background-pic nav-link" 
                 style="background-image: url(${blog.cover_name})"></div>
                <div class="post-header">
                    <div class="post-title nav-link">${title}</div>
                    <div class="post-time">
                        <span class="created-time">创建于 ${ct}</span>
                        <span class="created-time">更新于 ${ut}</span>
                    </div>
                </div>
                <div class="post-body">
                    ${body}
                </class>
                <footer class="post-footer">
                    <div class="post-nav">
                        <div class="post-nav-prev post-nav-item link nav-link" data-path="${prevPath}">
                            <span class="post-title nav-link" data-path="${prevPath}">${prevTitle}</span>
                        </div>
                        <div class="post-nav-next post-nav-item link nav-link" data-path="${nextPath}">
                            <span class="post-title nav-link" data-path="${nextPath}">${nextTitle}</span>
                        </div>
                    </div>
                </footer>
            </article>
        `
    }

    function insertBlogs(blogs) {
        let wrap = buildWrapWithClass('content-wrap')
        utils.appendChildren(wrap, blogs, itemTemplate)
    }

    function cleanBody() {
        utils.clean('.main-content')
    }

    function loadById(event) {
        let item = event.target.closest('.post-nav-item')
        let id = item.dataset.id
        if (id != '') {
            let path = '/post/' + id
            loadPage(path)
        }
    }

    function registerNearPost() {
        let postNav = utils.e('.post-nav')
        postNav.addEventListener('click', loadById)
    }

    function loadBody(blogs) {
        cleanBody()
        insertBlogs(blogs)
        // registerNearPost()
    }

    function load(data) {
        // console.log('返回的数据', data)
        let blogs = utils.dataSolver(data, 'DETAIL')
        loadBody(blogs)
        let toc = loadSidebar()
        loadToggle(toc)
    }

    utils.apiBlogDetail(path, load)
}
