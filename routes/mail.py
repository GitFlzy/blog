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

main = Blueprint('main', __name__)


@main.route('/')
def index():
    user = User.current_user()
    log('current user ({})'.format(user))
    if user is None:
        return redirect(url_for('admin.login'))

    blogs = Blog.find_all(user_id=user.id)
    return render_template('blog_index.html', blogs=blogs)


@main.route('/add', methods=['POST'])
def index():
    user = User.current_user()
    log('current user ({})'.format(user))
    if user is None:
        return redirect(url_for('admin.login'))

    blogs = Blog.find_all(user_id=user.id)
    return render_template('blog_index.html', blogs=blogs)
