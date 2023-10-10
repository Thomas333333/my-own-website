---
---

## 教程

### [ obsidian 目前最完美的免费发布方案 - 渐进式教程](https://www.nuomiphp.com/t/62d3d539b77c2c2aec6b748c.html)
####  基本环境
+ [下载ruby安装环境](https://blog.csdn.net/qq_62052372/article/details/129818531?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522168821982816800185898214%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fall.%2522%257D&request_id=168821982816800185898214&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~first_rank_ecpm_v1~times_rank-2-129818531-null-null.142^v88^koosearch_v1,239^v2^insert_chatgpt&utm_term=%20ruby%20%E8%AF%AD%E8%A8%80%E7%8E%AF%E5%A2%83%E5%AE%89%E8%A3%85&spm=1018.2226.3001.4187)，下载[3.1.4版本](https://objects.githubusercontent.com/github-production-release-asset-2e65be/78153411/14743bab-367c-4c52-ab6f-9bfa5efdd838?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20230701%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230701T164222Z&X-Amz-Expires=300&X-Amz-Signature=f5f360694f999d6abfc3dd7afe1862ab308e53e06f9a84cc9fe1cb1442aafbfd&X-Amz-SignedHeaders=host&actor_id=82803373&key_id=0&repo_id=78153411&response-content-disposition=attachment%3B%20filename%3Drubyinstaller-devkit-3.1.4-1-x64.exe&response-content-type=application%2Foctet-stream)，超过3.2版本会报错
+ `git clone git@github.com:maximevaillancourt/digital-garden-jekyll-template.git`
- [!] 一定要先fork，让github里有对应的仓库，后面Netlify需要使用这个仓库
+ cd 工作目录
+ `bundle`
+ 执行本地调试命令`bundle exec jekyll serve`，接着浏览器打开`http://localhost:4000`看是否正常显示页面。
	
#### [ Netlify](https://app.netlify.com/sites/cool-crisp-af8aed/overview)环境部署 博客部署
+ [教程](https://zhuanlan.zhihu.com/p/55252024)
+ 获取个人网站网址 

#### 如何自动发布到github与更新web网页
+ [参考](https://refinedmind.co/obsidian-jekyll-workflow)

#### 使用方式
+ obsidian的设置-文件与链接
	+ 开启“使用Wiki链接”
	+ 将“内部链接类型”修改为“尽可能简短的形式”
+ 不允许md文件有相同的命名
+ 每个md文件必须包含front-matter
### 问题
- [x] 不支持latex，对于科研来说公式也很重要
	- [ ]  寻找支持latex的方案 比如[插件](https://github.com/yoursamlan/pubsidian)
	- [x] 更改代码使得Jekyll支持latex公式（包括内联插入\$$）的调用：
		- 只要将 MathJax 提供的代码片段放在 `_includes/head.html`，原理在[教程](https://lloyar.github.io/2018/10/08/mathjax-in-jekyll.html)
		```HTML
		<script>
		MathJax = {
		  tex: {
		    inlineMath: [['$', '$']]
		  }
		};
		</script>
		<script id="MathJax-script" async
		  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js">
		</script>
		```
		- 参考[老版解决方案1，已不适用](https://www.zhblog.net/qa/inline-math-expressions.html)，[Mathjax最新文档](https://docs.mathjax.org/en/latest/web/start.html)
		- [ ] 有些内联公式仍然不支持，例如   $\hat{y}=\mathrm{argmax}_{y}P_{\theta}({y}|x)$ ，因为存在双下横线，在html里会在转换成公式前率先被渲染成italics。
			- 在github的mathjax[提问](https://github.com/mathjax/MathJax/issues/3067)
			- 在jekyll论坛上有人遇到了[类似的情况](https://talk.jekyllrb.com/t/jekyll-and-mathjax/5514)
			- [ ] 可能的解决方案：在bat文件中，同步到github前运行python脚本将内联公式中的_替换成\_
			- [ ] 参考链接：[jekyll论坛](https://talk.jekyllrb.com/t/jekyll-and-mathjax/5514)，[github issue](https://github.com/mathjax/MathJax/issues/3067)，[github issue2](https://github.com/mathjax/MathJax/issues/2757)，[github issue3](https://github.com/mathjax/MathJax/issues/830)
			- [x] 最终方案是参考[包哥的博客](https://baoyu.space/blog/Jekyll-Math.html)，原本是需要在`_includes/footer.html`中加入脚本，将下划线转换的html标签重新更改为下划线，但是我们的`footer.html`默认是网页的脚注，添加script脚本会影响脚注渲染，改为在`_layouts/default.html`中加入下面脚本。
```
<script>
    function rep() 
    {
        document.body.innerHTML
            = document.body.innerHTML
            .replaceAll("<em>", "_").replaceAll("</em>", "_")
        
    }
    rep()
</script>
```
		
- [x] 无法自动同步到github上
	- [ ] 尝试插件obsidian-git，我的工作区只设置在子文件_note下，没法跳出子文件夹进行push 
	- [x] 使用bat文件，cmd运行 `taskschd.msc`添加自动运行的新任务，每天运行一次。
  
	