const utils = {

}

function fileTemplate(file) {
    const t = `
        <div class="image-item">
            <span class="image-name">${file.name}</span>
            <div class="progress">
                <progress max="100" value="1" item-width="100" id="progress"></progress>
            </div>
        </div>
    `
    return t
}
function hiddenButton(button) {
    button.style.display = "none"
}

function showButton(button) {
    button.style.display = 'inline-block'
}

function isHidden(element) {
    return element.style.display === 'none'
}

function registerSelectImage()
{
    const select = document.querySelector('.select-image')
    const resource = document.querySelector('.resource')

    select.addEventListener('change', function(event){
        let fileInput = event.target.parentNode.querySelector('#file')
        let files = fileInput.files
        // console.log('files', files)
        resource.innerHTML = ''
        for (let i = 0; i < files.length; i++) {
            let file = files[i]
            resource.insertAdjacentHTML('beforeend', utils.fileTemplate(file))
        }
    })
}

function registerShowImages() {
    const body = document.querySelector('body')
    const resource = document.querySelector('.resource')
    const coverBtn = document.querySelector('.set-cover-btn')

    let cachedNode = body
    resource.addEventListener('mouseover', function(event){
        // console.log("鼠标聚焦了该元素", event.target)
        let target = event.target.closest('.image-item')
        if (!cachedNode.isEqualNode(target) || isHidden(coverBtn)) {
            // console.log('鼠标离开了元素', cachedNode)
            let imageName = target.querySelector('.image-name')
            imageName.after(coverBtn)
            showButton(coverBtn)
            cachedNode = target
        }
    })
    
    resource.addEventListener('mouseleave', function(event){
        // console.log('鼠标离开了该元素', event.target)
        hiddenButton(coverBtn)
    })
}

function registerCoverButton() {
    const coverBtn = document.querySelector('.set-cover-btn')
    coverBtn.addEventListener('click', function(event){
        let target = event.target
        let item = target.closest('.image-item').querySelector('.image-name')
        let coverName = item.innerHTML
        // console.log('set image as cover, name', coverName)
        document.querySelector('.coverName').value = coverName
    })
}

function registerUpload() {
    // TODO: 显示上传的进度
    var uploadButton = document.querySelector('.upload-btn')

    uploadButton.addEventListener('click', function(event) {
        // console.log('触发了点击事件', event.target)
        let fileInput = event.target.parentNode.querySelector('#file')
        let files = fileInput.files
        if (!files[0]) {
            alert('请先选择图片，再上传！')
            return
        }
    
        // console.log('选择了图片')
        let form = new FormData()
        for (file of files) {
            form.append('image', file, file.name)
        }
    
        utils.ajax('post', '/api/blog/upload', form, function(data){
            console.log('data receive', data)
            let result = JSON.parse(data)
            if (result.code === 201) {
                alert(result.message)
            }
        }, 'upload')
    })
}

function __main() 
{
    registerSelectImage()
    registerShowImages()
    registerCoverButton()
    registerUpload()
    init()
    mdRender()

}

__main()