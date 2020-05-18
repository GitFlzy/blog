import os


secret_key = b'h3\x84\x01\xf0z28b\xaeZpe\x16\xc4\xc0\x17\xa1\xbd\x14\xe5\xbf\x881'
salt_key = 'put1w6s='
# client_path = r'C:\Users\Lzy29\OneDrive\Documents\workspace\GitHub\blog\static\assets\blogImg'
client_path = r'\static\assets\blogImg'

image_path = r'/var/www/blog/static/assets/blogImg'
server_path = r'/static/assets/blogImg'
accept_user_file_type = ['jpg', 'png', 'gif']

mail_config = {
    'MAIL_SERVER': 'smtp.qq.com',
    'MAIL_PORT': 465,
    'MAIL_USE_TLS': False,
    'MAIL_USE_SSL': True,
    'MAIL_USERNAME': '624567300@qq.com',
    'MAIL_PASSWORD': 'bzocetmlylfybdji',
    'MAIL_DEBUG': True,
}
