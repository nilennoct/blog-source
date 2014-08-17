---
author: nilennoct
comments: true
date: 2013-03-05 15:08:18
layout: post
slug: raspberrypi-nas-samba-sftp
title: 在RaspberryPi上搭建NAS
wordpress_id: 206
categories:
- RaspberryPi
---

> 浙江大学嵌入式系统课程

给RPi连接上移动硬盘，可以很方便的将其变为NAS（Network Attached Storage）供远程使用。

**连接移动硬盘**

在连接移动硬盘时遇到了一点问题，就是RPi的USB输出功率太小，即使移动硬盘的数据口和供电口（在同一条USB线上）都插在RPi上也依然带不动移动硬盘。最后我把移动硬盘的供电口插在了笔记本上移动硬盘才能正常使用。

所在若是你在连接移动硬盘后无法在/dev目录中找到设备，请检查移动硬盘供电是否充足。

因为我是通过ssh连接RPi的，接上移动硬盘后RPi并没有自动挂载。输入如下命令挂载。

``` bash
sudo mkdir /media/NAS
sudo mount -o uid=pi,gid=pi /dev/sda5 /media/NAS
```
<!-- more -->

现在就可以在/media/NAS目录下看到移动硬盘中的内容了（为方便我只挂载了一个分区）。

![Task_07_02](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_07_02.png)

从图上可以看到一个warning：“/media/NAS seems to be mounted read-only”。这是因为挂载的这个分区NTFS格式的。若要可读可写，可以安装ntfs-3g来实现。

``` bash
sudo apt-get install ntfs-3g
sudo mount -t ntfs-3g -o uid=pi,gid=pi /dev/sda5 /media/NAS
```

若要实现开机自动挂载移动硬盘，可以修改/etc/fstab文件

``` bash
sudo vim /etc/fstab
```

添加如下内容：

```
/dev/sda5 /media/NAS auto defaults,noexec,umask=0000 0 0
```

然后重启即可。

---

**通过Samba访问。**
Samba，是种用来让UNIX系列的操作系统与微软Windows操作系统的SMB/CIFS（Server Message Block/Common Internet File System）网络协定做连结的自由软件。目前的版本（v3）不仅可存取及分享SMB的资料夹及打印机，本身还可以整合入Windows Server的网域，扮演为网域控制站（Domain Controller）以及加入Active Directory成员。简而言之，此软件在Windows与UNIX系列OS之间搭起一座桥梁，让两者的资源可互通有无。
下面就来说说如何在RPi上安装并使用Samba。

- 安装Samba，并把把系统默认用户 pi 添加到 samba

``` bash
sudo apt-get install samba samba-common-bin
sudo smbpasswd -a pi
```

- 修改Samba的配置文件：/etc/samba/smb.conf，在最后加上以下内容

```
[NAS]
comment = NAS
public = yes
path = /media/NAS    # 根据实际情况填写
valid users = pi
read only = no
```

![Task_07_04](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_07_04.png)

- 重启Samba服务

``` bash
sudo service samba restart
```

- 使用windows连接RPi

按快捷键Win+R或者打开资源管理器，访问”\\IP”，如下图所示。

![Task_07_06](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_07_06.png)

根据提示输入用户名和密码（必须是使用sampasswd添加过的账户）登录，即可看到移动硬盘中的内容了。

![Task_07_09](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_07_09.png)

---

**通过SFTP访问。**
SFTP（SSH File Transfer Protocol）是一种基于SSH的文件传输协议，透过SSH 2.0 的扩充提供安全档案传输能力。因为RPi默认已经开启了SSH，所以我们可以直接使用。

以WinSCP为例。

- 打开WinSCP，点击右上角的新建按钮，填入服务器信息；

![](http://img.nilennoct.com/wp-content/uploads/2013/03/Unnamed-QQ-Screenshot20130301234118.png)

- 输入完毕后点击保存，（可以选择保存密码），选择刚刚新建的会话，点击登录；

![](http://img.nilennoct.com/wp-content/uploads/2013/03/Unnamed-QQ-Screenshot20130301222639.png)

- 定位到/media/NAS目录，即可查看到移动硬盘中的内容。

![Task_07_12](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_07_12.png)

---

通过DLNA访问。

- 安装minidlna

``` bash
sudo apt-get install minidlna
```

- 编辑minidlna的配置文件 /etc/minidlna.conf

找到“media_dir”项，修改为移动硬盘的挂载点，比如我的/media/NAS。

- 重启minidlna服务

``` bash
sudo service minidlna restart
```

- 在浏览器里输入"IP:8200"，查看服务器状态（8200为默认端口）。

![Task_07_13](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_07_131.png)
