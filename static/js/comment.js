var getCommentTemplate = function(comment, relation='parent') {
    // 原始 comment, 没有层次 root 以及 children
    // root, children 加到 comment-item 旁边
    var id = comment.id
    var author = comment.author
    var date = comment.ut
    var content = comment.content
    var icon = comment.icon_link
    var agreed = comment.agreed

    var template = `
        <ul id="comment-${id}" class="comment-item ${relation}"
            data-comment-id="${id}">
            <div class="user-header comment">
                <span class="user-icon">${icon}</span>
                <span class="user-name">${author}</span>
                <span class="user-name">${date}</span>
            </div>
            <div class="content-meta comment">
                <span class="content-text">${content}</span>
            </div>
            <div class="comment-footer">
                <button type="button" class="reply-button footer-reply comment">
                回复
                </button>
                <button type="button" class="agree-button footer-agree comment">
                赞同 ${agreed}
                </button>
                <button type="button" class="oppose-button footer-oppose comment">
                反对
                </button>
            </div>
        </ul>
    `
    return template
}

var getCommentInfoFromReply = function() {
    var reply = e('.comment-reply')
    var content = reply.querySelector('#comment-editor').value
    var parent = reply.parentElement
    // log('reply parent', parent)
    var commentForm = {}
    var blogId = parent.closest('.article').dataset.blogId

    if (parent.classList.contains('comment-item')) {
        var replyId = parent.dataset.commentId
        var rootId = parent.closest('.comment-item.root').dataset.rootId
        commentForm['reply_id'] = replyId
        commentForm['root_id'] = rootId
    }
    commentForm['blog_id'] = blogId
    commentForm['content'] = content
    // log('debug form', commentForm)
    return commentForm
}

var bindEventCommentFrameAdd = function() {
    var replyElement = e('.comments-list')
    replyElement.addEventListener('click', function(event){
        var self = event.target
        if (self.classList.contains('reply-button', 'comment')) {
            var reply = e('.comment-reply')
            var commentCell = self.closest('.comment-item')
            commentCell.appendChild(reply)
        }
    })
}

var bindEventCommentAdd = function() {
    var commentsArea = e('.comments-area')
    // // log('reply', commentsArea)
    commentsArea.addEventListener('click', function(event){
        var self = event.target
        if (self.classList.contains('blog-reply')) {
            // log('点击了 添加评论 按钮')
            var form = getCommentInfoFromReply()
            // log('form ', form)
            apiBlogCommentAdd(form, function(r){
                // log('后端更新完成')
                // log('返回的数据:', r)
                var form = JSON.parse(r)
                var comment = form.comment
                insertComment(comment)
                var commentReply = e('#reply')
                commentReply.remove()
                insertCommentReply()
            })
        }
    })
}

var getCommentReplied = function(comment) {
    var rootId = comment.rootId
    var selector = '#comment-' + rootId
    var elementReplied = e(selector)
    return elementReplied
}

var getCommentRelation = function(comment) {
    if (comment.id != comment.root_id) {
        return 'child'
    }
    return 'parent'
}

var getChildrenTemplate = function(id) {
    var t = `
        <div id="comment-${id}" class="comment-item children">
        </div>
    `
    return t
}

var insertChildrenHeader = function(comment, parentElement) {
    var template = getChildrenTemplate(comment.id)
    parentElement.insertAdjacentHTML('beforeend', template)
}

var hasChildren = function(rootElement) {
    var root = rootElement
    return root.querySelector('.comment-item.children') != null
}

var insertChild = function(comment, parentElement) {
    var parent = parentElement
    // 如果是第一个 child, 先建立父层 children
    if (!hasChildren(parent)) {
        insertChildrenHeader(comment, parent)
    }
    var childrenElement = parent.querySelector('.comment-item.children')
    var template = getCommentTemplate(comment, 'child')
    childrenElement.insertAdjacentHTML('beforeend', template)
}

var getParentElement = function(id) {
    var selector = '#comment-' + id
    var parent = e(selector)
    return parent
}

var getParentTemplate = function(comment) {
    var template = getCommentTemplate(comment)
    var id = comment.id
    var t = `
        <div id="comment-${id}" class="comment-item root" data-root-id=${id}>
            ${template}
        </div>
    `
    return t
}

var insertParent = function(comment, commentsList) {
    var t = getParentTemplate(comment)
    commentsList.insertAdjacentHTML('beforeend', t)
}

var insertComment = function(comment) {
    var relation = getCommentRelation(comment)
    if (relation == 'child') {
        var parentElement = getParentElement(comment.root_id)
        insertChild(comment, parentElement)
    } else {
        var commentsList = e('.comments-list')
        insertParent(comment, commentsList)
    }
}

var insertComments = function(comments) {
    for (var i = 0; i < comments.length; ++i) {
        insertComment(comments[i])
    }
}

var insertCommentReply = function() {
    var t = `
        <div id="reply" class="comment-reply">
            <textarea id="comment-editor" name="comment" method="post"></textarea>
            <button class="reply-button blog-reply comment">发表评论</button>
        </div>
    `
    commentsElement = e('.comments-area')
    commentsElement.insertAdjacentHTML('beforeend', t)
}

var loadBlogDetail = function() {
    var article = e('.article')
    var blogId = article.dataset.blogId

    apiCommentsAll(blogId, function(r){
        comments = JSON.parse(r)
        // |-->comments-list
        //     |-->comment parent (header)
        //         |-->comment parent (element)
        //         |-->comment children (header)
        //         |-->comment child 1 (element)
        //         |-->comment child 2 (element)
        //         |-->comment child 3 (element)
        insertComments(comments)
        insertCommentReply()
    })
}

var resetCommentReply = function() {
    var replyElement = e('#reply')
    replyElement.remove()
    insertCommentReply()
}

var resetComment = function(commentElement) {
    var ce = commentElement
    var meta = ce.querySelector('.content-meta comment')
    var t = `
        <div class="content-meta comment">
            <span class="content-text">该评论已删除</span>
        </div>
    `
    meta.insertAdjacentHTML('afterend', t)
    meta.remove()
}

var bindCommentEvents = function() {
    bindEventCommentFrameAdd()
    bindEventCommentAdd()
}
