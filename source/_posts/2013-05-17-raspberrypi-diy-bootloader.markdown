---
layout: post
title: "用于Raspberry Pi的简易bootloader"
slug: raspberrypi-diy-bootloader
date: 2013-05-17 13:16
comments: true
categories:
- RaspberryPi
---

> 浙江大学嵌入式系统课程

这是一次痛并快乐着的实验。

以下引用实验要求：

> David Welch的 [GitHub](https://github.com/dwelch67/raspberrypi) 的`bootloader05`给出了一个非常简单的RPi bootloader，他的代码链接在内存的0x00020000位置，一直在监听串口是否有XMODEM协议的文件下载，如果有就开始接收数据，并复制到0x00008000位置，传输完成后跳转到 0x00008000去执行。

> TA写了一个Python脚本，按照下面的命令调用脚本可以下载并执行用户程序`python xmodem-loader.py -p com3 -b 115200 output.bin`

> 你的任务是修改bootloader和python脚本实现如下功能：

> 调用命令`python xmodem-loader.py -p com3 -b 115200`启动脚本并且与板卡建立串口连接，之后可以发送下面的命令。

> 		load *.bin 下载程序*.bin
> 		go 执行已下载的程序
> 		peek addr 以一个字为单位读取内存中addr位置的数据（addr是4字节对齐，十六进行的形式，长度为8，例如 0x00008000），并以十六进制的形式输出
> 		poke addr data 以一个字为单位修改内存中addr位置的数据为data（addr是4字节对齐，十六进行的形式，长 度为8， data也是十六进行的形式，长度为8）
> 		verify *.bin 验证已下载的程序和*.bin是否完全相同。
<!-- more -->
**获取`bootloader05`的源码**

```bash
$ cd ~
mkdir pi
cd pi
git clone git@github.com:dwelch67/raspberrypi.git
cd raspberrypi
```

**简要分析`bootload05.c`**

这个bootloader确实很短，不过想弄明白还是得花点时间的。其主要思想就是用状态机控制数据的传输过程，简单来说就像下面这样：

![Bootloader05_Origin](http://img.nilennoct.com/wp-content/uploads/2013/05/bootloader05.origin.png)

可以看到传输过程中先发送一个`0x01`,即`SOH(start of headline)`，然后分别检查第二次和第三次接收到的数据是否为`block`和`255-block`，`block`为当前块号，通过后就开始接收128位的数据流，最后在`Statue 131`检查CRC的值。另外，在数据全部传输完成后bootloader会收到一个`0x04`信号，即`EOT (end of transmission)`，此时bootloader会跳转到0x00008000去执行下载的程序。

弄清楚流程后修改就容易多了，为了区分指令类型我在第一个号后添加了一个指令信号，状态机如下图所示：

![Bootloader05_Neo](http://img.nilennoct.com/wp-content/uploads/2013/05/bootloader05.neo_.png)

也就是把133-136这几个状态作为`PEEK`和`POKE`的`addr`，137-140作为`POKE`的`data`.

另外原本的bootloader05对`0x04`这一信号的判定是放在状态机外的，总让人觉得不舒服，我就把它也合并到了`State 0`状态中去判断了。

**`xmodem-loader.py`的修改**

没学过Python的表示压力山大，所幸TA提供的`xmodem-loader.py`已经把关键的数据传输部分写好了，剩下的就是写一个能够接受用户输入，并对Raspberry Pi作出相应请求的控制器就好了（说的这么厉害其实还不就是`while True`= =）

**效果演示**

- load & verify

![Lab_05_01](http://img.nilennoct.com/wp-content/uploads/2013/05/Lab_05_01.png)

- peek & poke

![Lab_05_02](http://img.nilennoct.com/wp-content/uploads/2013/05/Lab_05_02.png)

- re-verify

![Lab_05_03](http://img.nilennoct.com/wp-content/uploads/2013/05/Lab_05_03.png)

- go

![Lab_05_04](http://img.nilennoct.com/wp-content/uploads/2013/05/Lab_05_04.png)


**程序源码**

因为代码实在太长了，就不贴在这篇博文里了，有兴趣的可以点 [这里](/raspberrypi-diy-bootloader-source/) 查看。

**补充内容**

- 编译`kernel.img`和`blinker.bin`

	进入`bootloader05`目录，编辑Makefile第一行，修改ARMGNU为你使用的交叉编译器，如`ARMGNU ?= arm-linux-gnueabi`，保存后执行`make`命令。

	另外据同学反应在ubuntu 12.04及以下版本可能会出现`arm-linux-gnueabi-as`错误。目前已知的解决方案是升级系统（别打我）。

- 找不到blinker.bin，python脚本提示 "file not exist"

	确保blinker.bin与脚本在同一目录下。找不到blinker.bin的请先编译`kernel.img`和`blinker.bin`。