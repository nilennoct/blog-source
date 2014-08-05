---
author: nilennoct
comments: true
date: 2013-03-02 10:36:38
layout: post
slug: find-raspberrypi-in-lan
title: 在局域网内查找RaspberryPi
wordpress_id: 169
categories:
- RaspberryPi
---

> 浙江大学嵌入式系统课程

使用路由器连接Raspberry Pi，可以很容易的使用SSH登录管理Raspberry Pi，不过这首先需要知道RPi在路由器上分配到的IP地址。

比较简单的方法就是进入路由器的管理界面，在DHCP客户端列表查找以“b8:27:eb”开始的MAC地址，如下图所示；

![Task_06_01](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_06_01.png)

此外，我们也可以通过编写脚本自动扫描所在局域网内的所有IP，然后从ARP表中寻找符合条件的MAC地址和IP。

以BAT脚本为例。
<!-- more -->

新建一个“Find_my_RPi.bat”文件，输入以下内容后保存。


``` bat
@echo off
:: Author: Neo He
color 0a
title Find my RPi [Neo He]
cls
:: Find your IP in LAN.
for /f "tokens=2 delims=:" %%i in ('"ipconfig | findstr /i /r "IPv4.*192\.168\.[0-9]*\.[0-9]*""') do set m=%%i
for /f "tokens=1,2,3 delims=." %%i in ("%m%") do set ip=%%i.%%j.%%k.
:: Ping all IP in your LAN.
for /l %%i in (1,1,255) do ping -w 100 -n 1 %ip%%%i
cls
echo.Find my RPi:
:: Look for MAC of RPi.
for /f "usebackq tokens=1,2" %%i in (<code>"arp -a | find "b8-27-eb""</code>) do (
echo. ------------------------------
echo.  RPi's IP: %%i
echo.  RPi's MAC: %%j
)
echo. ------------------------------
echo.
pause
```

运行后结果如下图所示。

![Task_06_02](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_06_02.png)
