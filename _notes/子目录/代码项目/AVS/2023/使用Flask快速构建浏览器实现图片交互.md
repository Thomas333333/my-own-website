---
---

## 目的
用python实现客户端和服务器端的部署，使得在客户端打开一个网页，读取服务器端的图片内容并显示在网页上。通过点击网页图片实现交互，并选中图片的文件名以txt文件的形式存储在服务器端。
## Flask和Django的比较（ChatGPT说）
+ Flask是一个轻量级的Web框架，它非常简单灵活，并且提供了最基本的功能来构建Web应用程序。它适用于小型项目或对自由度有较高要求的开发者。Flask提供了基本的路由、模板渲染、表单处理等功能，你可以根据需要选择和集成其他库来完成更复杂的任务。它的学习曲线相对较低，更适合小型项目和快速原型开发。
+  Django则是一个全功能的Web框架，它提供了许多内置的功能和工具，使得开发过程更加快速和高效。Django拥有强大的ORM（对象关系映射）和数据库集成、认证授权系统、管理员界面等功能，使得开发者可以快速搭建复杂的Web应用程序。Django适合大型项目和需要快速开发的情况，它的学习曲线相对较陡，但一旦掌握，可以提高开发效率。

这里我们对复杂性没有太大要求，只实现基本交互功能就行，所以选择flask。

## 实现

1. 在conda虚拟环境下安装flask
```bash
conda create -n web_interface python=3.9
conda activate web_interface
pip install flask
```
2. 在app.py定义路由，在`templates/`文件夹下创建index.html文件映射 网页前端。
3. 启动`python app.py`
4. 在客户端打开 http://127.0.0.1:5000/

## 展示效果
+ 交互界面
![image.png|500](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230713105638.png)
+ 单击一次代表选中做正反馈，右下角出现"+"；点击两次代表选中做负反馈，右下角出现"-"
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230713115313.png)
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230715162015.png)
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230715162047.png)
+ 最后点击interact按钮，生成选中图片的txt文件，并自动切换到下一题。
## 改进
- [x] 把图片换成缩略图，减少浏览器加载图片时间
	- [-] 上传官方缩略图，预计耗时超过100h
	- [x] 使用PIL对图片进行压缩，将压缩图片存到本地。

- [x] 因为一共有30道题，添加自动切换到下一题的按钮。
	- [x] 添加script函数，在按下按钮后修改app.py中的全局变量qid并刷新页面

- [x] 由于算法需要，需要加入正反馈和负反馈，对图片设计两种不同的选中状态。
	- [x] 在css设计两种不同的类，在script函数中设置新变量读取图片变量，根据变量值进行条件判断，赋予对应属性。 ==7.15==