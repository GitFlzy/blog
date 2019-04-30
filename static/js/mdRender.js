let renderText = function(text) {
    let md = new Remarkable()
    let content = md.render(text)
    let render = document.querySelector('.markdown-render')
    render.innerHTML = content
}

let mdRender = function() {
    let md = new Remarkable()
    let input = document.querySelector('.markdown-text')
    input.addEventListener('keyup', function(event){
        let text = input.value
        renderText(text)
    })
}

let init = function() {
    let text = e('.markdown-text').value
    renderText(text)
}

let main = function() {
    init()
    mdRender()
}

main()
