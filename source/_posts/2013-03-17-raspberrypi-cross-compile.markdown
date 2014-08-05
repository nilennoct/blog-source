---
author: nilennoct
comments: true
date: 2013-03-17 17:05:47
layout: post
slug: raspberrypi-cross-compile
title: 搭建RaspberryPi的交叉编译环境
wordpress_id: 247
categories:
- RaspberryPi
---

> 浙江大学嵌入式系统课程


**安装交叉编译工具**

``` bash
sudo apt-get install gcc-arm-linux-gnueabi
```

![Lab_02_01](http://img.nilennoct.com/wp-content/uploads/2013/03/Lab_02_01.png)

**编写测试程序hello.c并编译**

``` bash
arm-linux-gnueabi-gcc hello.c
```

<!-- more -->
![Lab_02_02](http://img.nilennoct.com/wp-content/uploads/2013/03/Lab_02_02.png)

**通过scp命令上传编译好的文件到RPi**

``` bash
scp a.out pi@192.168.0.4:~/coding/c
```

![Lab_02_03](http://img.nilennoct.com/wp-content/uploads/2013/03/Lab_02_03.png)

测试结果如下图所示。

![Lab_02_04](http://img.nilennoct.com/wp-content/uploads/2013/03/Lab_02_04.png)

4. 开启NFS服务

每次上传文件都要用scp显然太麻烦了，所以可以开启NFS服务直接访问RPi。

在RPi上的NFS服务端添加/home/pi，重新启动nfs-kernel-server（详细方法见“[RaspberryPi搭建NAS之中文兼容性检测](http://www.nilennoct.com/raspberrypi-nas-chinese-encode-samba-sftp-dlna-nfs/)”第4部分）。

在ubuntu中执行以下命令：

``` bash
cd ~
mkdir pi
sudo mount 192.168.0.4:/home/pi /home/neo/pi
```

![Lab_02_05](http://img.nilennoct.com/wp-content/uploads/2013/03/Lab_02_05.png)

5. 编写float.c并编译

``` bash
arm-linux-gnueabi-gcc -o float float.c
```

![Lab_02_06](http://img.nilennoct.com/wp-content/uploads/2013/03/Lab_02_06.png)

在RPi上运行float查看运行结果。

![Lab_02_07](http://img.nilennoct.com/wp-content/uploads/2013/03/Lab_02_07.png)
