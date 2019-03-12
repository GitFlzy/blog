from flask import (
    render_template,
    request,
    redirect,
    session,
    url_for,
    Blueprint,
    make_response,
    jsonify,
    flash,
)

from models.user import User

from utils import log

main = Blueprint('admin', __name__)


@main.route('/')
def index():
    return render_template('index.html')


@main.route('/register', methods=['GET', 'POST'])
def register():
    error = ''
    form = request.form
    log('register request form', form)
    if request.method == 'POST':
        u = User.validate_register(form)
        if u is not None:
            session['user_id'] = u.id
            # log('after register, session({})'.format(session))
            # flash('You were logged in')
            return redirect(url_for('.login'))
        else:
            error = '注册失败'
    return render_template('register.html', error=error)


@main.route('/login', methods=['GET', 'POST'])
def login():
    error = ''
    form = request.form
    if request.method == 'POST':
        if User.validate_login(form):
            session['logged_in'] = True
            # flash('You were logged in')
            return redirect(url_for('.profile'))
        else:
            error = 'Invalid username or password'
    return render_template('login.html', error=error)


@main.route('/profile', methods=['GET', 'POST'])
def profile():
    log('request method', request.method)
    log('profile start')
    log('总的 session', session)
    log('session username', session.get('username'))
    log('session user_id', session.get('user_id'))

    if 'user_id' in session:
        log('logged in, username is in session')
        user = User.current_user()
        return render_template('profile.html', u = user, session=session)
    else:
        log('username is not in session')
        return redirect(url_for('.index'))


@main.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('.index'))
