---
author: nilennoct
comments: true
date: 2012-07-21 22:10:07
layout: post
slug: vmware7-mac-xcode
title: VMware7安装Mac+Xcode
wordpress_id: 80
categories:
- Note
---

最近给笔记本加了一条内存，达到了6G内存，所以之前想装Mac OS的想法又冒了出来。之前也试着用VMware装过一次Mac,但因为内存和版本的原因一直装不了Xcode，只得作罢。这次接着加内存的东风，就再尝试了一次，虽然中途遇到了很多的问题，但最终倒都是成功解决了，一下说说过程吧。

准备工作：

- Mac OS X Snow Leopard 10.6.6 （[Torrent下载](http://adf.ly/AxlxV)）
- Empire EFI引导盘 （[ISO下载](http://adf.ly/AxmMA)）
- VMware Tools （[下载](http://adf.ly/AzPgo)）

我这里用的是Hazard制作的破解版MacOS，一共9个分卷外加一个IOATAFamily补丁，约3.3G，包括了大部分破解驱动。
<!-- more -->

安装过程：

1. 打开VMware，新建虚拟机，类型选择FreeBSD 64-bit，磁盘大小30G以上（因为要装Xcode），内存1G+，我选了2G（这里会有问题，稍后再说），可以把软驱删了，打开3D图形加速。


2. 进入虚拟机所在目录，打开“.vmx”文件，找到guestOS = 这行，把它后面双引号""里的内容改为darwin10，改后即为：
guestOS = "darwin10"。保存。


3. 重启VMware，这次可以看到虚拟机设置中的版本变成了“Mac OS X Server 10.6”。此时载入MacOS的安装镜像，准备安装。


4. 启动虚拟机，进入安装界面，选择完语言后，选择实用工具 -> 磁盘工具，点击左侧硬盘，点击抹掉标签页，类型选择“Mac OS扩展（日志式）”，点击抹掉（其实就是格式化硬盘）。然后按默认安装吧，大概半个多小时，安装完要重启。看网上很多人说装完后会提示安装失败，但是我倒是提示的是安装成功，可能是版本的关系吧。


5. 虚拟机关闭后别急着启动，把光驱装载的镜像换成Empire EFI引导盘（其实Mac安装镜像也带了引导功能，但不知道为什么我的虚拟机引导不起= =），然后再启动虚拟机，稍候片刻，就可以看到经典的极光壁纸了。系统若是英文可以到System Preference -> Language & Text，把简体中文拖到最上方注销再登录即可。

	![](http://img.nilennoct.com/wp-content/uploads/2012/07/MacOSX1.jpg)

6. 别急，还有一步。找到下载的VMware Tools，在Mac OS执行安装，可以让系统自动切换分辨率以及启用共享文件夹等功能。貌似声卡还有些问题，发不了声，我也还在寻找解决办法。

还记得之前说的内存问题吗？我设置了2G的内存，但是在“关于本机”中显示的却是1G= =这其实是EFI引导盘的原因，需要修改引导盘（如果不需要1G以上内存请忽略）。

先下载[TransMac](http://adf.ly/AxsjN)，用TransMac打开EFI引导盘，找到Preboot.dmg（如下图）。
![](http://img.nilennoct.com/wp-content/uploads/2012/07/transmac1.jpg)

在Preboot.dmg上点右键 -> Copy to，保存到任意目录，再用TransMac打开刚保存的Preboot.dmg，找到com.apple.Boot.plist，用同样方法导出后打开，可以看到以下内容：

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>Kernel</key>
	<string>rd(0,0)/Extra/mach_kernel.test7</string>
	<key>Kernel Flags</key>
	<string>maxmem = 1024 cpus = 1</string>
	<key>Legacy Logo</key>
	<string>No</string>
	<key>SMBIOS</key>
	<string>rd(0,0)/Extra/smbios.plist</string>
</dict>
</plist>
```
将 maxmem = 1024 cpus = 1 中的“maxmem = 1024”删除，如果要在虚拟机中使用多核CPU就把“cpus = 1”也删去。不过最好是加上-f参数，经测试删去后可能会造成卡在启动界面而无法启动。

这里给出修改后的内容：

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>Kernel</key>
	<string>rd(0,0)/Extra/mach_kernel.test7</string>
	<key>Kernel Flags</key>
	<string>-f</string>
	<key>Legacy Logo</key>
	<string>No</string>
	<key>SMBIOS</key>
	<string>rd(0,0)/Extra/smbios.plist</string>
</dict>
</plist>
```

编辑完保存com.apple.Boot.plist，将其拖入TransMac中打开的Preboot.dmg，选择覆盖。然后回到打开的EFI引导盘，删除原来的Preboot.dmg，把导出的Preboot.dmg文件（即修改后的文件）拖入，可能会提示超过容量，不必理会继续便是。这样修改过再启动就可以使用设置的内存大小了。

Note: TransMac没有保存选项，把文件拖入后会自动保存。

接下来说说Xcode的安装。我下载的是Xcode4.2，只能安装在10.6.7及以上系统= =。最好的方法就是下载Hazard提供的10.6.6到10.6.7的升级包（用的网盘是HotFile，要翻墙。可以考虑到淘宝上淘一个HotFile的会员账号，0.77元，多进程满速下载）。还有一个方法就是修改系统版本号。

打开终端，输入以下命令：

``` bash
sudo -s
cd /System/Library/CoreServices/
vi SystemVersion.plist
```

Note 1: 输入sudo -s后会提示输入密码，输入时没有字符显示，直接输入便是。

Note 2: 输入vi SystemVersion.plist后进入Vi编辑器，按键“i”进入编辑模式，找到两个“10.6.6”改成“10.6.7”，按Esc，输入“:w!”回车强制保存，输入“:q”回车退出。此时看看关于本机是不是10.6.7了？

安装Xcode前记得把系统日期改成2012-01-01，否则安装时会出现未知错误强制退出，似乎是因为证书过期了。

P.S. 另外系统自带的中文包似乎不完整，很多地方都还是英文= =介意的话可以找相应版本的中文包。
