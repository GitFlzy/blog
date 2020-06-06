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

    function show_lines_block(block) {
        let inner = block.innerHTML
        let lines = inner.split('\n')
        for (let [index, line] of lines.entries()) {
            lines[index] = `<li>${line}</li>`
        }
        inner = lines.join('')
        block.innerHTML = `<ul>${inner}</ul>`
    }

    function show_lines() {
        let blocks = utils.es('pre code')
        for (let block of blocks) {
            show_lines_block(block)
        }
    }

    function rendered(text) {
        const renderer = new marked.Renderer();
 
        function highlight(code, language) {
            const validLanguage = hljs.getLanguage(language) ? language : 'plaintext'
            return hljs.highlight(validLanguage, code).value
        }

        const options = {
            renderer: renderer, 
            gfm: true,
            pedantic: false,
            sanitize: false,
            tables: true,
            breaks: true,
            smartLists: true,
            smartypants: false,
            highlight: highlight,
        }

        marked.setOptions(options)
        let html = marked(text)
        return html
    }

    function itemTemplate(blog) {
        let title = marked(blog.title)

        let nextTitle = blog.next_title.replace('#', '')
        let prevTitle = blog.previous_title.replace('#', '')

        let ct = utils.timeFormat(blog.created_time)
        let ut = utils.timeFormat(blog.updated_time)

        // let body = marked(blog.body)
        let body = rendered(blog.body)

        let nextId = blog.next_id
        let prevId = blog.previous_id
        
        let nextPath = ''
        if (nextId) {
            nextPath = `/post/${nextId}`
        }

        let prevPath = ''
        if (prevId) {
            prevPath = `/post/${prevId}`
        }

        return `
            <article class="post-block">
                <div class="background-pic" 
                 style="background-image: url(${blog.cover_name})"></div>
                <div class="post-header">
                    <div class="post-title">${title}</div>
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

    function insertBlog(blog) {
        let wrap = buildWrapWithClass('content-wrap')
        utils.appendChild(wrap, blog, itemTemplate)
        show_lines()
    }

    function cleanBody() {
        utils.clean('.main-content')
    }

    function loadBody(blog) {
        cleanBody()
        insertBlog(blog)
        utils.updateTitle(blog.title)
    }

    function load(data) {
        // console.log('返回的数据', data)
        let blog = utils.dataSolver(data, 'DETAIL')
        loadBody(blog)
        let toc = loadSidebar()
        loadToggle(toc)
    }

    utils.apiBlogDetail(path, load)
}
