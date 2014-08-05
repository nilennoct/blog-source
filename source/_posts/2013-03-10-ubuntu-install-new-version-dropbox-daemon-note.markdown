---
author: nilennoct
comments: true
date: 2013-03-10 10:02:10
layout: post
slug: ubuntu-install-new-version-dropbox-daemon-note
title: Ubuntu安装新版Dropbox的注意事项
wordpress_id: 237
categories:
- Note
---

之前的ubuntu图方便是直接用wubi装的，结果前两天手贱把disk.img给误删了，无奈之下，干脆就重装了（可惜我配好的环境啊T T）。

分区、安装什么的都很顺利，PPA软件源我直接用Ubuntu Tweak管理了，确实很方便。不过在安装Dropbox的时候倒是遇到了一些麻烦。

Dropbox官网上提供的下载只不过是一个空壳而已，安装后需要使用如下命令安装daemon。

``` bash
dropbox start -i
```

但是由于国内某些特殊原因，需要下载的内容无法直接下载。而因为SSL证书的问题，使用goagent也无法安装。于是提取了[下载地址](https://dl-web.dropbox.com/u/17/dropbox-lnx.x86-1.6.17.tar.gz)通过浏览器直接下载到了安装包dropbox-lnx.x86-1.6.17.tar.gz。

按照以前的安装方式，直接解压到~目录，运行.dropbox-dist目录下的dropbox文件即可。不过这次的新版似乎有所不同，之前这样使用都可以开机自动运行，通过dropbox start命令也可以正常启动。但这次dropbox start却一直提示未安装，看来新版的dropbox daemon的安装还是有变化的= =
<!-- more -->

用编辑器直接打开/usr/bin/dropbox（这其实就是个python文件），可以看到以下内容

``` python
PARENT_DIR = os.path.expanduser("/var/lib/dropbox")
DROPBOXD_PATH = "%s/.dropbox-dist/dropboxd" % PARENT_DIR

......

def start_dropbox():
	db_path = os.path.expanduser(DROPBOXD_PATH).encode(sys.getfilesystemencoding())
	if os.access(db_path, os.X_OK):
		f = open("/dev/null", "w")
		# we don't reap the child because we're gonna die anyway, let init do it
		a = subprocess.Popen([db_path], preexec_fn=os.setsid, cwd=os.path.expanduser("~"),
							 stderr=sys.stderr, stdout=f, close_fds=True)

		# in seconds
		interval = 0.5
		wait_for = 60
		for i in xrange(int(wait_for / interval)):
			if is_dropbox_running():
				return True
			# back off from connect for a while
			time.sleep(interval)

		return False
	else:
		return False

......

@command
def start(argv):
	u"""start dropboxd
dropbox start [-i]

Starts the dropbox daemon, dropboxd. If dropboxd is already running, this will do nothing.

options:
  -i --install  auto install dropboxd if not available on the system
"""

	should_install = "-i" in argv or "--install" in argv

	# first check if dropbox is already running
	if is_dropbox_running():
		if not grab_link_url_if_necessary():
			console_print(u"Dropbox is already running!")
		return

	console_print(u"Starting Dropbox...", linebreak=False)
	console_flush()
	if not start_dropbox():
		if not should_install:
			console_print()
			console_print(u"The Dropbox daemon is not installed!")
			console_print(u"""Run \"dropbox start -i\" to install the daemon""")
			return

		# install dropbox!!!
		try:
			args = [ "pkexec", "dropbox" ]
			if "http_proxy" in os.environ:
				args.extend(["--http-proxy", os.environ["http_proxy"]])
			args.append("update")
			status = os.spawnvp(os.P_WAIT, "pkexec", args)
			if status != 0:
				console_print(u"The installation of Dropbox failed.")
				return
		except:
			pass
		else:
			if GUI_AVAILABLE:
				start_dropbox()
				console_print(u"Done!")
			else:
				if start_dropbox():
					if not grab_link_url_if_necessary():
						console_print(u"Done!")
	else:
		if not grab_link_url_if_necessary():
			console_print(u"Done!")
```

很容易发现这个dropbox daemon的安装位置已经改为了/var/lib/dropbox。将.dropbox-dist移过来，重新运行dropbox start，这下Dropbox就可以正常启动了，注销后重新登录也能自动启动了。
