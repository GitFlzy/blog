from flask import (
    render_template,
    request,
    redirect,
    url_for,
    Blueprint,
    make_response,
    jsonify,
    flash,
)
from werkzeug.utils import secure_filename

from config import files_path

from models.user import (
    User,
    login_required,
)

from utils import log

import os

main = Blueprint('admin', __name__)


@main.route('/')
def index():
    return redirect(url_for('admin.login'))


@main.route('/register', methods=['GET', 'POST'])
def register():
    error = ''
    form = request.form
    log('register request form', form)
    if request.method == 'POST':
        u = User.validate_register(form)
        if u is not None:
            return redirect(url_for('.login'))
        else:
            error = '注册失败'
    return render_template('register.html', error=error)


@main.route('/login', methods=['GET', 'POST'])
def login():
    error = request.args.get('error', '')
    form = request.form
    if request.method == 'POST':
        log('当前用户', User.current_user())
        if User.validate_login(form):
            return redirect(url_for('.profile'))
        else:
            error = '无效的账号或者密码'
    return render_template('login.html', error=error)


@main.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    log('logged in, username is in session')
    message = request.args.get('message', '')
    user = User.current_user()
    return render_template('profile.html', u=user, message=message)


@main.route('/logout', methods=['POST', 'GET'])
def logout():
    User.clear_login_status()
    return redirect(url_for('.index'))


def allow_file(filename):
    suffix = filename.split('.')[-1]
    from config import accept_user_file_type
    return suffix in accept_user_file_type


@main.route('/settings/avatar', methods=['POST'])
@login_required
def upload_avatar():
    log('request files', request.files)
    if 'avatar' not in request.files:
        return redirect(url_for('.profile'))

    file = request.files['avatar']
    log('load file', file)
    path = files_path
    filename = file.filename
    log('文件的文件名', filename)
    if allow_file(filename):
        # filename = secure_filename(filename)
        import uuid
        suffix = filename.split('.')[-1]
        filename = str(uuid.uuid3(uuid.NAMESPACE_DNS, filename)) + '.' + suffix
        file.filename = filename
        filename = os.path.join(path, filename)
        u = User.current_user()
        u.save_image(file, filename)
    return redirect(url_for('.profile'))


@main.route('/settings/password', methods=['POST'])
@login_required
def update_password():
    form = request.form
    u = User.current_user()
    status = u.update_password(form)
    if status is False:
        log('修改密码失败')
    else:
        log('修改密码成功')
    return redirect(url_for('.profile'))
