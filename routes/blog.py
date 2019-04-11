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


@main.route('/', methods=['GET'])
def index():
    return render_template('blog_index.html')


@main.route('/articles/<article_id>', methods=['GET'])
def detail(article_id):
    return index()


@main.route('/new', methods=['GET'])
@login_required
def new():
    return render_template('blog_new.html')


@main.route('/add', methods=['POST'])
@login_required
def add():
    form = request.form
    print('增加文章', form)
    u = User.current_user()
    blog = Blog.new(form, user_id=u.id)
    return redirect(url_for('.detail', blog_id=blog.id))
