---
---


阅读时间：24.1.11

## 1.背景
任务：基于用户正负反馈使用SVM进行CBIR（content based image retrieval）

问题：
+  用户反馈量小，训练出来的SVM不稳定
+ 用户反馈不均匀，当负反馈多于正反馈时，有些不相关的图像可能会被划分为相关图像。
+ SVM中特征向量的维度大于数据集的分类维度，导致模型过拟合，只能区分人类反馈过的图像，在剩余图像上表现较差。

## 3.CLASSIFIER COMMITTEE LEARNING 
### 3.1 Asymmetric Bagging 
主要解决样本不平衡的问题，通过在负反馈中进行采样，使其数量保持和正反馈一致，分给不同的弱分类器进行训练，使他们具有多样性
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240111163653.png)

### 3.2 Random Subspace .
这个特征集难道是指 颜色直方图、饱和度、形状这些特征吗，不充分利用真的可行吗？
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240111173509.png)

### 3.3 融合的两种方式
1.
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240111173728.png)

2.Bayes Sum Rule 

![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240111173750.png)


## 5.实验结果
+ SVM在小训练集下是不稳定的
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240111174035.png)
+ 对于不平衡的数据，SVM的超平面会发生偏移。会偏向具有更多训练个数的类别。
+ 