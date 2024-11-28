
## 在ssh中没法使用函数的定义实现快速跳转
+ 参考[csdn博客](https://blog.csdn.net/loumanfeng/article/details/141506710)
+ 主要问题是pylance这个扩展程序没有正确地开启。需要去Language Server更改Python插件的配置。

## Vscode突然需要多次输入密码
登录的时候output包含` Server installation process already in progress - waiting and retrying`
问题在于vscode在服务器的配置文件`/home/.vscode-server/bin/id`出现了lock文件`vscode-remote-lock.username.id`，有两个解决方法，参考[issue](https://github.com/microsoft/vscode-remote-release/issues/2518),参考[csdn博客](https://blog.csdn.net/X_blackbutterfly/article/details/118075918?ops_request_misc=%257B%2522request%255Fid%2522%253A%252242B04AC6-9027-4615-8445-96CFD5CD50A7%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fall.%2522%257D&request_id=42B04AC6-9027-4615-8445-96CFD5CD50A7&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~first_rank_ecpm_v1~rank_v31_ecpm-5-118075918-null-null.142^v100^pc_search_result_base4&utm_term=%20Server%20installation%20process%20already%20in%20progress%20-%20waiting%20and%20retrying&spm=1018.2226.3001.4187)
+ 一是删除这个lock文件，但对于我不适用
+ 而是使用指令`Kill VS Code Server on Host`重新登录。这会删除你之前在服务器的登录状态，而重新wget配置文件。
+ 我的vscode版本是1.85.2