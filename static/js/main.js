let loadPage = function(url=location.pathname) {
    if (url === null) {
        log('show page state is null')
    }
    if (url === '/') {
        loadIndexPage()
    } else {
        let pathList = url.split('/')
        let blogId = pathList[pathList.length - 1]
        loadDetailPage(blogId)
    }
}

let initApp = function(url=location.pathname) {
    loadProfile()
    loadPage(url)
    replaceHistory(url)
}

let bindEvents = function() {
    window.addEventListener('popstate', function(event){
        let state = event.state
        log('state', state)
        if (state != null) {
            let page = state.page
            loadPage(page)
        }
    })
}

let __main = function() {
    initApp()
    bindEvents()
}

__main()