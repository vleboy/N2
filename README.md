# 1、安装nginx
yum install yum-utils

vi /etc/yum.repos.d/nginx.repo

[nginx-stable]
name=nginx stable repo
baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key

[nginx-mainline]
name=nginx mainline repo
baseurl=http://nginx.org/packages/mainline/centos/$releasever/$basearch/
gpgcheck=1
enabled=0
gpgkey=https://nginx.org/keys/nginx_signing.key

yum-config-manager --enable nginx-mainline
yum install nginx

systemctl start nginx

# 2、安装nodejs和pm2
curl -sL https://rpm.nodesource.com/setup_12.x | bash -
yum install nodejs
npm i pm2 -g

# 3、安装docker
yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2

yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

yum install docker-ce docker-ce-cli containerd.io

systemctl start docker

# 4、安装docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

chmod +x /usr/local/bin/docker-compose

# 5、安装certbot
yum install https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
yum-config-manager --enable rhui-REGION-rhel-server-extras rhui-REGION-rhel-server-optional

# 可选修复
pip install requests urllib3 pyOpenSSL --force --upgrade
pip install --upgrade --force-reinstall 'requests==2.6.0'

yum install certbot python2-certbot-nginx


docker run -it --rm --name certbot \
            -v "/etc/letsencrypt:/etc/letsencrypt" \
            -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
            certbot/certbot --nginx


# 6、安装git
rpm -ivh https://centos7.iuscommunity.org/ius-release.rpm

# 7、安装应用
cd /usr/local/
git clone https://github.com/vleboy/N2.git

# 免密拉取
cd /usr/local/N2/ && vi .git/config
[credential]
     helper = store
cd server

# 持续构建和容器应用
pm2 start ci.js -n ci
npm i && npm run compose-up
npm run mongo-rs
npm run mongo-in
npm run logs
<!-- use admin
db.createUser({user:"root",pwd:"Ab123456",roles:[{role:"root",db:"admin"}]}) -->

# 调整最大tcp连接量
ulimit -n

# 数据库备份与还原
1、在远程主机的 N2/server目录下执行npm run mongo-dump
2、在本地主机的 project/aws目录下执行 ./scpn2.sh
3、在本地主机的 N2/server目录下执行npm run mongo-restore