let renderText = function(text) {
    let content = marked(text)
    let render = document.querySelector('.markdown-render')
    render.innerHTML = content
}

let mdRender = function() {
    let input = document.querySelector('.markdown-text')
    input.addEventListener('keyup', function(event){
        let text = input.value
        renderText(text)
    })
}

let init = function() {
    let text = document.querySelector('.markdown-text').value
    renderText(text)
    mdRender()
}
