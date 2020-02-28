# WebGL 实验室
> WebGL练习项目，此项目中得代码来源于各种书籍，网络，和自己的练习。能追溯到源头的都会标注。

### 运行环境
* 安装`nodejs`环境
* 安装`chrome`浏览器
* 运行`npm install`安装依赖

### 【实验1】WebGL Programming Guide
> [《WebGL编程指南》](https://book.douban.com/subject/25909351/) 源码练习, 还是按照原书章节目录组织的，用`es6`重写了代码，并将所有的例子集中在一起，能在页面手动切换章节，让学习更方便。将`shader`分离到单独文件，利用`webpack`的`loader`动态加载。
* 运行`npm run guide`命令会自动打开浏览器，可看到当前章节所有的效果。
* 代码位于`webgl-programming-guide`目录。
* `common/demo.js`是所有例子的父类，里面负责创建`canvas`等一些公共的初始化功能。
* `common/webgl-util.js`是`shader`操作的帮助类，创建`program`，创建编译`shader`等。
* `common/matrix4.js`封装的矩阵运算。
* `vector.js`封装了向量运算。