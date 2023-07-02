---
title: "TKDE'16_Relevance Feedback Algorithms Inspired By Quantum Detection"
--- 
题目：Relevance Feedback Algorithms Inspired By Quantum Detection 

来源：TKDE

日期：2016

有无代码: 无

### 引言
+ 目的：将查询向量投影到由特征向量张成的子空间上，使得相关性量子概率分布与不相关性量子概率分布之间的距离最大化。
+ RF（相关性反馈）：
	+ 正：收集有关检索到的文档的一些相关性评估，并通过在相关文档中找到的术语来扩展查询，
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


### 论文主体
#### 2.1 VSM
> The VSM for IR represents both documents and queries as vectors of the k-dimensional real space $R^{k}$ . This vector space is defined by k basis vectors corresponding to the terms extracted from a document collection; for example, if the document collection stores three documents“orange juice”,“apple juice”and “apple”,the vector space is defined by three canonical basis vectors $e_{1}=\left(\begin{matrix}1&0&0\end{matrix}\right),e_{2}=$
(0 1 0),$e_{3}={\left(\begin{matrix}{0}&{0}&{1}\end{matrix}\right)}$）corresponding to“apple”“juice”and “orange”，and the three documents are repre-sented, respectively, by the following vectors $\begin{pmatrix}0&1&1\end{pmatrix}$
${\left(\begin{array}{l l l l}{1}&{1}&{0}\end{array}\right)},{\left(\begin{array}{l l l}{1}&{0}&{0}\end{array}\right)}$. Each document vector results from the weighted linear combination of the basis vectors which represents the terms extracted from the document collec-tion. In the example above, the weights are binary, that is,l if the term occurs in a document, 0 otherwise.
The retrieval function(相似度) is the inner product between a document vector x and a query vector y

#### 2.2 RF （ Rocchio's algorithm）
+ 使用相关文档和不相关文档![Pasted image 20230629015450.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/Pasted%20image%2020230629015450.png)

#### 2.3 quantum probability
> a probability space can be represented as vectors,matrices and operators between them.


>To each observable value,it is possible to correspond a basis vector of the k-dimensional space. Equivalently,to each observable value,it is possible to correspond a projector of the k-dimensional space. The equivalence relationship between a basis vector x and a projector A is that 
>
>$$A = xx^{\dagger}$$

+ Gleason Theorem

  概率分布可以沿着称为密度矩阵的k维矩阵r的对角线排列 $$\operatorname{diag}(\rho)=(p_1,\ldots,p_k)^{\prime}$$经典概率分布对应的密度矩阵总是对角的，并且具有单位迹，因为对角元素之和为 1
  当使用这种代数形式表示概率空间时，计算概率的函数是密度矩阵$\rho$乘以事件对应的投影得到的矩阵的迹。(感觉投影矩阵对有许多词项的查询是稀疏矩阵)
  
 $$Trace(\rho|x\rangle \langle x|)$$
 
  当密度矩阵的秩为1时，它对应一个向量，称为“状态向量”，等于状态向量与其转置共轭的外积。
  
$$A = xx^{\dagger}$$

  此时可观测量的概率分布完全由状态向量定义。当密度矩阵的秩不为1时，为混合态，可由两个互斥的投影矩阵$A_0,A_1$表示。
  
$$A_0+A_1=1,A_0A_1=0$$

  根据定义 

$$1-tr(\rho A_0)=tr(\rho A_1)$$







### 实验