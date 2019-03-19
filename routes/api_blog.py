import json


from utils import log

from models.blog import Comment
from models.blog import Blog
from models.user import (
    User,
    login_required,
)

from flask import (
    request,
    Blueprint,
    jsonify,
)


main = Blueprint('api_blog', __name__)


@main.route('/', methods=['GET'])
def index():
    cur_user = User.current_user()
    if cur_user is None:
        return redirect(url_for('admin.login'))

    log('blog index, 当前用户', cur_user)
    cur_uid = cur_user.id
    blog = Blog.find_by(id=blog_id)
    owner_uid = blog.user_id
    if cur_user.id != owner_uid:
        return redirect(url_for('blog.index'))

    articles = Blog.all()
    log('articles', articles)
    json_ars = [art.json() for art in articles]
    log('json all blog', json_ars)
    return jsonify(json_ars)


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
