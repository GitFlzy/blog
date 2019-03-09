import json


from utils import log

from models.blog import Comment
from models.blog import Blog

from flask import (
    request,
    Blueprint,
    jsonify,
)


main = Blueprint('api_blog', __name__)


@main.route('/', methods=['GET'])
def index():
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
    log('debug ** new comment', o)
    return jsonify(o.json())


@main.route('/comment/all/<int:blog_id>')
def all_comments(blog_id):
    log('debug all comments')
    b = Blog.find_by(id=blog_id)
    comments = b.comments()
    cs = [c.json() for c in comments ]
    log('debug comments', cs)
    return jsonify(cs)
