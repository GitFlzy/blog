const observers = []

pageCodes = {
    DETAIL: 200,
    INDEX: 200,
    NOTFOUND: 404,
    ABOUT: 200,
}

utils = {
    log: function() {
        console.log.apply(console, arguments)
    },

    e: function(selector) {
        return document.querySelector(selector)
    },

    es: function(selector) {
        return document.querySelectorAll(selector)
    },
    
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
        const path = '/api/blog/all'
        this.ajaxGet(path, callback)
    },

    apiBlogDetail: function(route, callback) {
        const path = `/api/blog${route}`
        // console.log('向地址请求', path)
        this.ajaxGet(path, callback)
    },

    apiBlogAbout: function(callback) {
        const path = `/api/blog/about`
        console.log('向地址请求', path)
        this.ajaxGet(path, callback)
    },

    updateTitle: function(title) {
        title = title.replace('#', '')
        document.title = title
    },

    appendChild: function(element, object, template) {
        let ele = element

        let t = template(object)
        ele.insertAdjacentHTML('beforeend', t)
    },

    appendChildren: function(element, object, template) {
        let ele = element
        if (Array.isArray(object)) {
            for (const o of object) {
                utils.appendChild(ele, o, template)
            }
        } else {
            utils.appendChild(ele, object, template)
        }
    },

    appendHTML: function(selector, object, template) {
        let ele = document.querySelector(selector)
        utils.appendChildren(ele, object, template)
    },

    clearChildren: function(selector) {
        let ele = document.querySelector(selector)
        ele.innerHTML = ''
    },

    dataSolver: function(data, page) {
        // data 是一个 json 格式的字符串
        let result = JSON.parse(data)
        // console.log('result', result, 'page', page)
        if (Number(result.code) != pageCodes[page]) {
            // alert(result.message)
            if (Number(result.code) === 404) {
                console.log('result', result)
                console.log('redirection', result.redirection)
                location.href = result.redirection
            }
            return []
        }

        if (page == 'DETAIL') {
            return result.wrap[0]
        }

        return result.wrap
    },
    
    scrollToPosition: function(pos) {
        let x = pos[0]
        let y = pos[1]
        window.scrollTo(x, y)
    },
    
    scrollToTop: function() {
        scrollToPosition([0, 0])
    },

    timeFormat: function(timestamp) {
        let timeObject = new Date(Number(timestamp) * 1000)
        let format = timeObject.toISOString().split('T')[0]
        return format
    },

    cleanObservers: function() {
        for (const o of observers) {
            o.disconnect()
        }
    },

    clean: function(selector) {
        // 删除元素之后，观察事件仍然能生效，所以先手动停止观察
        utils.cleanObservers()

        let node = utils.e(selector)
        if (node) {
            node.innerHTML = ''
        }
    },
}