
参考官方文档[Slurm Documentation](https://slurm.schedmd.com/documentation.html)

+ 需要先分配salloc gpu到这个节点，才能继续后面的操作，比如srun -p --pty bash 

### 出现找不到slrum指令
修改环境变量`export PATH=$PATH:/opt/slurm/bin`

### 快速调试

`srun -p debug -n 4 --gres=gpu:1 --time=00:30:00 --pty bash`
`salloc -p xx  --gres=gpu:1`
