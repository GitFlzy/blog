
var commentTemplate = function(comment) {
    var id = comment.id
    var author = comment.author
    var date = comment.year_month_day()
    var content = comment.content

    var template = `
        <ul id="comment-${id}" class="comment-meta">
            <li>评论者: ${author}</li>
            <li>评论时间: ${date}</li>
            <li>评论内容: ${content}</li>
            <div class="reply">
                <button class="comment-reply">回复</button>
            </div>
        </ul>
    `
    return template
}


var bindEventCommentFrameAdd = function() {
    var respondCell = e('.comments-list')
    log('respond', respondCell)
    respondCell.addEventListener('click', function(event){
        var self = event.target
        if (self.classList.contains('comment-reply')) {
            // log('点击了测试按钮')
            var respond = e('.comment-respond')
            var t = self.parentElement
            var commentCell = t.parentElement
            log('commentCell', commentCell)
            commentCell.appendChild(respond)

            // 获取 comment id
            var preLen = 'comment-'.length
            var cid = commentCell.getAttribute('id').substring(preLen)
            cid = parseInt(cid)
            log('cid /..:', cid)
            // 判断是不是回复回复
            // respond url_for 里插入 cid
            var replyIdCell = respond.querySelector('#reply_id')
            log('reply cell', replyIdCell)
            replyIdCell.setAttribute('value', cid)
            // rootIdCell.setAttribute('value', cid)
            // log('reply id', replyIdCell.getAttribute('value'))
        }
    })
}

var bindEventCommentAdd = function() {
    var commentsArea = e('.comments-area')
    log('respond', commentsArea)
    commentsArea.addEventListener('click', function(event){
        var self = event.target
        if (self.classList.contains('comment-respond-button')) {
            log('点击了 添加评论 按钮')
            log('点击的 cell', self)
            var respond = e('#respond')
            var input = respond.querySelector('#reply_id')
            var replyId = input.value
            log('回复的 id', reply_id)
            input = respond.querySelector('#comment')
            var content = input.value
            log('提交的评论内容', content)
            input = respond.querySelector('#comment_post_ID')
            var blogId = input.value
            log('评论的微博 id', blogId)
            var form = {
                'content': content,
                'reply_id': replyId,
                'blog_id': blogId,
            }
            log('添加评论的 form', form)
            apiBlogCommentAdd(form, function(r){
                log('后端更新完成')
                log('返回一个 json 数据', r)
            })
        }
    })
}

var bindEvents = function() {
    bindEventCommentFrameAdd()
    bindEventCommentAdd()
}

var __main = function() {
    bindEvents()
    // loadBlogDetail()
}

__main()
