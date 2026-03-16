---
---

本篇笔记作者：[三木理想](https://space.bilibili.com/630894619)
参考up主：[锅操操](https://space.bilibili.com/9193727) 
参考源文件：[科研模版库](https://www.bilibili.com/read/cv33524493)

本篇为作者学习up主的obsidian库布置时顺便做的笔记，希望能给对“拆库”这一概念感兴趣的朋友分享一下我的“拆库”经验。

# 使用到的插件
以下的推荐星级仅为个人使用的主观体验，仅代表个人观点。三级标题名即为插件在市场中的名字。

### Advanced URI

##### 推荐星级：⭐

允许使用类似URI的`obsidian://advanced-uri?vault=<your-vault>&filepath=my-file&heading=Goal`这样的文本来创建命令。

### Automation

##### 推荐星级：⭐⭐⭐⭐⭐ （很实用）

设置某些自动操作，比如默认固定时间每天00:00创建dairy文件，避免使用固定指令capture创建，能够减少我们犯错的可能。

### Banners

##### 推荐星级：⭐⭐⭐ （美化主页）

用于加入主页的横幅图片。可以实现在不同的笔记中加入横幅。效果如下图
![image.png|300](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240430185807.png)

### BRAT

##### 推荐星级：⭐⭐（主要是用于自动更新内测插件）

将测试的插件的GitHub 存储库路径添加到测试列表后，该插件可以自动下载更新并重新加载插件。可能用于未出现在插件库的插件下载（目前使用的插件都可以在插件库找到）。
添加了以下两个插件的github链接：
+ https://github.com/Benature/obsidian-automation  与Automation相关
+ https://github.com/Benature/obsidian-plugin-reloader  在选项上快速重启插件，可能用于新建计时操作等。

### Calendar

##### 推荐星级：⭐⭐⭐⭐⭐

日历，右上角的时间表。效果如下：
![image.png|300](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240430185747.png)

### CustomJS

##### 推荐星级：⭐⭐⭐⭐⭐（实现js扩展，扩展性up）

允许用户调用JavaScript文件来使用dataview块和templater模版。

+ 在示例中，JavaScript的文件位置为`Zattachments/Scripts`

### Dataview

##### 推荐星级：⭐⭐⭐⭐⭐（很多逻辑简单的视图可以用它的语言实现）

使用编程语言可以创建一些复杂的数据视图。用于以图表的形式展示不同分类中的子项，如`Diary`中的`TaskList`这一区块就是依靠`Dataview`语法实现的。效果相关图如下：
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240507220111.png)



+ 需要打开允许JavaScript调用的选项
![image.png|300](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240430190600.png)

### Extended MathJax

##### 推荐星级：⭐⭐⭐ （latex用户）

启用了一些额外的MathJax扩展，用于数学公式排版。可以在`Zattachments/preamble.sty`修改latex的配置，比如引入新的latex宏包，或者设置latex的新命令。示例如下：
```latex
$\require{mhchem}$ #引入新宏包
$\newcommand{\msun}{\mathrm{M_{sun}}}$ #设置latex的新命令
$\newcommand{\so}{\ce{->}}$
$\newcommand{\dim}{\mathrm}$
$\newcommand{\ang}{\mathrm{\mathring{A}}}$
```

### Hider

##### 推荐星级：⭐⭐（美化）

+ “用于隐藏一些零零碎碎的小东西”
	+ 状态栏（字数显示）
	+ 根文件夹名
	+ 右侧的滚动条
	+ 侧边栏切换按钮
	+ ...

### Homepage

##### 推荐星级：⭐⭐⭐⭐（可以设置笔记打开主页，可以放一些恶看到了心情会好的图片和格言）

用于设置主页文件路径，可以按照示例在主页的md文件写入代码实现以下效果：
![image.png|500](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240430192902.png)

### Kanban

##### 推荐星级：⭐⭐⭐⭐⭐（笔记的新格式）

在obsidian中创建支持 Markdown 的看板
+ 可以实现以下效果：
![image.png](https://github.com/mgmeyers/obsidian-kanban/raw/main/src/docs/Assets/Screen%20Shot%202021-09-16%20at%2012.58.22%20PM.png)
+ 在示例中用于Project和Class等的可视化展示。
![image.png|1000](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240430193323.png)

### List modified

##### 推荐星级：⭐⭐⭐⭐⭐（可以做个简单的“最近更新笔记列表”）

用于自动添加文件链接到diary中。回看diary即可发现当日创建的笔记的链接。示意如下：
![image.png|300](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240430194312.png)

+ 不想加入diary可以在设置里设置忽略标签，比如不想让自己的日记的链接加入就要为日记设置标签。

- [!] Create Log Note Automatically ... 会自动创建空日记，不需要的话可以关闭。他会绕过模版。


### MarginNote Companion

##### 推荐星级：🧐（我是windows用户所以没用到这个）

官方声明该插件是用于连接 MarginNote 3 和 Obsidian，将MarginNote 3的笔记转化为指定的格式储存在obsidian中。MarginNote 3适用于Mac和iPad和iPhone。

### Metadata Hider

##### 推荐星级：⭐⭐（强迫症患者）

元数据隐藏插件，用于设立永远显示的元数据或者永远隐藏的元数据。（元数据是标题下面，正文上面用于设置笔记属性的部分，合理利用可以实现分类和快速搜索，可能在Dataview里使用。）

### Minimal Theme Settings & Style Settings

##### 推荐星级：⭐⭐⭐⭐

调整界面外观，和“外观”中的Minimal主题配套使用。

### Obsidian columns（在插件社区搜columns）

##### 推荐星级：⭐⭐（用的不多，用需要的可以具体了解）

允许用户在笔记中创建列。主页的这部分就是用这个插件的代码块语法实现的：
![image.png|500](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240502122210.png)
简单效果如下：
````col
```col-md
Column A
```
```col-md
Column B
```
````

### Periodic Notes

##### 推荐星级：⭐⭐⭐（适合周报/月报同学）

允许创建每周/每月/每年日记。

### Surfing

##### 推荐星级：⭐⭐⭐⭐⭐（可以直接看b站了）

一款允许你在obsidian的标签页里浏览任意网址的插件。可以直接在点开b站链接看视频
+ Bilibili: [锅操操](https://space.bilibili.com/9193727)

### QuickAdd

##### 推荐星级：⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐（工作流快捷键的关键插件）

自定义快捷键。本套工作流的关键组件。

### Shell commands

##### 推荐星级：⭐(用的较少，有需要的人可以实现在obsidian里调用cmd)

该插件允许我们在设置中定义 shell/终端命令，并通过 Obsidian 的命令面板或快捷键快速运行它们。
+ 与QuickAdd配合使用，允许您我们将 shell 命令与其他 Obsidian 命令组合起来。
- [!] 示例中`python3 ./Zattachments/Scripts/auto_transfer.py ./Blist` 使用指令运行了python代码，但是在示例文件夹中找不到这个python文件的具体内容。

### Tasks

##### 推荐星级：⭐⭐⭐⭐(适合做待办的人)

用于跟踪任务，随时随地的查询或者修改它的完成情况。==可以自动记录任务完成的结束时间。==
+ 选中`Dataview`的语言实现任务查询
+ 在`Custom Statues`可以添加支持Minimal主题的候选框变换状态。

### Templater

##### 推荐星级：⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐（让模版的扩展性增加）

模板插件。它定义了一种模板语言，可以让我们将变量和函数结果插入到笔记中，还允许执行 JavaScript 代码来操作这些变量和函数。

- [!] Trigger Templater ...得打开。不然无法正确识别Dataviewjs里的`<% tp.date.now("YYYY-MM-DD") %>`语法，在新日记里无法转化为日期。
### Text Format

##### 推荐星级：🧐（我还没用上zetero的，后续研究研究）

作用是格式化选定的文本小写/大写/大写/标题大小写或删除多余的空格/换行符。
+ 和Zotero配合，可以快速将pdf上做笔记的内容以可读的形式复制。
### Toggl Track

##### 推荐星级：⭐⭐⭐⭐⭐(计时插件，让我想起来手机APP里的“番茄To Do”)

+ [参考视频](https://www.bilibili.com/video/BV1yq4y1P7x5/?spm_id_from=333.337.search-card.all.click&vd_source=d734816ca968c71cf724762297d14df5) ，视频是21年的，插件名字有更新。里面有讲如何注册Toggl以及获取API Token。
+ 点击测试链接后重进即可选中自己的workspace。

# Home.md(主页实现)

使用了YAML和一些特定的标记语言写的网页块，包括日期进度条、待办事项列表、贡献图。
+  主页整体由一个叫“contribution widget”的插件构成（现版本已改名为“components”，但本库目前没有更新到这个版本）参考视频可以点[这里](https://www.bilibili.com/video/BV1TJ4m1x76K)，需要自己下载插件。
+ 复制home.md的内容无法正常显示，如下图。原因是每个组件有自己独立生成的ID。可以按照上面的视频教程自己仿照重新创建。
+ ![image.png|500](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240502223821.png)
+ 操操姐使用了css代码优化这里的网页布局。需要去`OB-academic-template-vault\.obsidian\snippets`这个路径找到`rightlane.css`这一文件，放到你自己创建的obsidian文件夹下的`.obsidian\snippets`里，然后在`设置\外观`启动该对应css代码片段。

# Templates
涉及Dataview语法。文件目录在`Zattachmen\Templates`底下。

## Diary
+ 里面的`cssclasses `使用了`Minimal`的卡片布局。可以参考[官方教程](https://github.com/kepano/obsidian-minimal?tab=readme-ov-file#css-helper-classes)。
	+ `cards`:将所有 Dataview 表设置为卡片布局
	+ `cards-col-3`：强制列数为3

使用了许多js文件，需要在`CostomJS`插件中指定存放js的文件夹。
+ 渲染Time Track模块
```
const {Daily, Research} = customJS
Daily.display(dv, Research)

```
+ 找到所有特定文件内的任务框并列出
```
dv.taskList(
dv.pages('"Projects" or "Events" or "Lierature" or "Blist" or "Courses" or "Amap/Todo List" or "Amap/Inbox"').file.tasks
.where(t => (t.completed && t.text.startsWith("<% tp.date.now("YYYY-MM-DD") %>"))||
		(dv.compare(t.start, dv.date("<% tp.date.now("YYYY-MM-DD") %>")) == 0)||
		(dv.compare(t.completion, dv.date("<% tp.date.now("YYYY-MM-DD") %>")) == 0))
)
```
+ 显示为 Tags 列，从"Literature/Notes" 或 "Events"文件路径寻找符合条件的文件进行链接。
```
TABLE comment AS Comments, join(file.etags, "<br />") AS Tags
FROM "Literature/Notes" or "Events"
WHERE file.name[0] = "@"
WHERE file.tags[0] != "#unread"
WHERE file.mtime>=date(<% tp.date.now("YYYY-MM-DD") %>) AND file.mtime<date(<% tp.date.now("YYYY-MM-DD", 1) %>)
SORT file.mtime desc
```


## Project
新建一个空白kanban。可以添加任务，并右键复制任务链接，使用`QuickAdd`的`Today`按钮，可以实现在`Todo List`加入该待办任务。

# css片段效果
css片段位于`OB-academic-template-vault\.obsidian\snippets`。主要用于美化界面布局。

## contribution.css
+ 原版：![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240503012015.png)

+ 开启后：![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240503012112.png)


## theme.css
+ 原版：![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240503012201.png)

+ 开启后：![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240503012230.png)
## toggl-track.css
+ 原版![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240503012326.png)

+ 开启后![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240503012343.png)



## rightlane.css
+ 原版本：
+ ![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240507214925.png)
+ 开启后：标题隐藏
+ ![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240507214957.png)


## kanban-block-editor.css & kanban-redesign.css
+ 原版：
+ ![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240507215332.png)
+ 开启后：
+ ![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240507215352.png)

# script效果
文件在`Zattachment\Scripts`目录底下，用于实现图形渲染或者自动操作。可以使用`QuickAdd`插件中的`macro`类别快速使用这些js文件。前提可能是下载了`CustomJS`插件并设置了正确的路径用于识别。
## daily_diary.js
包含Toggl 时间追踪的渲染函数、特定的日期计算功能。

## kanban.js
使用toggl插件追踪时间，会先选择`Todo List.md`文件中的代办任务，再选择`Toggl Track`里的`project`进行计时。
- [!] 无法正常使用

## archive-tasks.js
将`Todo List.md`已完成的任务写入 `Inbox.md` 文件。用未完成的任务列表覆盖之前的内容，用于任务归档。

## archive-events.js
将`Event List.md`中的待办任务转化为计划状态，转变方式如下：
- [ ] 待办任务
- [<] 计划任务 

将代办任务和计划任务写回源文件。


