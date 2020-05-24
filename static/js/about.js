function loadAbout() {
    utils.log('about page')

    function loadToggle() {
        hideSidebar()
        showMenuToggle()
    }

    function template(entry) {
        let version = entry.version
        let content = entry.content
        let ct = utils.timeFormat(entry.created_time)

        const t = `
            <div class="release-entry">
                <div class="version">
                    <h1>${version}</h1>
                </div>
                <span class="date">
                    ${ct}
                </span>
                <div class="content">
                    ${content}
                </div>
            </div>
        `
        return t
    }
    
    function insertEntries(entries) {
        let wrap = buildWrapWithClass('release-position')
        utils.appendChildren(wrap, entries, template)
    }

    function cleanBody() {
        utils.clean('.main-content')
    }

    function loadBody(entries) {
        cleanBody()
        insertEntries(entries)
    }

    function load(data) {
        let entries = utils.dataSolver(data, 'ABOUT')
        loadBody(entries)
        loadToggle()
    }

    utils.apiBlogAbout(load)
}
