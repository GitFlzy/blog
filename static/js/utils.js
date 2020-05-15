Front.utils = {
    bindEvent: function(selector, eventName, callback) {
        let element = document.querySelector(selector)
        element.addEventListener(eventName, callback)
    },
    
    bindEvents: function(sel, eventName, callback) {
                let l = document.querySelectorAll(sel)
                for (let input of l) {
                    input.addEventListener(eventName, function (event) {
                        callback(event)
                    })
                }
            },
    
    registerSidebarTOC: function () {
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

        function initSidebar() {
            // [编号，等级，目录元素，目录元素的父节点]
            const stack = [
                {
                    number: '0',
                    level: 2,
                    element: null,
                    parentNode: document.querySelector('.post-toc .nav'),
                },
            ]
            let titles = document.querySelectorAll('h2, h3, h4, h5, h6, h7')
            for (const title of titles) {
                let level = Number(title.nodeName.replace('H', ''))
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

            // document.querySelector('body').style.paddingRight = '320px'
        }

        let links = document.querySelectorAll('.nav-link')
        const sections = [...links].map(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                let id = event.target.closest('.nav-link').getAttribute('href')
                let title = document.querySelector(id)
                let y = title.getBoundingClientRect().top + window.scrollY
                window.scrollTo(0, y + 5)
            })
            return document.getElementById(link.getAttribute('href').replace('#', ''))
        })

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

        function findIndex(entries) {
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

        function observerDocument() {
            initSidebar()
            let options = {
                root: null,
                rootMargin: '10000px 0px -100% 0px',
                threshold: 0,
            }

            var observer = new IntersectionObserver(function(entries) {
                let index = findIndex(entries)
                activateNavByIndex(index)
            }, options);

            for (const title of sections) {
                observer.observe(title)
            }
        }

        observerDocument()
    },

    registerNavToggle: function () {
        let toggle = document.querySelector('.sidebar-toggle')
        let sidebar = document.querySelector('.sidebar')

        let closeTag = 'toggle-close'
        let activeTag = 'sidebar-active'
        let arrowTag = 'toggle-arrow'

        toggle.addEventListener('mouseover', function () {
            // console.log('鼠标指向了弹出导航栏按钮')
            if (!toggle.classList.contains(closeTag)) {
                toggle.classList.add(arrowTag)
            }
        })

        toggle.addEventListener('mouseleave', function () {
            // console.log('鼠标不再指向导航栏按钮')
            toggle.classList.remove(arrowTag)
        })

        toggle.addEventListener('click', function () {
            // console.log('点击了弹出导航栏按钮')
            let sidebarWidth = '320px'
            if (toggle.classList.contains(closeTag)) {
                sidebarWidth = '0'
            }

            toggle.classList.toggle(closeTag)
            sidebar.classList.toggle(activeTag)

            document.querySelector('body').style.paddingRight = sidebarWidth
            toggle.classList.remove(arrowTag)
        })
    },

    ajax: function (method, url, data, responseCallBack, type="json") {
        const setRequestHeader = {
            'json': function(xmlHttp, data) {
                xmlHttp.setRequestHeader('Content-Type', 'application/json')
                data = JSON.stringify(data)
                return data
            },
            'upload': function(xmlHttp, data) {
                return data
            },
        }

        let xmlHttp = new XMLHttpRequest()
        xmlHttp.open(method, url, true)
        data = setRequestHeader[type](xmlHttp, data)

        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4) {
                responseCallBack(xmlHttp.response)
            }
        }

        xmlHttp.send(data)
    },

    ajaxGet: function(path, callback) {
        this.ajax('GET', path, '', callback)
    },

    apiAllBlogs: function(callback) {
        // console.log('调用了 all blogs')
        const path = '/api/blog/all'
        // console.log('this', this)
        this.ajaxGet(path, callback)
    },

    apiBlogDetail: function(id, callback) {
        const path = `/api/blog/post/${id}`
        // console.log('向地址请求', path)
        this.ajaxGet(path, callback)
    },
}

Front.unit = {
    registerDetailBody: function(record) {
        // console.log('调用了 detail 注册事件')

        function hiddenPagination() {
            let pn = document.querySelector('.pagination')
            pn.style.display = 'none'
        }

        function hiddenSearchTitle() {
            let st = document.querySelector('.search-title')
            st.style.display = 'none'
        }

        function itemTemplate(blog) {
            let ct = new Date(Number(blog.created_time) * 1000)
            ct = ct.toISOString().split('T')[0]

            return `
                <article class="post-block">
                    <div class="background-pic" style="background-image: url(${blog.cover_name})"></div>
                    <div class="post-header">
                        <h1 class="post-title">${blog.title}</h1>
                        <div class="post-time">${ct}</div>
                    </div>
                    <div class="post-body">
                        ${blog.content}
                    </class>
                </article>
            `
        }

        function loadDetailPage(record) {
            // console.log('load detail page, record', record)
            let blogId = record.path.slice(6).split('/')[0]
            Front.utils.apiBlogDetail(blogId, function(data){
                // console.log('返回的数据', data)
                let result = JSON.parse(data)
                if (result.code != 200) {
                    alert(result.message)
                    return
                }

                hiddenSearchTitle()
                hiddenPagination()
        
                let blog = result.blog
                let item = itemTemplate(blog)
                const wrap = document.querySelector('.content-wrap')
                
                wrap.innerHTML = ''
                // console.log('warp', wrap.innerHTML)
                wrap.insertAdjacentHTML('beforeend', item)

                scrollToPosition(record.lastPosition)
                console.log('当前的坐标', window.scrollY, '记录的回退坐标', record.lastPosition)

            })
        }
        loadDetailPage(record)
    },

    registerIndexBody: function(record) {
        function showPagination() {
            let st = document.querySelector('.search-title')
            st.style.display = 'block'
        }

        function showSearchTitle() {
            let pn = document.querySelector('.pagination')
            pn.style.display = 'block'
        }

        function itemTemplate(blog) {
            let b = blog
            let ut = new Date(Number(b.updated_time) * 1000)
            ut = ut.toISOString().split('T')[0]

            const item = `
                <div class="post-item" data-blog-id=${b.id}>
                    <div>
                        <img class="post-cover link post-link" src=${b.cover_name}></img>
                    </div>
                    <div class="post-content">
                        <div class="post-title link post-link">${b.title}</div>
                        <div class="post-excerpt">${b.excerpt}</div>
                        <div class="update-time">${ut}</div>
                    </div>
                </div>
            `
            return item
        }

        Front.utils.apiAllBlogs(function(data) {
            // console.log(typeof data)
            // console.log('接收到的 data', data)
            let result = JSON.parse(data)
            if (result.code != 200) {
                console.log('请求主页')
                alert(result.message)
                return
            }

            showSearchTitle()
            showPagination()

            const wrap = document.querySelector('.content-wrap')
            wrap.innerHTML = ''
            
            let blogs = result.blogs
            for (const blog of blogs) {
                let item = itemTemplate(blog)
                // console.log('index item', item)
                wrap.insertAdjacentHTML('beforeend', item)
            }

            // backToTop()
            scrollToPosition(record.lastPosition)
            console.log('当前的坐标', window.scrollY, '记录的回退坐标', record.lastPosition)
        })
    },
}