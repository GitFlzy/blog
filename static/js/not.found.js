function loadNotFound() {
    function template() {
        const t = `
            <div class="notfoud-container">
                <div class="img-404">
                </div>
                <p class="notfound-p">哎呀迷路了...</p>
                <div class="notfound-reason">
                    <p>可能的原因：</p>
                    <ul>
                        <li>原来的页面不存在了</li>
                        <li>我们的服务器被外星人劫持了</li>
                    </ul>
                </div>
                <div class="notfound-btn-container">
                    <span class="notfound-btn link nav-link" data-path="/">返回首页</span>
                </div>
            </div>
        `
        return t
    }

    function cleanBody() {
        utils.clean('.main-content')
    }

    function insertNotFound() {
        let main = utils.e('.main-content')
        let t = template()
        main.insertAdjacentHTML('beforeend', t)
    }

    function loadToggle() {
        hideSidebar()
        showMenuToggle()
    }

    function loadBody() {
        cleanBody()
        insertNotFound()
    }

    function load() {
        loadBody()
        loadToggle()
    }

    load()
}
