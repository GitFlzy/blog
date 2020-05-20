function registerEvents() {
    window.addEventListener('popstate', function(event){
        let record = event.state
        // saveCurrentPosition()
        console.log('pop state', record)
        loadPageByRecord(record)
    })

    utils.bindEvent('.content-wrap', 'click', function(event){
        let target = event.target
        // console.log('点击了目标', target)
        if (target.classList.contains('post-link')) {
            // console.log('点击了文章', target)
            // saveCurrentPosition()
            let item = target.closest('.post-item')
            let blogId = item.dataset.blogId
            motion.loadDetailPageById(blogId)
        }
    })

    utils.bindEvent('#blog-logo', 'click', function(event){
        // console.log('点击了', event.target)
        let record = utils.newRecord('/')
        motion.loadIndexBody(record)
        // pushHistory(record)
        utils.pushState(record)

        motion.hideSidebar()
        motion.showMenuToggle()
    })
}

function initApp(callback) {
    // console.log('init app, callback', callback)
    let record = utils.newRecord(location.pathname)
    loadPageByRecord(record, callback)
    utils.replaceState(record)
    motion.TOC_Actions()
}

function registerNavToggle() {
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
}

function registerUnits() {
    registerNavToggle()
}

function __main() {
    initApp(registerUnits)
    registerEvents()
}

__main()