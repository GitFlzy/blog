from utils import log

from models.blog import Comment
from models.blog import Blog
from models.user import (
    User,
    login_required,
)
# from models.chat import Chat

from flask import (
    request,
    Blueprint,
    jsonify,
)


main = Blueprint('api_blog', __name__)


def blog_filter(blogs):
    valid_attributes = [
        'id',
        'title',
        'content',
        'ct',
    ]
    blog_list = []
    for blog in blogs:
        blog_item = {}
        for key in valid_attributes:
            if hasattr(blog, key):
                value = getattr(blog, key)
                blog_item[key] = value
        blog_list.append(blog_item)
    log('过滤给前端的 blog form', blog_list)
    return blog_list


@main.route('/all', methods=['GET'])
@login_required
def index():
    blogs = Blog.all()
    log('blogs', blogs)
    blogs = blog_filter(blogs)
    return jsonify(blogs)


@main.route('/comment/add', methods=['POST'])
def add_comment():
    log('进入 add_comment 函数')
    form = request.get_json()
    blog_id = int(form.get('blog_id', -1))
    b = Blog.find_by(id=blog_id)
    user_id = b.user_id
    form['user_id'] = user_id
    log('debug *** form ***', form)

    o = Comment.new(form)
    b.update_replies()
    log('debug ** new comment', o)
    rf = {
        'comment': o.json(),
        'replies': b.replies,
    }
    log('rf', rf)
    log('jsonify rf', jsonify(rf), type(jsonify(rf)))
    return jsonify(rf)


@main.route('/<int:blog_id>/comment/all')
def all_comments(blog_id):
    log('debug all comments')
    b = Blog.find_by(id=blog_id)
    comments = b.comments()
    cs = [c.json() for c in comments]
    log('debug comments', cs)
    return jsonify(cs)


@main.route('/delete/<int:blog_id>', methods=['DELETE'])
def delete_blog(blog_id):
    log('debug 删除博客')

    cur_user = User.current_user()
    if cur_user is None:
        log('当前用户是', cur_user)
        return redirect(url_for('admin.login'))

    log('debug 当前用户', cur_user)
    cur_uid = cur_user.id
    blog = Blog.find_by(id=blog_id)
    owner_uid = blog.user_id
    if cur_user.id != owner_uid:
        log("""用户(uid={})想要访问用户(uid={})的博客,
            跳转到用户(uid={})的博客主页""".format(cur_uid, owner_uid, cur_uid))
        return redirect(url_for('.index'))

    log('debug before 删除博客')
    blog.delete()
    return jsonify({'status': True})


@main.route('/user/profile', methods=['GET'])
def user_profile():
    u = User.profile(1)
    log('用户简介', u)
    return jsonify(u)


@main.route('/chat/room/<int:room_id>', methods=['GET', 'POST'])
def chat(room_id):
    form = {}
    action = request.args.get('action')
    log('enter chat method:', request.method, action)
    if request.method == 'POST' and action == 'send':
        form = request.get_json()
        # content = form.get('content')
        # room_id = form.get('room_id')
        chat = Chat.new(form)
        log('生成的 chat', chat)
        chat = chat.json()
        return jsonify(chat)
    else:
        chats = Chat.find_all(room_id=room_id)
        chats = [c.json() for c in chats]
        return jsonify(chats)


@main.route('/add', methods=['POST'])
@login_required
def add():
    # 创建微博
    form = request.get_json()
    log('post 博客', form)
    u = User.current_user()
    log('md 文章内容', form['content'])
    blog = Blog.new(form, user_id=u.id)
    form = {
        'status': True,
        'location': '/articles/{}'.format(blog.id),
        'title': blog.title,
        'content': blog.content,
        'dateTime': blog.ct,
        'id': blog.id,
    }
    return jsonify(form)


