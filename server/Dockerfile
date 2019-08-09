# FROM node
FROM node:current-alpine
# 创建应用目录
RUN mkdir -p /usr/node/server
# 设置工作目录
WORKDIR /usr/node/server
# 复制所有文件到工作目录
COPY . /usr/node/server
# 编译运行node项目
# RUN npm install
# 运行命令
CMD ["npm", "start"]