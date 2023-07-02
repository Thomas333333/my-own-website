---
title: "SIGIR'06 Laplacian Optimal Design for Image Retrieval"
---

来源：SIGIR

日期：2006

有无代码:无

### 摘要
+ RF
	+ 学习分类器区分相关和不相关的图像
	+ 假设：排名靠前的图像信息不一定最多
	+ challenge：确定哪些未标记图像如果被标记并用作训练样本，将the most informative
+ 本文提出Laplacian Optimal Design (LOD)
	+ 算法基于回归模型，该模型最小化测量（或标记）图像的最小二乘误差，同时保留图像空间的局部几何结构。具体来说，我们假设如果两个图像彼此足够接近，那么它们的测量（或标签）也接近。通过构造最近邻图，图像空间的几何结构可以用图拉普拉斯算子来描述。
	+ 使用==最佳实验设计==领域的结果来指导我们选择图像子集，这为我们提供了最多的信息。

### 引言
+ 主动学习定义：确定哪些未标记样本如果被标记并用作训练样本，将提供最多的信息，取决于分类器的准确性和数据收集的成本。
+ CBIR引入RF和AL
	+ CBIR为了缩小图像低级特征和人类高级语义之间的检索差距，引入了RF
	+ 然而，一般来说，排名最高的图像可能并不是信息最丰富的图像。在最坏的情况下，用户标记的所有顶部图像可能都是正面的，因此由于缺乏负面示例而无法应用标准分类技术。于是出现由系统主动选择标记图像的需求
+ 基于SVM和基于回归的AL
	+ SVM主动学习的主要缺点是
		+ 估计的边界可能不够准确。
		+ 当没有标记图像时，它可能不会在检索开始时应用。
+ 在统计学中，选择样本进行标记的问题通常称为实验设计。
	+ 目的通常是最大化给定模型的置信度、最小化系统识别的参数方差或最小化模型的输出方差。
	+ 与基于SVM的主动​​学习算法相比，实验设计方法的计算效率要高得多。
	+ 仅考虑测量（或标记）数据，而忽略未测量（或未标记）数据。
+ 提出的LOD算法
	+ 我们将局部性保持正则化器引入到基于标准最小二乘误差的损失函数中。新的损失函数旨在找到一个局部尽可能平滑的分类器。换句话说，如果两个点在输入空间中彼此足够接近，那么它们应该共享相同的标签。

### 论文主体
####  背景
>AL:Given a set of points$\mathcal{A}=\{\mathbf{x}_{1},\mathbf{x}_{2},\cdots,\mathbf{x}_{m}\}$ in $\mathbb{R}^{d}$ , find a subset $\mathcal{B}=\{\mathbf{z}_{1},\mathbf{z}_{2},\cdots,\mathbf{z}_{m}\} \subset \mathcal{A}$ which contains the most informative points. In other words,the points $z_i$ $(i=1,\cdots,k)$can improve the classifier the most if they are labeled and used as training points.

> 最小化误差平方和  $$J_{sse}(\mathbf{w})=\sum\limits_{i=1}^k\left(\mathbf{w}^T\mathbf{z}_i-y_i\right)^2$$
> 协方差矩阵为$\sigma^2 H_{sse}^{-1}$，其中$$H_{sse}=\left(\frac{\partial^2J_{sse}}{\partial\mathbf{w}^2}\right)=\left(\sum\limits_{i=1}^k\mathbf{z}_i\mathbf{z}_i^T\right)=ZZ^T$$>The three most common scalar measures of the size of the parameter covariance matrix in optimal experimental design are: 
>• D-optimal design: determinant of $H_{sse}$ 
>• A-optimal design: trace of $H_{sse}$ .
> • E-optimal design: maximum eigenvalue of $H_{sse}$ .

==由于矩阵行列式和特征值的计算比矩阵迹的计算成本昂贵得多，因此A最优设计比其他两种设计更有效。==

#### LAPLACIAN OPTIMAL DESIGN
有效地利用测量（标记）和未测量（未标记）样本。
##### 3.1 损失函数
+ 如果两个点十分接近，他们的标签也应该接近，设S为相似度矩阵，损失函数后可以添加一项$$J_0(\mathbf{w})=\sum_{i=1}^k\left(f(\mathbf{z}_i)-y_i\right)^2+\frac{\lambda}{2}\sum\limits_{i,j=1}^m\left(f(\mathbf{x}_i)-f(\mathbf{x}_j)\right)^2S_{ij}$$ $$S_{ij}=\left\{\begin{array}{ll}1,&\text{if x}_i\text{is among the p }\text{nearcst neighborhood of x}_j,\\ &\text{or x}_j\text{is among the p }\text{nearest neighborhood of x}_i;\\ 0,&\text{otherwise}.\end{array}\right.$$<u>(S中不同的点的最近邻域也可以扩展，比如说划定一个范围，来动态调整，对于信息较多的点可以增大范围)</u>

>Let $D$ be a diagonal matrix,$D_{ii}=\sum_{j}S_{ij}$, and $L=D-S$ The matrix L is called graph Laplacian in spectral graph theory 3]. Let $\mathbf{y}=\left(y_1,\cdots,y_k\right)^T$ and $X=(\mathrm{x}_{1},\cdots,\mathrm{x}_{m}).$Following some simple algebraic steps, we see that:

### 实验