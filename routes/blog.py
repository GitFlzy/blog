from flask import (
    render_template,
    request,
    redirect,
    url_for,
    Blueprint,
    jsonify,
)


from models.user import (
    User,
    login_required,
)

from models.blog import Blog
from utils import log

main = Blueprint('blog', __name__)


@main.route('/', methods=['GET', 'POST'])
def index():
    blogs = Blog.find_all(user_id=1)
    log('当前用户 ({}), 所有的博客 ({})'.format(User.current_user(), blogs))
    return render_template('blog_index.html', blogs=blogs)


@main.route('/new', methods=['GET', 'POST'])
@login_required
def new():
    return render_template('blog_new.html')


@main.route('/articles/<int:blog_id>', methods=['GET', 'POST'])
def detail(blog_id):
    blog = Blog.find_by(id=blog_id)
    log('取出来的文章内容', blog.content)
    return render_template('blog_detail.html', blog=blog)


@main.route('/add', methods=['POST'])
@login_required
def add():
    form = request.form
    print('增加文章', form)
    u = User.current_user()
    blog = Blog.new(form, user_id=u.id)
    return redirect(url_for('.detail', blog_id=blog.id))
