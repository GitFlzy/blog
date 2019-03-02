#!/bin/bash

configs_path="/var/www/blog/configs/"
nginx_path="/etc/nginx/sites-enabled/"
supervisor_path="/etc/supervisor/conf.d/"

supervisor_conf="supervisor.blog.conf"
nginx_conf="blog.nginx"
gunicorn_conf="gunicorn.blog.py"


# 确认 gunicorn 的配置文件
cd ${configs_path}
if [ ! -f ${gunicorn_conf} ]; then
    echo "gunicorn 配置文件不存在"
else
    echo "gunicorn 配置文件存在"
fi

cd ~

echo "建立 supervisor 的启动配置"
sup_source=${configs_path}${supervisor_conf}
sup_destination=${supervisor_path}${supervisor_conf}
ln -s ${sup_source} ${sup_destination}

# 查看 supervisor 的软连接有没有建立成功
cd $supervisor_path
if [ ! -f ${supervisor_conf} ]; then
    echo "supervisor 软链接文件建立失败"
else
    echo "supervisor 软链接文件成功建立"
fi


echo "建立 nginx 软链接"
ngx_source=${configs_path}${nginx_conf}
ngx_destination=${nginx_path}${nginx_conf}
ln -s ${ngx_source} ${ngx_destination}

# 查看 nginx 的软连接有没有建立成功
cd ${nginx_path}
if [ ! -f ${nginx_conf} ]; then
    echo "supervisor 软连接文件建立失败"
else
    echo "supervisor 软连接文件成功建立"
fi


echo "重启 supervisor 程序"
service supervisor restart
echo "已 重启 supervisor"
