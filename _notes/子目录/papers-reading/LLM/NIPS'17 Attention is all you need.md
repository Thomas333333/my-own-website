---
---

阅读时间：2024.02.02

### Attention 机制
scaled Dot-Product Attention 
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240202160322.png)

存在key-value对，面对query时，首先用query和key的内积计算出对应value值应该赋予的权重，通过softmax层调整为权重之和为1，再乘以对应的value值。上述公式是将向量转换为矩阵的形式进行举证运算加速。

scaled就是除以$\sqrt{d_k}$ 。因为当维度较大时，QK的结果可能极端大或者极端小，softmax后max值靠近1，其他值都靠近0。在之后梯度的下降速度不够快。

![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240202161129.png)

mark的作用是避免tk的时候看到后面的内容。

### multi-head attention
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240202161410.png)

利用linear层将VKQ分别进行多次高维到低维的投影，再使用h次attention计算结果，最后组合。其中linear层的参数需要学习。

### positional encoding 
attention无法获取序列信息。

### 自注意力
QKV就是自己本身。

## 具体结构
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240202163214.png)

左边是编码器，右边是解码器。
编码器开始时候使用的是自注意力，QKV三者是从embedding 得来的，n个词语就有n个向量。
解码器右边的masked是确保不使用之后的内容。中间的attention KV来自编码器，Q来自解码器。

![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240202163708.png)

Feed forward 类似于小MLP（Multilayer Perceptron），从512维扩展到2048维后再回到512维，引入了许多需要训练的参数。

## 与RNN的区别

经过attention后，序列信息已经被汇总了，再分发出去经过Feed forward。RNN是 将上一个序列的输出当做这个训练的出入，逐渐积累信息。 