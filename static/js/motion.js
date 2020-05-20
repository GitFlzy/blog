motion = {
    loadDetailPageById: function(blogId) {
        let url = '/post/' + blogId
        let record = utils.newRecord(url)
        motion.loadDetailBody(record)
        utils.pushState(record)
    },

    loadDetailBody: function(record, callback) {
        // console.log('调用了 detail 注册事件')
        function registerNearPost() {
            let postNav = utils.e('.post-nav')
            postNav.addEventListener('click', function(event) {
                let target = event.target
                let item = target.closest('.post-nav-item')
                // console.log('点击了临近的文章链接')
                let blogId = item.dataset.id
                // console.log('blog id ', blogId)
                if (blogId != '') {
                    motion.loadDetailPageById(blogId)
                }
            })
        }

        function hidePagination() {
            utils.hideElement('.pagination')
        }

        function hideSearchTitle() {
            utils.hideElement('.search-title')
        }

        function itemTemplate(blog) {
            let title = marked(blog.title)
            let ct = utils.timeFormat(blog.created_time)
            let ut = utils.timeFormat(blog.updated_time)
            let body = marked(blog.body)
            let nextId = blog.next_id
            let nextTitle = blog.next_title.replace('#', '')
            let prevId = blog.previous_id
            let prevTitle = blog.previous_title.replace('#', '')

            return `
                <article class="post-block">
                    <div class="background-pic" style="background-image: url(${blog.cover_name})"></div>
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
                            <div class="post-nav-prev post-nav-item link" data-id="${prevId}">
                                <span class="post-title">${prevTitle}</span>
                            </div>
                            <div class="post-nav-next post-nav-item link" data-id="${nextId}">
                                <span class="post-title">${nextTitle}</span>
                            </div>
                        </div>
                    </footer>
                </article>
            `
        }

        function clearPage() {
            utils.clearChildren('.content-wrap')
            hidePagination()
            hideSearchTitle()
        }

        function showDetailElements(blogs) {
            utils.appendHTML('.content-wrap', blogs, itemTemplate)
        }

        function loadDetailPage(record, callback) {
            // console.log('load detail page, record', record)
            let blogId = record.path.slice(6).split('/')[0]
            utils.apiBlogDetail(blogId, function(data){
                // console.log('返回的数据', data)
                let blogs = utils.dataSolver(data, 'DETAIL')
                clearPage()
                showDetailElements(blogs)

                callback && callback()
                registerNearPost()
                motion.TOC_Actions()
            })
        }
        
        loadDetailPage(record, callback)
    },

    loadIndexBody: function(record, callback) {
        function itemTemplate(blog) {
            let b = blog
            let ut = utils.timeFormat(b.updated_time)
            let excerpt = marked(b.excerpt)
            let title = b.title.replace('#', '')

            const t = `
                <div class="post-item" data-blog-id=${b.id}>
                    <div>
                        <img class="post-cover link post-link" src=${b.cover_name}></img>
                    </div>
                    <div class="post-content">
                        <div class="post-title link post-link">${title}</div>
                        <div class="post-excerpt">${excerpt}</div>
                        <div class="update-time">${ut}</div>
                    </div>
                </div>
            `
            return t
        }

        function showPagination() {
            utils.showElement('.search-title')
        }

        function showSearchTitle() {
            utils.showElement('.pagination')
        }

        function showIndexElements(blogs) {
            showSearchTitle()
            utils.appendHTML('.content-wrap', blogs, itemTemplate)
            showPagination()
        }

        function clearPage() {
            utils.clearChildren('.content-wrap')
        }

        utils.apiAllBlogs(function(data){
            let blogs = utils.dataSolver(data, 'INDEX')
            clearPage()
            showIndexElements(blogs)
            callback && callback()
            motion.TOC_Actions()
        })
    },

    showSidebar: function() {
        utils.e('body').style.paddingRight = '320px'
        utils.e('.sidebar').classList.add('sidebar-active')
    },

    hideSidebar: function() {
        // console.log('隐藏目录')
        utils.e('body').style.paddingRight = '0px'
        utils.e('.sidebar').classList.remove('sidebar-active')
    },

    showCloseToggle: function() {
        let toggle = utils.e('.sidebar-toggle')
        toggle.classList.remove('sidebar-active')
        toggle.classList.remove('toggle-arrow')
        toggle.classList.add('toggle-close')
    },

    showMenuToggle: function() {
        let toggle = utils.e('.sidebar-toggle')
        toggle.classList.remove('toggle-arrow')
        toggle.classList.remove('toggle-close')
        toggle.classList.add('sidebar-active')
    },

    registerSidebarTOC: function() {
        function titleTemplate(number, title) {
            let t = `
                <li class="nav-item">
                    <a class="nav-link" href="#${title}">
                        <span class="nav-number">${number}.</span>
                        <span class="nav-text">${title}</span>
                    </a>
                </li>
            `
            return t
        }
    
        function buildSidebar() {
            // [编号，等级，目录元素，目录元素的父节点]
            let titles = utils.es('h2, h3, h4, h5, h6, h7')
    
            if (titles.length === 0) {
                return
            }
    
            let stack = [
                {
                    number: '0',
                    level: titles[0].nodeName.replace('H', ''),
                    element: null,
                    parentNode: utils.e('.toc-nav'),
                },
            ]
            // console.log('find titles', titles)
            for (const title of titles) {
                let level = Number(title.nodeName.replace('H', ''))
                // console.log('title.nodeName', title.nodeName)
                let top = stack[stack.length - 1]
    
                while (level < top.level) {
                    stack.pop()
                    top = stack[stack.length - 1]
                }
    
                let number = ''
                let parentNode = top.parentNode
                if (level > top.level) {
                    number = top.number + '.1'
                    let newNode = document.createElement('ol')
                    newNode.classList.add('nav-child')
                    top.element.appendChild(newNode)
                    parentNode = newNode
                } else {
                    stack.pop()
                    let numbers = top.number.split('.')
                    numbers[numbers.length - 1] = (Number(numbers[numbers.length - 1]) + 1).toString()
                    number = numbers.join('.')
                }
    
                let t = titleTemplate(number, title.id)
                parentNode.insertAdjacentHTML('beforeend', t)
                stack.push({
                    number: number,
                    level: level,
                    element: parentNode.lastElementChild,
                    parentNode: parentNode,
                })
            }
        }
    
        function bindEventBookMark() {
            let links = utils.es('.nav-link')
            links.forEach(link => {
                link.addEventListener('click', function(event) {
                    event.preventDefault();
                    let id = event.target.closest('.nav-link').getAttribute('href')
                    let title = document.querySelector(id)
                    let y = title.getBoundingClientRect().top + window.scrollY
                    window.scrollTo(0, y + 5)
                })

            })
        }

        function activateNavByIndex(index) {
            let catalog = document.querySelectorAll('.nav-link')
            let target = catalog[index]
            if (target.classList.contains('active-current')) {
                return
            }
    
            document.querySelectorAll('.post-toc .active').forEach(element => {
                element.classList.remove('active', 'active-current');
            })
            target.classList.add('active', 'active-current');
            let parent = target.parentNode;
            while (!parent.matches('.post-toc')) {
                if (parent.matches('li')) parent.classList.add('active');
                parent = parent.parentNode;
            }
        }
    
        function findIndex(entries, sections) {
            // let sections = utils.es('h2, h3, h4, h5, h6, h7')
            let index = 0
            let entry = entries[index]
            for (; index < entries.length; ++index) {
                if (entries[index].boundingClientRect.top > 0) {
                    entry = entries[index]
                    index = sections.indexOf(entry.target)
                    return index === 0 ? 0 : (index - 1)
                } else {
                    entry = entries[index]
                }
            }
    
            return sections.indexOf(entry.target)
        }
    
        function observerDocument(marginTop) {
            marginTop = 10000 + marginTop
            let sections = [...utils.es('h2, h3, h4, h5, h6, h7')]
            if (sections.length === 0) {
                return
            }
    
            let options = {
                root: null,
                rootMargin: `${marginTop}px 0px -100% 0px`,
                threshold: 0,
            }
    
            let observer = new IntersectionObserver(function(entries, observe) {
                let scrollHeight = document.documentElement.scrollHeight + 100;
                if (scrollHeight > marginTop) {
                  observe.disconnect();
                  observerDocument(scrollHeight);
                  return;
                }
                
                let index = findIndex(entries, sections)
                activateNavByIndex(index)
            }, options);
    
            for (const title of sections) {
                observer.observe(title)
            }
        }
    
        buildSidebar()
        bindEventBookMark()
        observerDocument(document.documentElement.scrollHeight)
    },

    clearTOC: function() {
        utils.e('.toc-nav').innerHTML = ''
    },

    TOC_Actions: function() {
        motion.clearTOC()
        
        if (utils.indexPage()) {
            motion.hideSidebar()
            motion.showMenuToggle()
        } else {
            motion.registerSidebarTOC()
            if (utils.TOC_empty()) {
                motion.hideSidebar()
                motion.showMenuToggle()
            } else {
                motion.showSidebar()
                motion.showCloseToggle()
            }
        }
    }

}

function loadPageByRecord(record, callback) {
    // console.log('load page start')
    if (record == null) {
        return
    }

    let path = record.path
    if (utils.indexPage(path)) {
        motion.loadIndexBody(record, callback)
    } else if (utils.detailPage(path)) {
        motion.loadDetailBody(record, callback)
    }
}
