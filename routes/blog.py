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

from models.blog import (
    Blog,
    filtered_blog,
    filtered_blogs,
)

from utils import log


main = Blueprint('blog', __name__)


@main.route('/', methods=['GET'])
def index():
    return render_template('blog_index.html')


@main.route('/articles/<blog_id>', methods=['GET'])
def detail(blog_id):
    return index()


@main.route('/new', methods=['GET'])
@login_required
def new():
    return render_template('blog_new.html')


@main.route('/edit', methods=['GET'])
@login_required
def edit():
    blogs = Blog.all()
    blogs = filtered_blogs(blogs)
    return render_template('blog_edit.html', blogs=blogs)


@main.route('/delete/<int:blog_id>', methods=['DELETE'])
@login_required
def delete(blog_id):
    blog = Blog.find_by(id=blog_id)
    blog.delete()
    return redirect(url_for('.edit'))

@main.route('/post', methods=['POST'])
@login_required
def post():
    form = request.form
    print('增加文章', form)
    u = User.current_user()
    blog = Blog.new(form, user_id=u.id)
    return redirect(url_for('.detail', blog_id=blog.id))
