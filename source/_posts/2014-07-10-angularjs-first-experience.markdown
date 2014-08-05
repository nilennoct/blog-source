---
layout: post
title: "AngularJS 使用体验"
date: 2014-07-10 10:52:57 +0800
comments: true
categories: 
- Note
tags:
- Javascript
---
> AngularJS是一款开源 JavaScript函式库，由Google维护，用来协助单一页面应用程式运行的。它的目标是透过MVC模式 (MVC) 功能增强基于浏览器的应用，使开发和测试变得更加容易。

> **Angular的哲学**

> AngularJS是建立在这样的信念上的：即声明式编程应该用于构建用户界面以及编写软件构建，而指令式编程非常适合来表示业务逻辑。框架采用并扩展了传统HTML，通过双向的数据绑定来适应动态内容，双向的数据绑定允许模型和视图之间的自动同步。因此，AngularJS使得对DOM的操作不再重要并提升了可测试性。

> See more from [Wikipedia](http://en.wikipedia.org/wiki/AngularJS)

以上内容引自维基百科，简单的来说，AngularJS 就是一个使用了 MVC 设计模式的 Javascript 框架，类似的还有 Backbone.js、Atoms.js 等。因为之前也稍有接触 Backbone.js，所以先简单说说 AngularJS 和 Backbone.js 之间的区别。若与实际有出入，欢迎斧正。

<!-- more -->

## 与 Backbone.js 的比较 ##

- **依赖关系 (Dependency)**

[Backbone.js](http://backbonejs.org/) 依赖于 [Underscore.js](http://underscorejs.org/)，DOM 操作、RESTful、history 支持等则依赖于 [jQuery](http://jquery.com/) 或 [Zepto](http://zeptojs.com/)，因此虽然 Backbone.js 自身体积不大，但合计起来体积也不小；[AngulaJS](http://www.angularjs.org/) 不依赖于其他 Javascript 库，对于 DOM 操作，AngularJS 自带一个 jQuery 的子集（称作 jQuery lite 或 jqLite），可以使用 `angular.element` 完成大多数的 DOM 操作。当用户在 AngularJS 之前导入 jQuery 时，AngularJS 会自动使用 jQuery，此时 `angular.element` 就变成了 `jQuery` 的一个别名。

- **模板 (Template/View)**

Backbone.js 默认使用 Underscore.js 提供的模板引擎 (string-based)，也可以自己导入其他的模板引擎；AngularJS 自带了一个强大的 DOM 转换引擎而非 Underscore.js 那样的基于字符串的模板引擎，大大提高了执行效率，而且因为 AngularJS 是在 HTML 的基础上进行扩展，相对更容易理解。

> Angular's HTML compiler allows the developer to teach the browser new HTML syntax. The compiler allows you to attach behavior to any HTML element or attribute and even create new HTML elements or attributes with custom behavior. Angular calls these behavior extensions directives.

> Angular comes pre-bundled with common directives which are useful for building any app. We also expect that you will create directives that are specific to your app. These extensions become a Domain Specific Language for building your application.

- **模型 (Model)**

Backbone.js 提供了 Backbone.Model 和 Backbone.Collection，Collection 是一类 Model 的集合，提供了增删查改以及查询等一系列方法。借由 Backbone.sync，Model 和 Collection 都可以很方便地实现 REST 从而与后端交换数据，但是对于非 RESTful 的后端 Backbone.js 就显得不那么友好了，用户需要重载 Backbone.sync 或是直接使用 jQuery。

AngularJS 没有封装 Collection 或是 Model，对于 AngularJS 一个 Object 就是一个 Model，因此没有 Backbone.js 那样嵌套的问题，但也因此需要自行维护 Model。不过如果确实有需要的话，这个问题可以通过导入相应的模块解决。

-  **数据绑定 (Data-binding)**

Backbone.js 并没有提供数据绑定的方法，用户需要手动在 Model 和 View 之间建立关系，比如 `this.model.on('eventName', callback)` 或者 `this.listenTo(this.model, 'eventName', callback)`，这里的 `this` 指向 View 的一个实例。（个人不建议在 Model 的定义中绑定与 View 操作有关的事件）。

下面是一个例子。有一个图像列表，结构如下。

``` html
<ul>
    <li>
        <!-- image content -->
    </li>
    <li>
        <!-- image content -->
    </li>
</ul>
```

ImageView 是图像列表中每张图片的 View，代码如下。

``` javascript
var imageTpl = '<a class="imgWrapper" href="javascript:void(0);">\
    <% var url = "/files/thumbnail/" + image.filename; %>\
        <img src="<%=url%>" alt="<%=image.title%>" data-src="/files/<%=image.filename%>" />\
    </a>\
    <div class="imgInfo">\
        <input type="text" name="title" id="title" value="<%=image.title%>" placeholder="Title" />\
        <div><%=image.date%></div>\
        <input type="text" name="tags" id="tags" value="<%=image.tags.join(" ")%>" placeholder="Tags(separate with space)" />\
    </div>\
    <div class="imgControl">\
        <a class="button submit icon-checkmark" href="javascript:void(0)">Submit</a>\
    </div>';

var ImageView = Backbone.View.extend({
    tagName: 'li',
    render: function () {
        this.$el.html(_.template(imageTpl, {image: this.model.toJSON()})).attr('id', this.model.id);
        this.$title = this.$('input#title');
        this.$tags = this.$('input#tags');
        return this;
    },
    initialize: function () {
        this.listenTo(this.model, 'destroy', function () {
            this.remove();
        });
    },
    events: {
        'click .submit': 'submit'
    },
    submit: function submit () {
        if ($(this).hasClass('disabled')) {
            return;
        }
        this.model.set({
            title: this.$('#title').val(),
            tags: this.$('#tags').val().trim().split(' ')
        });
    }
});
```

AngularJS 为人称道的一点就是它的双向数据绑定，先看一下来自 AngularJS 官方的介绍：

> Angular templates work differently. First the template (which is the uncompiled HTML along with any additional markup or directives) is compiled on the browser. The compilation step produces a live view. Any changes to the view are immediately reflected in the model, and any changes in the model are propagated to the view. The model is the single-source-of-truth for the application state, greatly simplifying the programming model for the developer. You can think of the view as simply an instant projection of your model.

如果是 AngularJS，上面那段代码要怎么写？请看下面的代码。

``` html view.html
<ul ng-controller="ImageListCtrl" ng-repeat="image in images">
    <li>
        <a class="imgWrapper" href="javascript:void(0);">
            <!-- AngularJS 的模板语法是两个”{}“包住变量名，这里中间插入了空格是因为 Jekyll 也用了相同的模板语法，下同。 -->
            <img ng-src="{ { image.url } }" alt="{ { image.title } }" />
        </a>
        <div class="imgInfo">
            <input type="text" ng-model="image.title" name="title" id="title" placeholder="Title" />
            <div ng-bind="image.date"></div>
            <input type="text" ng-model="image.tags" ng-list=" " name="tags" id="tags" placeholder="Tags(separate with space)" />
        </div>
        <div class="imgControl">
            <button type="button" class="button submit icon-checkmark" ng-class="{disabled: image.disabled}" ng-click="submit($index)">Submit</button>
        </div>
    </li>
<ul>
```
``` javascript controller.js
angular.module('imgboxController').controller('ImageListCtrl', ['$scope', '$http', function($scope, $http) {
    $http.get('/images/').success(function(images) {
        $scope.images = images;
    });
    
    $scope.submit = function submit($index) {
        var image = $scope.images[$index];
        if (image.disabled) return;
        image.disabled = true;
        $http.put('/images/' + image._id, image).success(function() {
            image.disabled = false;
        });
    }
}]);
```

很明显可以看出两种方法的区别，第一种仅仅是 View 的定义，内容包括了模板内容和渲染方法、记录 DOM 元素、事件绑定等，要生成一个完整的图像列表还有很多代码要写，比如索取所有图像信息、控制循环生成列表等；第二种使用了 AngularJS 的则包含了 Model、View、Controller 的定义，实现了第一种方法中的所有功能，甚至包括第一种方法尚未实现的功能。借助于双向数据绑定，用户不需要关心该如何操作 DOM 元素，只需要关心 Controller 的编写和 Model 的管理，大大提高了效率。

说了怎么多，感觉好像都是 AngularJS 更具有优势。但实际上 AngularJS 有一个不能忽视的问题，就是相比 Backbone.js，AngularJS 的门槛更高，需要花更多时间学习相关的知识。使用 Backbone.js 的话，可能只要花比较少的时间看看文档和例子就能快速上手开发，遇到文档中没说明清楚的问题时，直接看源码往往可以很快解决；相比之下，AngularJS 就没有这么简单了，首先要了解各种 Directive 的作用和用法，弄清 Service、Factory、Provider、Dependency Injection 等概念。虽然也可以像使用其他类库那样一边写代码一边看文档，但我觉得还是先系统地看一遍更好，不然随着学习的深入，你会发现很多之前写的代码都可以用更好的方法去实现，以至于每隔一段时间可能就要重构一次代码了。

## 一些使用心得 ##

- **常用的 Directive**
	- `ngController`：用于指定此 DOM 树的 Controller，同时也确定了 `$scope` 的作用范围。
	- `ngModel`：用于给 `input`、`textarea` 或 `select` 绑定 Model，Model 的值会根据用户的输入自动更新，即 View -> Model 的更新。
	- `ngBind`：用于设置 DOM 的内容，相当于设置 innerText。以之前的代码为例，`<div>{ { image.date } }</div>` 也可以写作 `<div ng-bind="image.date"></div>`，通常会选择用 ngBind 设置 DOM 的内容以避免在模板渲染完成前显示类似 `{ { image.date } }` 的内容。
	- `ngSrc/ngHref`：用于设置含变量的图片地址/链接地址，若直接使用 HTML 的 src/href 属性会触发无效的 HTTP 请求。
	- `ngRepeat`：非常实用的一个 Directive，通常用于渲染数组或对象。此外在 `ngRepeat` 上还可以应用 Filter 筛选出符合条件的 Model。
	- `ngClass`：用于动态设置 DOM 的 Class。
	- `ngClick/ngKeypress/...`：这是一系列的 Directive，形式类似于 `ngEvent` ，接受一个表达式作参数，可以是 `$scope` 上的一个函数，如 `ng-click="submit($index)"`，也可以是对 `$scope` 域中变量的修改，如 `ng-click="image.disabled = true"`。
	- `ngShow/ngHide`：用于动态显示/隐藏 DOM。

- **Controller 的继承**

很多时候我们会需要用到 Controller 的继承，比如有 `PersonCtrl`、`StaffCtrl`、`ManagerCtrl` 三个 Controller，`StaffCtrl` 和 `ManagerCtrl` 都会用到 `PersonCtrl` 的一些公共函数。此时可以这样写：

``` html
<div ng-controller="PersonCtrl">
    <ul ng-controller="StaffCtrl"></ul>
    <ul ng-controller="ManagerCtrl"></ul>
</div>
```
这样通过 `StaffCtrl` 和 `ManagerCtrl` 的 `$scope` 就可以访问到 `PersonCtrl` 的 `$scope` 上的变量和函数，而 `PersonCtrl` 中直接以 `function foo() {...}` 或 `var a` 形式定义的将保持私有。

- **FIre the listeners**

在某些特殊的情况下我们可能会发现 Model 的更新没有实时反映到 View 上。比如下面这两段代码：

``` javascript
var foo1 = function() {
    setTimeout(function() {
        $scope.messages.pop();
    }, 3000);
}

var foo2 = function() {
    setTimeout(function() {
        $scope.$apply(function() {
            $scope.messages.pop();
        });
    }, 3000);    
}
```

``` html
<ul ng-repeat="message in messages">
    <li class="alert" ng-bind="message.content"></li>
</ul>
```

假设原来 `$scope.message` 中有3条消息，执行 `foo1()` 后理论上 View 中显示的消息数目将变成 2，但实际上并非如此。这种情况并不少见，比如使用 setTimeout、XHR 或一些第三方库时，往往都会出现类似的问题。此时就需要用到 `Scope.$apply()` 了，即上例中的 `foo2()` 函数。

> `$apply()` is used to execute an expression in angular from outside of the angular framework. (For example from browser DOM events, setTimeout, XHR or third party libraries). Because we are calling into the angular framework we need to perform proper scope life cycle of exception handling, executing watches.

- **简单谈谈 AngularJS 的 HTML Compiler**

如前文所说，AngularJS 自带了一个强大的 DOM 转换引擎而非 Underscore.js 那样的基于字符串的模板引擎，通过 `Compiler` service 完成模板的生成。整个过程有两个阶段：

+ Compile：遍历 DOM 并收集所有 directives，并返回 linking 函数；
+ Link：整合 directives 和相应的 scope 以生成视图 (View)，实际上就是在 DOM 上添加 listener 和在 scope 上添加 `$watcher`。

可以看看官方给出的伪代码：

``` javascript
  var $compile = ...; // injected into your code
  var scope = ...;
  var parent = ...; // DOM element where the compiled template can be appended

  var html = '<div ng-bind="exp"></div>';

  // Step 1: parse HTML into DOM element
  var template = angular.element(html);

  // Step 2: compile the template
  var linkFn = $compile(template);

  // Step 3: link the compiled template with the scope.
  var element = linkFn(scope);

  // Step 4: Append to DOM (optional)
  parent.appendChild(element);
```
  
- **Module 的获取**

AngularJS 是模块化设计的，用户可按需要创建、导入模块，这使得 AngularJS 变得十分灵活。AngularJS 的模块化是通过依赖注入 (Dependency Injection) 实现的，AngularJS 通过 injector 创建和查找所需要的 Module。

当获取 Module 时，injector 会在 Instance Cache 中查找需要的 Module 是否存在，若存在则直接返回（单例模式），若不存在则通过 Instance Factory 创建一个新的，放入 Instance Cache 后返回。 AngularJS 允许创建同名的 Module，但是新创建的 Module 会覆盖旧的 Module。

To be continued.