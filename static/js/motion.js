const routes = {
    'NOTFOUND': loadNotFound,
    'ABOUT': loadAbout,
    'DETAIL': loadDetail,
    'INDEX': loadIndex,
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

function showSidebar() {
    utils.e('body').style.paddingRight = '320px'
    utils.e('.sidebar').classList.add('sidebar-active')
}

function hideSidebar() {
    // console.log('隐藏目录')
    utils.e('body').style.paddingRight = '0px'
    utils.e('.sidebar').classList.remove('sidebar-active')
}

function showCloseToggle() {
    let toggle = utils.e('.sidebar-toggle')
    toggle.classList.remove('sidebar-active')
    toggle.classList.remove('toggle-arrow')
    toggle.classList.add('toggle-close')
}

function showMenuToggle() {
    let toggle = utils.e('.sidebar-toggle')
    toggle.classList.remove('toggle-arrow')
    toggle.classList.remove('toggle-close')
    toggle.classList.add('sidebar-active')
}

function buildWrapWithClass(className) {
    let wrap = document.createElement('div')
    wrap.classList.add(className)
    let main = utils.e('.main-content')
    main.appendChild(wrap)
    return wrap
}

function routeParser(path) {
    const Router = {
        NOTFOUND: 'NOTFOUND',
        ABOUT: 'ABOUT',
        INDEX: 'INDEX',
        DETAIL: 'DETAIL',
    }
    
    let route = Router.NOTFOUND

    const reg = new RegExp('^/post/([a-z|0-9])+$')
    if (reg.test(path)) {
        route = Router.DETAIL
    } else if (path === '/') {
        route = Router.INDEX
    } else if (path === '/about') {
        route = Router.ABOUT
    }

    return route
}

function pushHistory(path, title='') {
    history.pushState(path, title, path)
    document.title = title
}

function replaceHistory(path, title='') {
    history.replaceState(path, title, path)
    document.title = title
}

function loadPageBody(path) {
    let route = routeParser(path)
    routes[route](path)
}

function loadPage(path) {
    loadPageBody(path)
    pushHistory(path)
}
