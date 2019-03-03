from flask import Flask
from routes.index import main as index_routes
from routes.blog import main as blog_routes
from routes.api_blog import main as api_blog_routes

app = Flask(__name__)
app.secret_key = 'test for good '

app.register_blueprint(index_routes)
app.register_blueprint(blog_routes, url_prefix='/blog')
app.register_blueprint(api_blog_routes, url_prefix='/api/blog')


if __name__ == '__main__':
    config = dict(
        port=3000,
        host='0.0.0.0',
        debug=True,
    )
    app.run(**config)
