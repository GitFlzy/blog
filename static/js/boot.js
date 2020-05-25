function registerEvents() {
    window.addEventListener('popstate', function(event){
        let record = event.state
        loadPageBody(record)
    })

    utils.bindEvent('body', 'click', function(event){
        let target = event.target
        // utils.log('点击了目标', target)
        if (target.classList.contains('nav-link')) {
            // utils.log('点击了文章', target, 'class list', target.classList)
            let path = target.dataset.path
            if (path === '') {
                return
            }

            loadPage(path)
        }
    })
}

function initApp() {
    let path = location.pathname
    loadPageBody(path)
    replaceHistory(path, 'index')
    registerNavToggle()
}

function __main() {
    initApp()
    registerEvents()
}

__main()
