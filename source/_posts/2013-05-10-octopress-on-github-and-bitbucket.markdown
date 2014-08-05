---
layout: post
title: "Octopress搭建小记"
slug: install-octopress-on-github-and-bitbucket
date: 2013-05-10 14:05
comments: true
categories:
- Note
---

偶然看到了[Octopress](http://octopress.org/)的介绍，我便被它惊人的载入速度和独特的离线写作模式吸引了。虽然之前的Wordpress使用的也挺不错的，但细想之下其实我还真用不到那么多功能，顿时让我有了把博客迁移到Octopress上的冲动。

网络上关于Octopress的部署教程已经有很多了，一种不错的方案是使用[Github Pages](http://pages.github.com/)服务。不过考虑到数据的安全性（比如`_config.yml`、一些第三方服务的API Key等），我决定同时使用Bitbucket和Github，即使用Bitbucket的私有Repo管理source，使用Github管理生成的页面。

Ruby环境的搭建以及Octopress的安装方法可以在Octopress的文档中找到，这里主要记录部署过程(Ubuntu环境)。

> [Octopress Documentation](http://octopress.org/docs/)

<!-- more -->

首先登陆Bitbucket，选择`Import repository`（亦可依次按下`i`、`r`），填写Github上Octopress的项目地址：

```
URL: git@github.com:imathis/octopress.git
Name: octopress
```

接下来登陆Github，以`github_username.github.io`为Repository name建立一个新的repo，这个将用来存放博客页面。

> 详见 [User, Organization and Project Pages](https://help.github.com/articles/user-organization-and-project-pages)

接下来clone刚建立的repo到本地。

``` bash
$ cd ~
$ git clone git@bitbucket.org:bitbucket_username/octopress.git octopress
$ cd octopress
$ git remote add octopress https://github.com/imathis/octopress
```

最后一条命令将Github上的官方repo添加到当前git配置中，以后可以用来升级Octopress系统。

按官方文档的方法安装好Octopress，执行以下命令。

``` bash
$ rake generate
$ rake deploy
```

Octopress会自动生成一个`_deploy`文件夹，里面存放的就是用来发布到Github上的静态页面。不过因为还没有配置，所以此时是发布到了Bitbucket的gh-pages分支中。

打开`Rakefile`，修改`deploy_branch`的值为`master`，然后修改`_deploy`目录中的git配置。

``` bash
$ cd _deploy
$ nano .git/config
```

修改`[remote "origin"]`中的`url`，将其修改为

```
git@github.com:github_username/github_username.github.io.git
```

保存git配置后，切换分支为master，上传文件。

```
$ git branch master
$ git checkout master
$ git push -u origin master
```

大约过10分钟后，访问`github_username.github.io`就可以看到你的博客了。

Github Pages支持绑定域名，首先在你的域名管理中，添加一个`CNAME`记录，指向`github_username.github.io`，然后执行以下命令：

``` bash
$ cd ~/octopress
$ echo your_domain > source/CNAME
$ rake generate
$ rake deploy
```

稍候片刻，待域名信息更新后就可以通过绑定的域名访问博客了。

> 详见 [Setting up a custom domain with Pages](https://help.github.com/articles/setting-up-a-custom-domain-with-pages)

至此Octopress的安装部署就完成了。以后写完日志，只需要执行：

``` bash
# pwd is ~/octopress
$ rake generate
$ rake deploy
$ git push origin master
```

即可实现博客的更新以及Bitbucket的数据备份。