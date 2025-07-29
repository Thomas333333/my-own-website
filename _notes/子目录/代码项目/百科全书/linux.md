---
---

## 给用户权限
+ `sudo chmod -R 777 /mnt2/AVS_data/iacc.3/results `

## nvidia-smi返回# Failed to initialize NVML: Driver/library version mismatch
+ 参考[博客](https://blog.csdn.net/weixin_43568307/article/details/128187469?ops_request_misc=%257B%2522request%255Fid%2522%253A%25224EF8FF53-D899-486B-89A3-E6BCAC62501A%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=4EF8FF53-D899-486B-89A3-E6BCAC62501A&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_positive~default-2-128187469-null-null.142^v100^pc_search_result_base4&utm_term=Failed%20to%20initialize%20NVML%3A%20Driver%2Flibrary%20version%20mismatch&spm=1018.2226.3001.4187)
+ 总结：主要问题是系统驱动自动更新`upgrade nvidia-driver-535-server:amd64 535.161.08-0ubuntu2.20.04.1 535.183.01-0ubuntu0.20.04.1`，但是显卡驱动内核还是原来的版本
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20241114155614.png)
方法一：尝试重启服务器
+ 使用指令`sudo reboot`
+ 等待5min服务器重启后，即可正常使用`nvidia-smi`

## 梯子
+ 参考[博客](https://v2free.net/doc/#/linux/clash)
+ 启动
```bash
export http_proxy="http://127.0.0.1:7890"
export https_proxy="http://127.0.0.1:7890"
```
+ 取消代理
```bash 
unset http_proxy
unset https_proxy
```

## 检查硬盘空间大小
```bash 
#检查深度为1的文件或文件夹的空间大小
!du -h --max-depth=1

#检查挂载空间的大小
!df -h

```

## 将/home下面的文件挂载到别的盘下
```
mv ~/.cache /mnt/data/.cache

sudo mount --bind /mnt/data/.cache ~/.cache

du -h --max-depth=1
```

## 查看指定命令来源，并尝试kill
```
#根据关键词找到指定命令的进程ID，这里以关键词“python”举例
ps aux | grep -E 'python'

#根据进程ID来终止进程
kill -9 <PID>

```

## 检查用户密码过期情况
以下要求使用`root`权限
+ 查看具体情况 `chage -l username`
+ 如果密码过期，修改密码`passwd username` 


## windows下使用WSL2+Vscode 
参考[CSDN博客](https://blog.csdn.net/m0_72515743/article/details/146019129?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522a1d6a7fb2e79a1ce97cc930410d6f822%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fall.%2522%257D&request_id=a1d6a7fb2e79a1ce97cc930410d6f822&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~time_text~default-3-146019129-null-null.142^v102^pc_search_result_base8&utm_term=wsl%2Bvscode%20torch&spm=1018.2226.3001.4187)
+ 使用指令`wsl -d Ubuntu`在命令行启动，`wsl --shutdown`关闭
+ 使用`wsl --install Ubuntu`下载分发。默认是24.04
+ Ubuntu的版本信息![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20250317230420.png)

## WSL2忘记密码

```
#进入root用户
wsl.exe --user root 

#重置密码  
passwd your_username


##不确定用户名的可以通过下面命令查找
#cat /etc/passwd
#或者wsl.exe -l -v
```

## WSL2 ping不通外网

![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20250721155446.png)

![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20250721155454.png)

## Linux下载速度太慢
### 使用下载工具的多线程下载功能

`wget` 本身功能比较基础，不支持多线程下载。但很多下载工具都支持。

- **`axel` (Linux/macOS):** 这是一个命令行下载加速器，支持多线程。 安装：`sudo apt-get install axel` (Debian/Ubuntu) 或 `brew install axel` (macOS) 使用：`axel -n 10 https://developer.download.nvidia.com/your-file-path` (其中 `10` 是线程数，可以根据网络情况调整)


## WSL报错
报错内容：# Could not load library libcudnn_cnn_infer.so.8. Error 
参考[解决方案](https://blog.csdn.net/2401_83845654/article/details/146343987)，大概率是环境变量的设置问题，可以用`echo $PATH` 类似的指令进行查看。还有小部分可能是没有下载cudnn。