---
---


## 使用sklearn.nerghbors的NearestNeighbors报错
报错内容如下：
```
 OpenBLAS warning: precompiled NUM_THREADS exceeded, adding auxiliary array for thread metadata. To avoid this warning, please rebuild your copy of OpenBLAS with a larger NUM_THREADS setting or set the environment variable OPENBLAS_NUM_THREADS to 64 or lower corrupted size vs. prev_size
```

解决方法：在命令行输入`export OPENBLAS_NUM_THREADS=1`