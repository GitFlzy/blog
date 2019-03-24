from flask import Flask

from config import secret_key

from routes.blog import main as blog_routes
from routes.admin import main as admin_routes
from routes.api_blog import main as api_blog_routes
from routes.mail import main as mail_routes
# from routes.chat import main as chat_routes


app = Flask(__name__)
app.secret_key = secret_key


app.register_blueprint(blog_routes, url_prefix='/')
app.register_blueprint(admin_routes, url_prefix='/admin')
app.register_blueprint(api_blog_routes, url_prefix='/api/blog')
# app.register_blueprint(mail_routes, url_prefix='/mail')
# app.register_blueprint(chat_routes, url_prefix='/chat')


if __name__ == '__main__':
    config = dict(
        port=3000,
        host='0.0.0.0',
        debug=True,
    )
    app.run(**config)
