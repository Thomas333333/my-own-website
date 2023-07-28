
---
title:
---
阅读时间：2023.6.5

作者：Yongcheng Ding... ——International Center of Quantum Artificial Intelligence for Science and Technology (QuArtist) and Department of Physics, Shanghai University

来源：PRL

日期：

有无代码:无

#### 引言
+ 主动学习的目的是优化模型训练，通过“估计模型”来标记具有<u>最大不确定性</u>的样本。
+ 量子信息检索的关键问题是使测量成本最小化，在没有明确奖励的前提下获取相关信息为下一个任务（下一个电路）做准备
+ 主动学习基于的假设：在一小部分标记样本上训练的模型可以像在所有样本都标记的数据集上训练的模型一样出色
+ （主动学习处理量子信息）考虑了标签的成本，即测量造成的保真度损失。（*预测量损失越多*）它分析信息量最大的模式(量子态)，以提出保证最大知识收获的最小数量的标签(测量)。
+ 每回合标记出弱观测后具有最大不确定性的量子比特后，评估模型更新。这样就能在尽可能轻微扰动量子比特的情况下获取例子信息，在保真度上意味着成本降低。
#### 主动学习
+  样本 $X=\left\{\mathbf{x}_{\mathbf{i}}, y_{i}\right\}_{i=1}^{l}$
	+ $x_i$是d维向量，$y_i$的值可以为1到C，是一个C分类问题
+ 未标记的样本 $U=\left\{\mathbf{x}_{\mathbf{i}}\right\}_{i=l+1}^{l+u}$
	+ $u \gg l$  
+ 通过在每次迭代中加入最有信息的样本，直到添加再多标签对模型也没有好处。
+ （如何评判哪些是最优信息的样本）
+ 最大信息= 模型认为该样本对结果展示出最大不确定性==（永远都会有一个最大的？）==，标记这些样本并利用能使结果稳定下来，对结果影响大，所以含信息高。
+ 两种方法评估不确定性来对U中样本排序
	+ USamp 不确定性抽样：使用单一模型选择具有最大不确定性的样本，并更新模型
		+ 取低置信度的样本$\begin{aligned}x_{\mathrm{LC(least-confindence)}}=\underset{x}{\mathrm{argmax}}(1-P_{\theta}(\hat{y}|x)), \\\hat{y}=\operatorname*{argmax}_{y}(P_{\theta}(y|x)),\end{aligned}$
		+ margin sampling、entropy-based Usamp（概率密度不同），但在处理二值分类是相同的。
	+ QBC委员会查询：多个模型通过投票熵衡量的最低共识来选择样本
	+ $x_{\mathrm{VE(vote-entropy)}}=\operatorname{argmax}_x\left(-\sum_i\frac{V(y_i)}{C}\log\frac{V(y_i)}{C}\right),$
	+ 使熵最大的样本 ,其中$V(y_i)$ 是委员会成员的投票之和。
#### 弱观测
+ 一种von Neumann测量的扩展。在不破坏量子系统量子性的情况下从量子系统中提取信息，称为弱测量。（不可能的，理想情况下）
+ 两个步骤
	+ 量子系统与辅助量子比特进行纠缠
	+ 在辅助比特上投影测量
	+ 辅助比特的高斯波函数$|\Phi\rangle=\int\frac{1}{(2\pi\sigma^2)^\frac{1}{4}}\exp\left(-\frac{q^2}{4\sigma^2}\right)|q\rangle dq,$ 其中$\sigma$ 是量子比特位置的标准差，==一维高斯函数的$\frac{1}{2}$次方==，代表概率振幅
	+ ==后面的公式没懂==

#### 数值模拟（实验）