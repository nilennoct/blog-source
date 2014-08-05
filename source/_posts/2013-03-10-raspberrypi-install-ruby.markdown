---
author: nilennoct
comments: true
date: 2013-03-10 11:14:53
layout: post
slug: raspberrypi-install-ruby
title: 在RaspberryPi上安装Ruby
wordpress_id: 239
categories:
- RaspberryPi
---

> 浙江大学嵌入式系统课程



**安装Ruby**

``` bash
sudo apt-get install ruby
```

![Task_13_01](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_13_01.png)

**安装ri文档查阅工具**

``` bash
sudo apt-get install ri
```

![Task_13_02](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_13_02.png)
<!-- more -->

**体验Ruby**

使用irb交互式环境。

``` bash
irb
```

运行irb交互式环境后，即可开始ruby编程了。退出irb可以用Ctrl+D。

![Task_13_03](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_13_03.png)

使用文件运行Ruby

新建一个文件hello.tb，输入以下内容。

``` ruby
def h(name)
	puts "Hello #{name}"
end

if __FILE__==$0
	if ARGV[0] == nil
		puts "Hello world!"
	else
		h(ARGV[0])
	end
end
```

在命令行输入如下命令，查看结果。

``` bash
ruby hello.rb
ruby hello.rb Neo
```

![Task_13_04](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_13_04.png)

c) 使用ri查看文档。

``` bash
# For example
ri Array
ri NilClass
```

![Task_13_05](http://img.nilennoct.com/wp-content/uploads/2013/03/Task_13_05.png)
