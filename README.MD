本项目前端源码从[https://github.com/maotoumao/MusicFreeDesktop](https://github.com/maotoumao/MusicFreeDesktop)复制

项目初衷为方便大家快速的在自己的服务器或nas中搭建一个网页端的音乐播放器。

如有侵权问题，请联系作者。
### 编译运行方法
编译项目需要使用到nodejs和docker
```shell
make web
docker build -t music:v1 .

docker run -itd -p 18888:18888 --name music music:v1
```
### docker运行
```shell
docker run -itd --name music -p 18889:18888 hq2005001/music_free_web:v1.1
```
 
运行成功后，访问http://localhost:18888即可，如部署在服务器把ip修改成服务器ip即可。