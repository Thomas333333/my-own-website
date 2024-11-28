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

## 查看指定命令来源