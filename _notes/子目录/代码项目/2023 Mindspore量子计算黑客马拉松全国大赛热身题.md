---
---
### 第一题
受控比特门的操作
```python
X.on(2,[0,1])#.on(int，array)
```

### 第二题
压缩量子比特
```python
circ.compress()#考察量子比特压缩函数、清除不用的函数
```

### 第三题
翻转电路，切换至大头端
```python
reverse_qubits()
```
### 第四题
添加后缀
```python
add_suffix(circ,p)
```

### 第五题
查看TimeEvolution类的函数
```python
TimeEvolution(h).circuit
```

### 第六题
量子线路搭建
```python
from mindquantum.core.circuit import Circuit  # 导入Circuit模块，用于搭建量子线路
from mindquantum.core.circuit import UN  # 导入UN模块
from mindquantum.core.gates import H, X, RZ  # 导入量子门H, X, RZ
encoder = Circuit()  # 初始化量子线路
encoder += UN(H, 4)  # H门作用在每1位量子比特
for i in range(4):  # i = 0, 1, 2, 3
    encoder += RZ(f'alpha{i}').on(i)  # RZ(alpha_i)门作用在第i位量子比特
for j in range(3):  # j = 0, 1, 2
    # 请补充如下代码片段
    encoder += X.on(j+1,j)
    encoder += RZ(f'alpha{j+4}').on(j+1)
    encoder += X.on(j+1,j)
```
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230704232522.png)

### 第七、八、九题
参考文档[https://hiq.huaweicloud.com/tutorial/classification_of_iris_by_qnn](https://hiq.huaweicloud.com/tutorial/classification_of_iris_by_qnn)
