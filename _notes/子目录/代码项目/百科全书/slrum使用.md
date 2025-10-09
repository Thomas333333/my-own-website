
参考[港科广HPC用户手册](https://hpc.hkust-gz.edu.cn/docs/hpc12/) 
+ 分区名查看[网站](https://hpc.hkust-gz.edu.cn/docs/hpc12/slurm/queue)
+ 申请卡之前最后使用`screen`和`tmux`等指令开启可恢复窗口，避免电脑断点无法连接
+ GPU占用率不满xx%超过9个小时会警告，每个月超过十个警告会停止用户使用权限。所以空闲或者睡觉的时候需要注意
## 新手配置
### anaconda安装
参考[csdn博客](https://blog.csdn.net/Zlyzjiabjw547479/article/details/147594504?ops_request_misc=%257B%2522request%255Fid%2522%253A%252255e132d9d22b6a65f91aa3de30ac7a3c%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=55e132d9d22b6a65f91aa3de30ac7a3c&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduend~default-2-147594504-null-null.142^v102^pc_search_result_base4&utm_term=anaconda%20linux&spm=1018.2226.3001.4187) 

```
wget https://repo.anaconda.com/archive/Anaconda3-2025.06-1-Linux-x86_64.sh
chmod +x Anaconda3-2025.06-1-Linux-x86_64.sh 
./Anaconda3-2025.06-1-Linux-x86_64.sh 


source ~/.bashrc
```

## (我遇到的)常见问题
### 出现找不到slrum指令
修改环境变量`export PATH=$PATH:/opt/slurm/bin`
+ 想用开机自启使用`vim ~/.bashrc`修改启动设置，将`export PATH=$PATH:/opt/slurm/bin`添加到最后一行
### nvcc --version   没有找到这个指令
`/usr/local`也没有对应的CUDAx.x的文件夹，是因为HPC(High-Performance Computing)/服务器通常使用“模块(module)”来管理软件环境。
+ 运行命令 `module avail`，看看列表里有没有类似 `cuda` 或 `cudatoolkit` 的条目。
+ 从上面的列表里选择一个版本进行加载。例如，加载 12.1 版本：`module load cuda/12.1`
+ 取消load是使用`module unload xx`

### 快速调试
`srun -p debug -n 4 --gres=gpu:1 --time=00:30:00 --pty bash`
+ debug分区有8卡40G，每个人最多使用30min，所以适合快速调试，同时等待时间很短。
+ -n代表CPU总核心数量


### 分配GPU
+ 首先是申请GPU，`salloc -p xx -n 4 --gres=gpu:1`，等待GPU分配
	+ 随后可以使用`srun python xx.py`
	+ 或者使用`srun --pty bash`调出计算节点的bash，之后正常使用`nvidia-smi`和`python xx.py`
	+ 常用的分区指令是`salloc -p i64m1tga800ue -n 4 --gres=gpu:1`

- [!] 注意如果是先`salloc` 再`srun --pty bash`，退出时候第一次使用`exit` 是退出`srun`但是GPU还是在占用，要再次使用`exit`取消任务才算彻底释放

### 分配CPU 
有时候用GPU占用率不高

### 卡死
`squeue -u <username>` 找到自己的job id ，然后使用`scancel <jobid>`直接中断作业
+ 目前遇到卡死的情况，是在运行module avail之后使用ctrl+C。gpu分区是1-2

### 避免警告
通过创建批处理文件来自动在程序结束后运行`keepbusy.py`程序。
```bash
#注意当前路径
chmod +x xx.sh
./xx.sh
```

```
#!/bin/bash
python 1.py
python keepbusy.py
```

### 持续监测GPU使用情况
正常的多终端应该使用：`watch -n 1 nvidia-smi`
在slurm系统可用`sgview -j <作业号>` 相当于使用一次

### 缺乏ffmpeg，不一定要从module加载
也可以使用`conda install -c conda-forge ffmpeg`在环境下安装，同样可以使用。

### 修改transformer找缓存的路径
```
export TRANSFORMERS_CACHE=/hpc2hdd/home/user_name/.cache/huggingface/hub
```

### 下载数据集文件
一般是使用`wget 网址`下载文件，如果下载速度太慢，考虑以下：
+ 找国内镜像源
+ 先下载到本地，后使用filezilla软件上传到服务器。这种软件可以看到上传进度并使用多线程，我觉得应该会比VScode传递快。