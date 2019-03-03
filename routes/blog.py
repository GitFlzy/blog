from flask import (
    render_template,
    request,
    redirect,
    url_for,
    Blueprint,
    jsonify,
)
from models.user import User
from models.blog import Blog

from utils import log

main = Blueprint('blog', __name__)


@main.route('/')
def index():
    return render_template('blog_index.html')


@main.route('/articles/<int:blog_id>', methods=['GET'])
def detail(blog_id):
    # blog_id = request.args.get('blog_id', -1)
    blog = Blog.find_by(id=blog_id)
    log('article id ({}) detail ({})'.format(blog_id, blog))
    log('request query', request.args)
    return render_template('blog_detail.html', blog=blog)


@main.route('/add', methods=['POST', 'GET'])
def add():
    # 创建微博
    if request.method == 'GET':
        log('get add route')
        return redirect(url_for('.index'))

    print('click add button')
    form = request.form
    print('blog add post form', form)
    blog = Blog.new(form)
    return redirect(url_for('.index'))


@main.route('/delete?blog_id=<int:blog_id>', methods=['GET'])
def delete(blog_id):
    # blog_id = request.args['blog_id']
    Blog.delete(blog_id)
    return redirect(url_for('.index'))


@main.route('/edit', methods=['GET'])
def edit():
    return redirect(url_for('.index'))


@main.route('/update')
def update(request):
    pass
