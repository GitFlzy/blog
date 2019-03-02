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
    log('request 请求', request)
    log('request json', request.get_json())
    form = request.get_json()
    reply_id = int(form.get('reply_id'))
    blog_id = int(form.get('blog_id'))
    content = form.get('content')

    log('id blog_id content', id, blog_id, content)

    new_form = dict(
        blog_id=blog_id,
        content=content,
        reply_id=reply_id,
    )
    c = Comment.find_by(id=reply_id)
    log('debug find_by c', c)
    if c is not None:
        log('debug c is not None')
        new_form['root_id'] = c.root_id
        log('debug set root_id', c.root_id)

    o = Comment.new(new_form)
    # if o.root_id == -1 or o.root_id is None:
    #     setattr(o, 'root_id', o.id)
    log('comment add new comment', o)
    return jsonify(o.json())
