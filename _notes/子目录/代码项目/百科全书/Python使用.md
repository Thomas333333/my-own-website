---
---


## 使用sklearn.nerghbors的NearestNeighbors报错
报错内容如下：
```
 OpenBLAS warning: precompiled NUM_THREADS exceeded, adding auxiliary array for thread metadata. To avoid this warning, please rebuild your copy of OpenBLAS with a larger NUM_THREADS setting or set the environment variable OPENBLAS_NUM_THREADS to 64 or lower corrupted size vs. prev_size
```

解决方法：在命令行输入`export OPENBLAS_NUM_THREADS=1`

## 在大数据集上调试代码时优先使用ipynb
+ 因为ipynb允许你分段运行代码，你可以先加载数据集，可以避免反复运行耗时的事情。加快调试时间。
+ 同时它的报错代码会相比python更详细一些

## conda的环境
在指定位置创建新的conda环境，避免积累到/home目录下面
`conda create --prefix /path/to/your/env_name python=3.10`
+ 但是在`pip install 新包`的时候，还是会下载到/tmp临时文件夹再转移。如果此时遇到`No space left on device`的报错，可以使用`pip install --cache-dir=/mnt/disk6new/wzq/pip_temp your-package-name`指定临时文件夹。

## pip的影响：运行代码的位置是源码还是anaconda的环境

> [!Help] 
> 我发现一个问题，我用的是D:\Anaconda\envs\wx_analyse\Lib\site-packages\pywxdump而不是D:\GithubProject\PyWxDump\pywxdump下的代码，原因是什么？ 
> 我的运行命令是(wx_analyse) PS D:\GithubProject\PyWxDump> python .\pywxdump\cli.py ui 
> 我的安装顺序是 pip install -U pywxdump 
>  git clone https://github.com/xaoyaoo/wxdump_web.git 
>  cd wxdump_web 
>  npm run build 
>  cd .. 
>   git clone https://github.com/xaoyaoo/PyWxDump.git 
>   cp -r wxdump_web/dist PyWxDump/pywxdump/ui/web 
>   cd PyWxDump 
>   python -m pip install -U . 哪一步可能有影响？


o4-mini的回答：
这个问题本质上是 Python 的模块搜索（import resolution）导致的：当你直接用`(wx_analyse) PS D:\GithubProject\PyWxDump> python .\pywxdump\cli.py ui`来运行 `cli.py` 时，Python 会把 `sys.path[0]` 设为 `D:\GithubProject\PyWxDump\pywxdump` 这个目录，而不是它的上一级 `D:\GithubProject\PyWxDump`。此时脚本内部如果写了类似`from pywxdump import some_module`
或者直接 `import pywxdump`，Python 会先去 `sys.path[0]`（也就是 `...\pywxdump` 目录）寻找名为 `pywxdump` 的包。因为当前目录恰好已经是 `pywxdump` 目录本身，Python 并不会把它当做「包的父目录」去解析（也就是说，Python 在 `sys.path[0]` 找不到顶层的 `pywxdump` 包──它只能看到文件夹下的各个 `.py` 文件，却没有一个叫 `pywxdump` 的子文件夹），所以它就会退而求其次，到全局的 `site-packages` 里去找已经安装的 `pywxdump`。因此你看到的、被实际执行的永远是 `D:\Anaconda\envs\wx_analyse\Lib\site-packages\pywxdump` 中的版本，而不是你本地 `D:\GithubProject\PyWxDump\pywxdump` 里的代码。

## flash-attention的使用，最好是下载whl文件
参考链接： https://blog.csdn.net/Thomas33/article/details/149755381?spm=1011.2124.3001.6209

## 读取json 

```python 
with open('data.json', 'r', encoding='utf-8') as file: # 使用 json.load() 解析 JSON 文件 
	data = json.load(file)
```