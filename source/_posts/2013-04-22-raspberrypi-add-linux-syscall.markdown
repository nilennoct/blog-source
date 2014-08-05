---
author: nilennoct
comments: true
date: 2013-04-22 12:10:43
layout: post
slug: raspberrypi-add-linux-syscall
title: 给RaspberryPi增加一个系统调用
wordpress_id: 265
categories:
- RaspberryPi
---

> 浙江大学嵌入式系统课程

**安装交叉编译工具，并设置NAS**

``` bash
sudo apt-get install gcc-arm-linux-gnueabi
cd ~
mkdir pi
sudo mount 192.168.0.4:/home/pi /home/neo/pi
```

详情见[搭建RaspberryPi的交叉编译环境](http://www.nilennoct.com/raspberrypi-cross-compile/)。

**下载Raspberry Pi的源码**

``` bash
# PC
cd ~/pi
mkdir kernel
cd kernel
git clone https://github.com/raspberrypi/linux.git
git clone https://github.com/raspberrypi/firmware.git
```

因为网络原因这一步耗时较长，需要耐心等待。也可以直接在github上下载zip压缩包自行解压，不过无论是使用RPi解压或是通过NAS解压速度都不快，可以考虑取下SD卡在PC上直接解压。
<!-- more -->

**提取原有的内核配置文件配置新内核**

```
# RPi
cd ~/kernel/linux
sudo zcat /proc/config.gz > .config
# PC
make ARCH=arm CROSS_COMPILE=/usr/bin/arm-linux-gnueabi- oldconfig
```

因为不需要修改内核配置，直接一路回车结束配置即可。

**增加新的系统调用**

- 在linux/arch/arm/kernel/目录下新建mysyscall.c文件，输入以下内容

``` c
#include <linux/kernel.h>
void hello(void) {
	printk("Hello world!\tFrom Neo\n");
}
```

- 在linux/arch/arm/kernel/call.S中添加新的系统调用，这里我替换的是原本为sys_ni_syscall的0x900000+223号系统调用，如下图所示。

![Lab_04_01](http://img.nilennoct.com/wp-content/uploads/2013/04/Lab_04_01.png)

- 修改arch/arm/kernel/目录下的Makeﬁle文件，在obj-y后面添加mysyscall.o，如下图。

![Lab_04_02](http://img.nilennoct.com/wp-content/uploads/2013/04/Lab_04_02.png)

**编译内核**

``` bash
# PC
make ARCH=arm CROSS_COMPILE=/usr/bin/arm-linux-gnueabi- -k
```

之所以选择交叉编译是因为RPi的主频和PC比起来相差太多，若是直接用RPi编译内核耗时太长了。

**编译新lib**

``` bash
# PC
cd ~/pi/kernel
mkdir modules
cd linux
make modules_install ARCH=arm CROSS_COMPILE=/usr/bin/arm-linux-gnueabi- INSTALL_MOD_PATH=../modules
```

**备份 firmware**

``` bash
# RPi
cd ~/kernel
mkdir firmware_ori
cd /boot
cp *.elf *.bin ~/kernel/firmware_ori
```

**更新内核、lib和firmware**

``` bash
# RPi
cd ~/kernel
sudo cp linux/arch/arm/boot/Image /boot/kernel_new.img
sudo cp modules/lib /
cd firmware/boot
sudo cp bootcode.bin fixup.dat fixup_cd.dat start.elf /boot
```

**修改RPi的配置文件/boot/config.txt**

``` bash
# RPi
sudo nano /boot/config.txt
```

在首行加上“kernel=kernel_new.img”即可。若原来已经存在了kernel字段，直接修改就可以了。

![Lab_04_03](http://img.nilennoct.com/wp-content/uploads/2013/04/Lab_04_03.png)

**重启，测试新内核**

``` bash
# RPi
sudo reboot
```

先看看原内核信息，如下图。

![Lab_04_04](http://img.nilennoct.com/wp-content/uploads/2013/04/Lab_04_04.png)

新内核信息如下图。

![Lab_04_05](http://img.nilennoct.com/wp-content/uploads/2013/04/Lab_04_05.png)

可以看到内核已经从3.2.27+升级到了3.6.11。

**测试新增加的系统调用**

- 编写测试文件hello.c，输入以下内容。

``` c
#include <stdio.h>
#define sys_hello() {__asm__ __volatile__ ("swi 0x900000+223\n\t");} while(0)

int main(void) {
	sys_hello();
	printf("Type \"dmesg | tail\" to see the result.\n");

	return 0;
}
```

- 编译运行，查看结果。

``` bash
# RPi
gcc hello.c -o hello
./hello
dmesg | tail
```

结果如下图。

![Lab_04_06](http://img.nilennoct.com/wp-content/uploads/2013/04/Lab_04_06.png)

在内核信息的最后一行可以看到我们的hello()函数已经成功执行了。
