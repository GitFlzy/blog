let removeBlog = function(cell) {
    let blogId = cell.dataset.id
    console.log('查找到的blog id ', blogId)
    apiBlogDelete(blogId, function(data){
        // log('data', data)
        let form = JSON.parse(data)
        let status = form.status
        if (status) {
            cell.remove()
        }
    })
}

let deleteEvent = function(event) {
    let target = event.target
    if (target.classList.contains('delete-blog')) {
        // log('click delete button')
        let blogCell = target.closest('.cell')
        removeBlog(blogCell)
    }
}

let bindEventDeleteBlog = function() {
    let blogList = e('.blog-list')
    bindClickEvent(blogList, deleteEvent)
}

let main = function() {
    bindEventDeleteBlog()
}

main()