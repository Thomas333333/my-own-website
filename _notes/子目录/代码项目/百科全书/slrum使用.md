
参考[港科广HPC用户手册](https://hpc.hkust-gz.edu.cn/docs/hpc12/)
+ 分区名查看[网站](https://hpc.hkust-gz.edu.cn/docs/hpc12/slurm/queue)
+ 申请卡之前最后使用`screen`和`tmux`等指令开启可恢复窗口，避免电脑断点无法连接
+ GPU占用率不满xx%超过9个小时会警告，每个月超过十个警告会停止用户使用权限。所以空闲或者睡觉的时候需要跑`keepbusy.py`占用
+ 目前申请1卡大概等待5h


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
export TRANSFORMERS_CACHE=/hpc2hdd/home/yhuang489/.cache/huggingface/hub
```

