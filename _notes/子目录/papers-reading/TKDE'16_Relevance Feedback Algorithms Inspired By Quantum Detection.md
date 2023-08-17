---
title: "TKDE'16_Relevance Feedback Algorithms Inspired By Quantum Detection"
--- 
题目：Relevance Feedback Algorithms Inspired By Quantum Detection 

作者： Massimo Melucci

来源：TKDE

日期：2016

有无代码: 无

### 1.引言
+ 目的：将查询向量投影到由特征向量张成的子空间上，使得相关性量子概率分布与不相关性量子概率分布之间的距离最大化。
+ RF（相关性反馈）：
	+ 正：收集有关检索到的文档的一些相关性评估信息，并通过在相关文档中找到的术语来扩展查询，
	+ 负：通过在不相关文档中找到的术语来减少查询，
	+ both：或者使用相关或不相关的文档重新加权。
+ pseudo（伪反馈）：e.g.取topK作为相关文件
+ re-weighting的重要性
	+ 不需要对添加的查询词项的重新进行磁盘访问
	+ 不会在修改后的查询中引入嘈杂的术语
	+ 提高召回率（可以将检索到的文档列表中排名较低位置的相关文档移动到最高排名并可供用户访问）
	+ 提高精确度（第一次运行后置于最高等级的不相关文件可能会移至最低等级。）
	+ 应用于上下文搜索，使用从上下文观察到的一些变量（例如最终用户的阅读次数或文档的复杂性）
	+ 最著名的re-weighting:BM25
+ 文章提出：
	+ define signal detection in terms of quantum probability.(The use of vectors and matrices in quantum probability)


### 2.论文主体
#### 2.1 VSM（Vector Space Model）
+ 对于信息检索的VSM，我们可以用k维的实向量空间$R^{k}$表示查询（query）和文件
+ e.g. 三个文件“orange juice”,“apple juice”and “apple”
	+ orange：$(\begin{matrix}{1}&{0}&{0}\end{matrix})$
	+ apple：$(\begin{matrix}{0}&{1}&{0}\end{matrix})$
	+ juice：$(\begin{matrix}{0}&{0}&{1}\end{matrix})$
	+ “orange juice”：$(\begin{matrix}{1}&{0}&{1}\end{matrix})$==（有点类似纠缠的表示）==
	+ ==缺点是当词项很多时，会产生高维稀疏向量==，还存在其他表示方式
+ 相似度由两个向量的内积结果表示
#### 2.2 RF （ Rocchio's algorithm）
+ 使用相关文档和不相关文档调整query向量![Pasted image 20230629015450.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/Pasted%20image%2020230629015450.png)

#### 2.3 quantum probability
##### 2.3.1 背景
在量子力学中，概率空间可以表示为向量、矩阵，以及它们之间的算子。


>To each observable value,it is possible to correspond a basis vector of the k-dimensional space. Equivalently,to each observable value,it is possible to correspond a projector of the k-dimensional space. The equivalence relationship between a basis vector x and a projector A is that 
>
>$$A = xx^{\dagger}$$
>可以举一个k=2时候的例子来理解投影算符的概念。从公式传达出的信息来看，其实它就是x的矩阵表示。

+ x因为是和概率有关，应该满足性质$|x|=1$

##### 2.3.2 Gleason Theorem

  概率分布可以沿着称为密度矩阵的k维矩阵$\rho$的对角线排列 
  $$\operatorname{diag}(\rho)=(p_1,\ldots,p_k)^{\prime}$$经典概率分布对应的密度矩阵总是对角的，并且具有单位迹，因为对角元素之和为 1

  当使用这种代数形式表示概率空间时，计算概率的函数是密度矩阵$\rho$乘以事件对应的投影得到的矩阵的迹。
  
 $$Trace(\rho|x\rangle \langle x|)$$
 当密度矩阵的rank为1时，

  此时可观测量的概率分布完全由状态向量定义。当密度矩阵的秩不为1时，为混合态，可由两个互斥的投影矩阵$A_0,A_1$表示。
  
$$A_0+A_1=1,A_0A_1=0$$

  根据定义 

$$1-tr(\rho A_0)=tr(\rho A_1)$$

该公式解释了为什么使用trace来计算向量空间中事件的概率。

#### 2.4 RF based on quantum detection

中心思想：将query向量投影到基于量子计算的数学框架张成的向量空间中，进行变换修正。


公式证明：
	
$$\sum_{x\in A_i}\left|x'\phi_j\right|^2=\mathrm{tr}(\mathbf{A}_i\phi_j\phi_j')$$

于是状态向量$\phi_j$可以转化成密度矩阵$\rho=\phi \phi'$

#### 2.5  Connection:IR——QM
+ 相关性—— 文档状态，是一种二进制，相关或者不相关
+ 文档——粒子，具有状态向量
+ query——可观察量，投影
+ 


### 3.实验

### 4.自己的感悟

$$Tr(X^TH^{-1}X)= \sum_i x_i^TH^{-1}x_i$$
