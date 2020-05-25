from flask import (
    Flask,
    render_template,
    request,
)

from config import secret_key

from routes.blog import main as blog_routes
from routes.admin import main as admin_routes
from routes.api_blog import main as api_blog_routes
# from routes.error import main as error_routes
from utils import log

app = Flask(__name__)
app.secret_key = secret_key


app.register_blueprint(blog_routes, url_prefix='/')
app.register_blueprint(admin_routes, url_prefix='/admin')
app.register_blueprint(api_blog_routes, url_prefix='/api/blog')


@app.errorhandler(404)
def page_not_found(e):
    log('404 not found, request url', request.url)
    return render_template('index.html')


if __name__ == '__main__':
    config = dict(
        port=3000,
        # host='127.0.0.1',
        host='0.0.0.0',
        # debug=True,
        debug=False,
    )
    app.run(**config)
