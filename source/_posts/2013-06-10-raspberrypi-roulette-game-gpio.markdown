---
layout: post
title: "用Raspberry Pi制作简单的轮盘游戏机"
slug: "raspberrypi-roulette-game-gpio"
date: 2013-06-10 19:50
comments: true
categories: 
- RaspberryPi
---

> 浙江大学嵌入式系统课程

之前在Raspberry Pi上做了许多好玩的事情，但与物理计算却是一点关系也没有。所以这次我们来尝试用RPi做一个简单的轮盘游戏机。因为材料有限，“轮盘”将使用一个2位8段数码管模拟。

材料准备：

- Raspberry Pi
- 面包板一块
- 2位8段数码管一个
- 按钮2个
- 1K~10KΩ电阻2个
- 面包线+杜邦线若干

**在RPi上安装wiringPi**

使用串口或SSH连接RPi，输入以下命令安装wiringPi。

``` bash
$ cd /tmp/
$ git clone git://git.drogon.net/wiringPi
$ cd wiringPi
$ sudo ./build
```

安装完成后，你可以使用命令`gpio -v`测试wiringPi是否已经正确安装。
<!-- more -->
**连线**

RPi上的GPIO与wiringPi中的Pin的对应关系可以参看下表。

<table style="width: 450px;border: 1px solid #e7e7e7;">
<tbody>
<tr>
<th style="text-align: center;">wiringPi<br>
Pin</th>
<th style="text-align: center;">BCM<br>
GPIO</th>
<th style="text-align: center;">Name</th>
<th style="text-align: center;">Header</th>
<th style="text-align: center;">Name</th>
<th style="text-align: center;">BCM<br>
GPIO</th>
<th style="text-align: center;">wiringPi<br>
Pin</th>
</tr>
<tr>
<td style="text-align: center;">–</td>
<td style="text-align: center;">–</td>
<td style="text-align: center;"><span style="color: #ff0000;">3.3v</span></td>
<th style="text-align: center;">1 | 2</th>
<td style="text-align: center;" align="center"><span style="color: #ff6600;">5v</span></td>
<td style="text-align: center;" align="center">–</td>
<td style="text-align: center;" align="center">–</td>
</tr>
<tr>
<td style="text-align: center;">8</td>
<td style="text-align: center;">R1:0/R2:2</td>
<td style="text-align: center;"><span style="color: #33cccc;">SDA0</span></td>
<th style="text-align: center;">3 | 4</th>
<td style="text-align: center;"><span style="color: #ff6600;">5v</span></td>
<td style="text-align: center;">–</td>
<td style="text-align: center;">–</td>
</tr>
<tr>
<td style="text-align: center;">9</td>
<td style="text-align: center;">R1:1/R2:3</td>
<td style="text-align: center;"><span style="color: #33cccc;">SCL0</span></td>
<th style="text-align: center;">5 | 6</th>
<td style="text-align: center;"><span style="color: #000000;">0v</span></td>
<td style="text-align: center;">–</td>
<td style="text-align: center;">–</td>
</tr>
<tr>
<td style="text-align: center;">7</td>
<td style="text-align: center;">4</td>
<td style="text-align: center;"><span style="color: #008000;">GPIO7</span></td>
<th style="text-align: center;">7 | 8</th>
<td style="text-align: center;"><span style="color: #ffff00;">TxD</span></td>
<td style="text-align: center;">14</td>
<td style="text-align: center;">15</td>
</tr>
<tr>
<td style="text-align: center;">–</td>
<td style="text-align: center;">–</td>
<td style="text-align: center;"><span style="color: #000000;">0v</span></td>
<th style="text-align: center;">9 | 10</th>
<td style="text-align: center;"><span style="color: #ffff00;">RxD</span></td>
<td style="text-align: center;">15</td>
<td style="text-align: center;">16</td>
</tr>
<tr>
<td style="text-align: center;">0</td>
<td style="text-align: center;">17</td>
<td style="text-align: center;"><span style="color: #008000;">GPIO0</span></td>
<th style="text-align: center;">11 | 12</th>
<td style="text-align: center;"><span style="color: #008000;">GPIO1</span></td>
<td style="text-align: center;">18</td>
<td style="text-align: center;">1</td>
</tr>
<tr>
<td style="text-align: center;">2</td>
<td style="text-align: center;">R1:21/R2:27</td>
<td style="text-align: center;"><span style="color: #008000;">GPIO2</span></td>
<th style="text-align: center;">13 | 14</th>
<td style="text-align: center;"><span style="color: #000000;">0v</span></td>
<td style="text-align: center;">–</td>
<td style="text-align: center;">–</td>
</tr>
<tr>
<td style="text-align: center;">3</td>
<td style="text-align: center;">22</td>
<td style="text-align: center;"><span style="color: #008000;">GPIO3</span></td>
<th style="text-align: center;">15 | 16</th>
<td style="text-align: center;"><span style="color: #008000;">GPIO4</span></td>
<td style="text-align: center;">23</td>
<td style="text-align: center;">4</td>
</tr>
<tr>
<td style="text-align: center;">–</td>
<td style="text-align: center;">–</td>
<td style="text-align: center;"><span style="color: #ff0000;">3.3v</span></td>
<th style="text-align: center;">17 | 18</th>
<td style="text-align: center;"><span style="color: #008000;">GPIO5</span></td>
<td style="text-align: center;">24</td>
<td style="text-align: center;">5</td>
</tr>
<tr>
<td style="text-align: center;">12</td>
<td style="text-align: center;">10</td>
<td style="text-align: center;"><span style="color: #800080;">MOSI</span></td>
<th style="text-align: center;">19 | 20</th>
<td style="text-align: center;"><span style="color: #000000;">0v</span></td>
<td style="text-align: center;">–</td>
<td style="text-align: center;">–</td>
</tr>
<tr>
<td style="text-align: center;">13</td>
<td style="text-align: center;">9</td>
<td style="text-align: center;"><span style="color: #800080;">MISO</span></td>
<th style="text-align: center;">21 | 22</th>
<td style="text-align: center;"><span style="color: #008000;">GPIO6</span></td>
<td style="text-align: center;">25</td>
<td style="text-align: center;">6</td>
</tr>
<tr>
<td style="text-align: center;">14</td>
<td style="text-align: center;">11</td>
<td style="text-align: center;"><span style="color: #800080;">SCLK</span></td>
<th style="text-align: center;">23 | 24</th>
<td style="text-align: center;"><span style="color: #800080;">CE0</span></td>
<td style="text-align: center;">8</td>
<td style="text-align: center;">10</td>
</tr>
<tr>
<td style="text-align: center;">–</td>
<td style="text-align: center;">–</td>
<td style="text-align: center;"><span style="color: #000000;">0v</span></td>
<th style="text-align: center;">25 | 26</th>
<td style="text-align: center;"><span style="color: #800080;">CE1</span></td>
<td style="text-align: center;">7</td>
<td style="text-align: center;">11</td>
</tr>
<tr>
<th style="text-align: center;">wiringPi<br>
Pin</th>
<th style="text-align: center;">BCM<br>
GPIO</th>
<th style="text-align: center;">Name</th>
<th style="text-align: center;">Header</th>
<th style="text-align: center;">Name</th>
<th style="text-align: center;">BCM<br>
GPIO</th>
<th style="text-align: center;">wiringPi<br>
Pin</th>
</tr>
</tbody>
</table>

> 更多信息请参看[wiringPi Pins](https://projects.drogon.net/raspberry-pi/wiringpi/pins/)

了解了GPIO排布后，开始连接各个元件，连线结果如下图。

![Wire_IMG](http://img.nilennoct.com/wp-content/uploads/2013/06/Rolb.png)

> **需要注意的是，我们使用的面包板上的XY两行不是全部连通的，经我测试是分成了3-4-3三组，如果程序运行后不停地出现Start & Stop，请检查XY两行上的线是否在同一组内。**

**编写控制代码`roll.c`**

``` c roll.c
#include <wiringPi.h>
#include <stdio.h>
#include <stdlib.h>

#define DIGIT0 8
#define DIGIT1 9
#define BTN0 10
#define BTN1 11

int main() {
    int pin;
    int m = 0, n = 0;
    int flag = 1;
    int run = 0;
    unsigned int time0 = 0, time1 = 0;
    char digit[10][8] = {
        {0,0,0,0,0,0,1,1},
        {1,0,0,1,1,1,1,1},
        {0,0,1,0,0,1,0,1},
        {0,0,0,0,1,1,0,1},
        {1,0,0,1,1,0,0,1},
        {0,1,0,0,1,0,0,1},
        {0,1,0,0,0,0,0,1},
        {0,0,0,1,1,1,1,1},
        {0,0,0,0,0,0,0,1},
        {0,0,0,0,1,0,0,1}
    };
    char roll[6][8] = {
        {0,1,1,1,1,1,1,1},
        {1,0,1,1,1,1,1,1},
        {1,1,0,1,1,1,1,1},
        {1,1,1,0,1,1,1,1},
        {1,1,1,1,0,1,1,1},
        {1,1,1,1,1,0,1,1},
    };

    if (wiringPiSetup () == -1)
        exit (1) ;

    for (pin = 0 ; pin < 8 ; ++pin) {
        pinMode (pin, OUTPUT) ;
        digitalWrite(pin, HIGH);
    }

    pinMode(DIGIT0, OUTPUT);
    pinMode(DIGIT1, OUTPUT);
    pinMode(BTN0, INPUT);
    pinMode(BTN1, INPUT);

    while (1) {
        time1 = millis();

        if (digitalRead(BTN0) && run == 0) {
            puts("Start!");
            run = 1;
            m = 0;
            n = 0;
            time0 = millis();
        }
        else if (digitalRead(BTN1) && run == 1) {
            puts("Stop!");
            run = 0;
        }

        if (time1 - time0 >= 50 && run == 1) {
            time0 = time1;
            printf("%d\n", n);
            m = ++m % 6;
            n = ++n % 10;
        }

        for (pin = 0; pin < 8; pin++) {
            digitalWrite(pin, flag ? digit[n][pin] : roll[m][pin]);
        }

        digitalWrite(DIGIT0, flag);
        digitalWrite(DIGIT1, (flag = 1 - flag));
        delay(10);
    }

    return 0;
}
```

保存后执行以下命令编译并运行：

``` bash
$ gcc roll.c -o roll -lwiringPi
$ sudo ./roll
```

**测试结果**

在RPi上运行控制程序后，按一下连线图中左边的按钮，可以看到左边的数码管LED一次点亮如同旋转起来一般，右边的数码管则显示依次增大的数字，同时终端中同步输出当前显示的数字。若按一下右边的按钮则变化将停止。再按左边的按钮可以重新开始。

具体效果可观看视频^_^

<iframe height=480 width=640 src="http://player.youku.com/embed/XNTY5MTQ1ODg4" frameborder=0 allowfullscreen></iframe>

**部分原理说明**

- 按键处理

通常情况下，在使用按键时只需将按键的一端接到3.3V上，另一端接到GPIO口上，通过读取GPIO口的电压值就可以得到按键的通断状态。但在某些特殊环境下，仅仅是把手靠近开关就可能在GPIO上读到高电平，这是因为电路中没有下拉电阻，使得外界干扰影响了对按键的判断。

如下图所示是一个下拉电阻的常见接法。

![Pull_Down](http://img.nilennoct.com/wp-content/uploads/2013/06/btn_pull_down.png)

在GPIO口与GND之间接一个1K-10KΩ的电阻。当外界有干扰源的时候，干扰源在通向GND的过程中，会被电阻消耗掉，保证按键状态检测的准确性。

- 2位8段数码管的使用

实验中使用的是一个共阳极数码管，其内部电路如下图所示：

![Segment_Display_Line](http://img.nilennoct.com/wp-content/uploads/2013/06/dgt_sgmt_line.png)

另外此2位数码管的引脚位置如下图所示：

![Segment_Display_Pin](http://img.nilennoct.com/wp-content/uploads/2013/06/dgt_sgmt_pin.png)

连线时与内部电路对照着即可，其中5、10为两个数位的控制位，送入高电平时会点亮相应数位。需要注意的是引脚的顺序和数码管上LED的排布顺序不一致，连线时要注意。