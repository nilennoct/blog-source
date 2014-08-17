---
author: nilennoct
comments: true
date: 2013-03-08 17:24:25
layout: post
slug: raspberrypi-install-dhcp-server
title: 在RaspberryPi上安装DHCP服务器
wordpress_id: 231
categories:
- RaspberryPi
---

> 浙江大学嵌入式系统课程

**确定DHCP服务端软件**

``` bash
dpkg --list | grep dhcp
```

![Task_11_01](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_11_01.png)

由图中可知道，RPi默认安装的dhcp客户端是isc-dhcp-client，不难想到对应的服务端应该是isc-dhcp-server。
<!-- more -->

**安装isc-dhcp-server**

``` bash
sudo apt-get install isc-dhcp-server
```

如下图这样，安装完初次启动服务失败是正常的，因为此时尚未对其进行配置。

![Task_11_02](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_11_02.png)

**配置DHCP服务器**

使用ifconfig命令，可以看到RPi只有eth0一个网卡，接下来就要把DHCP服务器绑定在eth0上。
编辑/etc/default/isc-dhcp-server文件，修改

```
INTERFACES="eth0"
```

编辑/etc/dhcp/dhcpd.conf文件，按如下内容修改

```
subnet 192.168.0.0 netmask 255.255.255.0 {
	range 192.168.0.100 192.168.0.254;
	option domain-name-servers 8.8.8.8; #Google的公共DNS
	option domain-name "Neo DHCP";
	option routers 192.168.0.1;
	option broadcast-address 192.168.0.255;
	default-lease-time 600;
	max-lease-time 7200;
}
```

启动DHCP服务器

``` bash
sudo service isc-dhcp-server start
```

**测试效果**

下图是笔记本尚未连接RPi时ifconfig的输出结果，注意eth0。

![Task_11_03](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_11_03.png)

下图是笔记本连接了RPi后ifconfig的输出结果，可以看到eth0已经按我们配置的那样顺利获取到了IP。

![Task_11_04](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_11_04.png)

至此RPi上DHCP的配置就告一段落了。
