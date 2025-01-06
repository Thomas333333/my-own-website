
## [Minecraft](https://github.com/kolbytn/mindcraft?tab=readme-ov-file)
参考作者的[youtube tutorial](https://www.youtube.com/watch?v=gRotoL8P8D8)
+ 下载我的世界java版本
+ 下载node.js 
+ fork了一个仓库（注意git push的时候要把密码删除掉）
+ `npm install`，过程中会遇到报错说禁止运行脚本，但是参考gpt给的指令`Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned`允许本地脚本运行
+ 进入世界，进入`对局域网开放`，输入端口号`55916`
+ 输入指令`node main.js`，虽然能正常运行，但是总是在`saved memory`之后存在报错。

### 代码逻辑梳理

+ `main.js`
	+ `.\src\process\agent_process.js`
		+ `.\src\process\init_agent.js`
			+ `.\src\agent\agent.js`(最主要的代码)：Starting agent initialization with profile 
				+  `.\src\agent\prompter.js`：涉及api调用逻辑设置
					+ [I] 加入deepseek的调用支持 


