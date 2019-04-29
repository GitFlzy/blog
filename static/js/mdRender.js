let mdRender = function() {
    let md = new Remarkable()
    let input = document.querySelector('.markdown-text')
    input.addEventListener('keyup', function(event){
        // console.log('触发按键事件')
        let target = event.target
        let text = input.value
        // console.log('输入的内容', text)
        let content = md.render(text)
        let render = document.querySelector('.markdown-render')
        render.innerHTML = content
        // console.log('render', render)
    })
}

let main = function() {
    mdRender()
}

main()
