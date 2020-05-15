let log = function() {
    console.log.apply(console, arguments)
}

let e = function(selector) {
    return document.querySelector(selector)
}

// let es = function(selector) {
//     return document.querySelectorAll(selector)
// }

let bindEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}

let bindAll = function(selector, eventName, callback) {
    let elements = document.querySelectorAll(selector)
    for(let i = 0; i < elements.length; i++) {
        let e = elements[i]
        bindEvent(e, eventName, callback)
    }
}

let bindClickEvent = function(element, callback) {
    bindEvent(element, 'click', callback)
}

let bindClickEventToAll = function(selector, callback) {
    bindAll(selector, 'click', callback)
}

let findChild = function(element, selector) {
    return element.querySelector(selector)
}

let removeAllChildren = function(parent) {
    while (parent.hasChildNodes()) {
        parent.firstChild.remove()
    }
}

let scrollToTop = function() {
    let container = e('#container')
    container.scrollTop = 0
}

let markedIt = function(text) {
    let md = new Remarkable()
    let marked = md.render(text)
    // log('type of marked', typeof(marked))
    return marked
}

let pushHistory = function(pathName='/', title='') {
    let state = {
        pathName: pathName,
    }
    history.pushState(state, title, pathName)
    if (title != '') {
        document.title = title
    }
}

let replaceHistory = function(pathName='/', title='') {
    let state = {
        pathName: pathName,
    }
    history.replaceState(state, title, pathName)
    if (title != '') {
        document.title = title
    }
}

let clearPage = function() {
    let classList = e('.article-list')
    removeAllChildren(classList)
}
