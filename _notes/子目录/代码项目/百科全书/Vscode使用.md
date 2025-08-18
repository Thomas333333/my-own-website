---
---


## 在ssh中没法使用函数的定义实现快速跳转
+ 参考[csdn博客](https://blog.csdn.net/loumanfeng/article/details/141506710)
+ 主要问题是pylance这个扩展程序没有正确地开启。需要去Language Server更改Python插件的配置。

## Vscode突然需要多次输入密码
登录的时候output包含` Server installation process already in progress - waiting and retrying`
问题在于vscode在服务器的配置文件`/home/.vscode-server/bin/id`出现了lock文件`vscode-remote-lock.username.id`，有两个解决方法，参考[issue](https://github.com/microsoft/vscode-remote-release/issues/2518),参考[csdn博客](https://blog.csdn.net/X_blackbutterfly/article/details/118075918?ops_request_misc=%257B%2522request%255Fid%2522%253A%252242B04AC6-9027-4615-8445-96CFD5CD50A7%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fall.%2522%257D&request_id=42B04AC6-9027-4615-8445-96CFD5CD50A7&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~first_rank_ecpm_v1~rank_v31_ecpm-5-118075918-null-null.142^v100^pc_search_result_base4&utm_term=%20Server%20installation%20process%20already%20in%20progress%20-%20waiting%20and%20retrying&spm=1018.2226.3001.4187)
+ 一是删除这个lock文件，但对于我不适用
+ 而是使用指令`Kill VS Code Server on Host`重新登录。这会删除你之前在服务器的登录状态，而重新wget配置文件。
+ 我的vscode版本是1.85.2
## 使用cline连接qwen3-coder-plus 
参考阿里云模型[网站](https://bailian.console.aliyun.com/?spm=5176.12818093_47.overview_recent.2.57ea2cc9THRFZ8&tab=doc#/api/?type=model&url=https%3A%2F%2Fhelp.aliyun.com%2Fdocument_detail%2F2880898.html)

1. 打开vscode，搜索插件cline
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20250802142844.png)
2. 打不开，在网上查找原因，发现是自己的vscode版本1.85.2太老了（之前为了处理remote-ssh的问题必须降级）。参考这个[issue](https://github.com/cline/cline/issues/1124#issuecomment-2858302511)换了cline的版本2.2.2。
3. 填写api-key 和模型名称
4. 填写cutom instructinons，比如speak in chinese
可用模型：
+ qwen3-coder-30b-a3b-instruct：额度100w

+ qwen3-coder-plus：100w
+ qwen3-coder-plus-2025-07-22：100w

+ qwen3-coder-480b-a35b-instruct：100w
prompt测试：
+ 你能帮我创建一个html游戏吗：飞机击落前面飞来的障碍物，有对应的加分，要有基本的页面。

还可以使用通义灵码