---
~
---

阅读时间：24.1.12

## 思想
训练一个系统来预测哪个文本作为整体与哪个图像配对，而不需要精确预测对应图片的文本单词。给定N个图像文本匹配对，CLIP学习一个联合多模态嵌入空间，最大化N个真实匹配对的余弦相似度，最小化$N^2-N$个错误的匹配对的余弦相似度、对称交叉损失熵（Symmetric Cross Entropy Loss），以下是伪代码：
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240112174903.png)

可以看到，需要学习的有图片到嵌入的投影权重$W_i$，文字到嵌入的投影权重$W_t$，以及温度变量。特征表示到投影空间是一个线性投影（只用了点乘）

### 选择模型
+ image encoder
	+ ResNet50作为图片编码器的基本结构，注意力池化代替全局平局池化
	+ Vision Transformer （ViT）
+ text encoder 
	+ Transformer （a 12-layer 512-wide model with 8 attention heads. ）

在调整深度，宽度和分辨率的实验中，保持两类编码器的宽度增加比例相同。结果发现CLIP对文本编码器的改变不敏感，说明图像编码器包含信息更多，更为重要。

### 实验结果
+ 在零样本学习场景中，CLIP模型达到了与四样本（4-shot）线性分类器平均性能相当的水平。
+ Vision Transformer 比Resnet的计算效率更高
+ CLIP在零样本任务上相比其他模型更具鲁棒性。对于数据集图片风格的变换也能保持基本性能。

### 局限性
+ 如何提高CLIP的计算和数据使用效率










## 收获
zero-shot：零样本任务。指在未学习过测试集的形式的模型直接使用。
