
### git clone报错 git@github.com: Permission denied (publickey)

+ 客户端先生成ssh key`ssh-keygen -t rsa -C "youremail@example.com"`
+ github 的 `SSH and GPG keys`，点击`New SSH Key`，在`~/.ssh/id_rsa.pub`里复制`ssh-rsa`开头的公钥，创建新的SSH key
+ 再使用`ssh -T git@github.com `，返回`Hi Thomas333333! You've successfully authenticated, but GitHub does not provide shell access.`，即可。

### github 教育优惠申请

+ 参考[csdn博客](https://blog.csdn.net/weixin_45502414/article/details/138068080?ops_request_misc=%257B%2522request%255Fid%2522%253A%25220EDECA4C-DDB3-47F6-9DF3-9E23702E0E2D%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=0EDECA4C-DDB3-47F6-9DF3-9E23702E0E2D&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~baidu_landing_v2~default-4-138068080-null-null.142^v100^pc_search_result_base4&utm_term=copilot%20%E7%94%B3%E8%AF%B7&spm=1018.2226.3001.4187)
+ Research Assistant可以以teacher这种教职工的身份来申请。
	+ 申请日期为10.3，大概10.6能有copilot的福利，如果10.8还是没有，就可以在[Eduction社区](https://github.com/orgs/community/discussions/categories/github-education)提出疑问。
	+ 10.6下午收到邮件
	+ 之后在vscode下载copilot插件，跳转到登录github的页面之后，即可以正常使用。
