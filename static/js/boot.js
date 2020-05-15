Front.refresh = function() {
    // Front.utils.marked()
    Front.utils.registerSidebarTOC()
    Front.utils.registerNavToggle()
}

function __main() {
    // window.addEventListener('DOMContentLoaded', () => {
    //     Front.refresh()
    //     Front.unit.registerIndexBody()
    // })
    initApp()
}

__main()