
优先浏览[港科广HPC用户手册](https://hpc.hkust-gz.edu.cn/docs/hpc12/) 

# 目录
+ 0.新手配置
	+ 0.1 Linux指令
	+ 0.2 Anaconda 安装
+ 1.使用资源
	+ 1.1 推荐使用方式：作业提交
	+ 1.2 分配（可交互式）资源
	+ 1.3快速调试
	+ 1.4 Vscode+Easyconnect校外连接
+ 附录：(我遇到的)常见问题

## 0.新手配置
### 0.1 Linux指令
参考科广教程——[常见linux指令](https://hpc.hkust-gz.edu.cn/docs/tools/linux)
### 0.2 Anaconda安装
Anaconda是管理Python环境的工具。
安装流程参考[csdn博客](https://blog.csdn.net/Zlyzjiabjw547479/article/details/147594504?ops_request_misc=%257B%2522request%255Fid%2522%253A%252255e132d9d22b6a65f91aa3de30ac7a3c%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=55e132d9d22b6a65f91aa3de30ac7a3c&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduend~default-2-147594504-null-null.142^v102^pc_search_result_base4&utm_term=anaconda%20linux&spm=1018.2226.3001.4187) 
```
wget https://repo.anaconda.com/archive/Anaconda3-2025.06-1-Linux-x86_64.sh
chmod +x Anaconda3-2025.06-1-Linux-x86_64.sh 
./Anaconda3-2025.06-1-Linux-x86_64.sh 

source ~/.bashrc

#创建环境
conda create -n env_name python=x.x 
# 删除环境
conda remove -n env_name --all
# 激活环境 
conda activate env_name 
# 退出环境
conda deactivate
```




## 1.使用资源
### 1.1 推荐使用方式：作业提交
+ sbatch能够让大家按队列动态地使用资源，避免资源占用和浪费。
+ 参考港科广[作业提交与管理](https://hpc.hkust-gz.edu.cn/docs/hpc12/slurm/job2)
+ 以下为参考模版`script.sh`，运行指令是`sbatch script.sh`。使用指令`squeue -u username`即可看所有作业的运行情况。
```bash 
#!/bin/bash
#SBATCH -p i64m1tga800u       # 指定GPU队列
#SBATCH -o output_%j.txt  # 指定作业标准输出文件，%j为作业号
#SBATCH -e err_%j.txt    # 指定作业标准错误输出文件
#SBATCH -n 8            # 指定CPU总核心数
#SBATCH --gres=gpu:1    # 指定GPU卡数
#SBATCH -D /apps       # 指定作业执行路径为/apps
 
# --- 作业执行的命令 ---

echo "Job started at $(date)"
#激活conda环境
conda activate init
conda activate swift

python run.py

echo "Job ended at $(date)"
```


### 1.2分配（可交互式）资源
+ 使用之前最后使用`screen`和`tmux`等指令开启可恢复窗口，避免电脑断点无法连接。（[screen教程博客](https://blog.csdn.net/dc12499574/article/details/123774867)和[tmux科广教程](https://hpc.hkust-gz.edu.cn/docs/tools/tmux)）
+ 申请GPU使用指令`salloc -p xx -n 4 --gres=gpu:1`。`xx`是对应资源（GPU/CPU）分网站](https://hpc.hkust-gz.edu.cn/docs/hpc12/slurm/queue)
	+ 随后可以使用`srun python xx.py`直接运行
	+ 或者使用`srun --pty bash`调出计算节点的终端，之后可以正常使用`nvidia-smi`和`python xx.py`
	+ 常用的分区指令是`salloc -p i64m1tga800ue -n 4 --gres=gpu:1`

- [!] 适合需要利用GPU展示交互效果的程序，如果是普通的程序建议使用作业提交。 
- [!] GPU占用率不满20%超过3个小时会警告，9个小时会停。停三回这个月就不能用。每个月超过十个作业被停就会冻结HPC。推荐估计一下程序运行时间。
- [!] 注意如果是先`salloc` 再`srun --pty bash`，退出时候第一次使用`exit` 是退出`srun`但是GPU还是在占用，要再次使用`exit`取消任务才算彻底释放

### 1.3 快速调试
`srun -p debug -n 4 --gres=gpu:1 --time=00:30:00 --pty bash`
+ debug分区有8卡40G，每个人最多使用30min，适合快速调试，同时分配等待时间很短。

### 1.4 Vscode+Easyconnect校外连接
+ [HKUST(GZ) Easyconnect安装使用手册](https://itd.hkust-gz.edu.cn/cn/detail-817)
+ 如果遇到报错`WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!`，可能是因为`不同的网络路径 + 服务器密钥本身会更新`。
	+ 可以在终端使用指令`ssh-keygen -R hpc2login.hpc.hkust-gz.edu.cn`来**彻底清除**关于这个服务器的所有旧密钥记录。重新连接，选择`continue`就可以输入密码了。
  + 开启Easyconnect后仍然无法通过Vscode连接HPC，报错：`could not resolve hostname
	+ 考虑将系统的DNS设置为自动，同时关闭网络的IPv6服务。
	+ Mac的设置在WIFI-详细信息-代理-自动配置代理打开，同时WIFI-详细信息-TCP/IP-配置IPv6-从自动改为仅本地链接（这一步会关闭网络的IPv6服务，可能原因是easyconnect不支持IPv6）。之后在终端使用`sudo killall -HUP mDNSResponder`清空一下代理缓存再尝试。
## 附录：(我遇到的)常见问题
### 出现找不到slrum指令
修改环境变量`export PATH=$PATH:/opt/slurm/bin`
+ 想用开机自启使用`vim ~/.bashrc`修改启动设置，将`export PATH=$PATH:/opt/slurm/bin`添加到最后一行
### nvcc --version   没有找到这个指令
`/usr/local`也没有对应的CUDAx.x的文件夹，是因为HPC(High-Performance Computing)/服务器通常使用“模块(module)”来管理软件环境。
+ 运行命令 `module avail`，看看列表里有没有类似 `cuda` 或 `cudatoolkit` 的条目。
+ 从上面的列表里选择一个版本进行加载。例如，加载 12.1 版本：`module load cuda/12.1`
+ 取消load是使用`module unload xx`

### 卡死
`squeue -u <username>` 找到自己的job id ，然后使用`scancel <jobid>`直接中断作业
+ 目前遇到卡死的情况，是在运行module avail之后使用ctrl+C。

### 持续监测GPU使用情况
正常的多终端应该使用：`watch -n 1 nvidia-smi`
在slurm系统可用`sgview -j <作业号>` 相当于使用一次

### 缺乏ffmpeg，不一定要从module加载
也可以使用`conda install -c conda-forge ffmpeg`在环境下安装，同样可以使用。

### 修改transformer找缓存的路径
```
export TRANSFORMERS_CACHE=/hpc2hdd/home/$user_name$/.cache/huggingface/hub
```

### 下载数据集文件
一般是使用`wget 网址`下载文件，如果下载速度太慢，考虑以下：
+ 找国内镜像源
+ 先下载到本地，后使用filezilla软件上传到服务器。这种软件可以看到上传进度并使用多线程，我觉得应该会比VScode传递快。

