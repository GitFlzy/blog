from flask import (
    render_template,
    request,
    redirect,
    session,
    url_for,
    Blueprint,
    make_response,
)

# from models.user import User

from utils import log

main = Blueprint('index', __name__)

@main.route("/")
def index():
    # u = current_user()
    # return redirect(url_for('blog.index'))
    return 'ok'