var markedIt = function(text) {
    var md = new Remarkable()
    var marked = md.render(text)
    // log('type of marked', typeof(marked))
    return marked
}
