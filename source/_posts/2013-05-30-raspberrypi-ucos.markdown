---
layout: post
title: "Raspberry Pi上μC/OS II的移植"
slug: raspberrypi-ucos
date: 2013-05-30 20:30
comments: true
categories:
- RaspberryPi 
---

**下载μCOS II for Raspberry Pi源码，修改makefile文件**

　　根据自己使用的交叉编译工具链，修改源码根目录下的`makefile`文件，主要修改的地方有如下两处：

```
ARMGNU ?= arm-linux-gnueabi

INCLUDEPATH ?= "./h"
```

**检查源码错误**

　　不知道助教是不是有意“增加”实验难度，这次提供的源码中存在不少小错误，比如`makefile`文件的第59行的`ucos_bcm2835.elf`最后多了一个“.”、没有注意文件名大小写（这个与操作系统有关）等。这步可以通过执行`make`命令找出错误的地方，很快就能解决。
<!-- more -->
**修改usrApp/userApp.c文件**

　　这次实验的要求除了移植μCOS到RPi上以外，还要求实现两个任务的调度。这两个任务能轮流点亮LED，并通过串口发送消息表明自己正在运行。调度和通过串口发消息已经在提供的代码中实现了，主要要做的就是点亮LED了。

　　这里我直接使用了RPi板子上LED即ACT灯，对应的GPIO号是16。代码如下：

``` c
#include "uart.h"
#include "ucos/includes.h"
extern void PUT32 ( unsigned int, unsigned int );

#define GPSET0     0x2020001C
#define GPCLR0     0x20200028

void userApp2(void * args) {
	int count = 4;

	while(1) {
		if (count >= 4) {
			PUT32(GPSET0, 1 << 16); // 16是因为LED的GPIO地址为16.
			count = 0;
		}
		uart_string("in userApp2");
		OSTimeDly(100);
		count++;
	}
}

void userApp1(void * args) {
	int count = 0;

	while(1) {
		if (count >= 6) {
			PUT32(GPCLR0, 1 << 16);
			count = 2;
		}
		uart_string("in userApp1");
		OSTimeDly(100);
		count++;
	}
}
```

　　这里说明一下，之所以加入count变量是因为我发现，如果直接对GPIO设置电平值，LED会亮起很短的时间然后马上变暗，无法实现闪烁的效果。

**替换kernel.img**

　　编译内核并复制到SD卡中，上电开机，可以看到ACT灯开始闪烁了，同时在minicom中也能看到两个任务的输出信息。

![Lab_06_01](http://img.nilennoct.com/wp-content/uploads/2013/05/Lab_06_01.png)