---
---

## 参考资料
+ [IBM-QAOA](https://learn.qiskit.org/course/ch-applications/solving-combinatorial-optimization-problems-using-qaoa)
+ [华为官网QAOA教程](https://www.mindspore.cn/mindquantum/docs/zh-CN/master/quantum_approximate_optimization_algorithm.html)



### Max-Cut问题

Max-Cut问题需要将图中的顶点分成两部分，使得两部分被切割的边最多。当顶点较少时，给定n个顶点，可以通过穷举$2^{n-1}-1$次寻找解。

>但当图中顶点增多时，我们很难找到有效的经典算法来解决Max-Cut问题，因为这类NP-complete问题很有可能不存在多项式时间算法。但尽管精确解不容易得到，我们却可以想办法在多项式时间内找到问题的一个近似解，这就是近似优化算法。

![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230708170808.png)

### Max-Cut问题$\longrightarrow$哈密顿量的基态能量求解

我们对问题进行建模，我们让一个量子比特对应一个顶点，其中量子态
$$\begin{matrix}
 |0\rangle 代表分到第一组\\
|1\rangle代表分到第二组
\end{matrix}$$
因此我们只要找到一个哈密顿量H使得：当有连线的两个顶点处于不同量子态时，哈密顿量的期望值为-1，即

$$\langle01|H|01\rangle=-1,\quad\langle10|H|10\rangle=-1$$

而当有连线的顶点处于相同量子态时，哈密顿量的期望值为0，即

$$\langle00|H|00\rangle=0,\quad\langle11|H|11\rangle=0$$

选择
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230708191130.png)

满足上述性质。我们只要对图中的每条边写出上述哈密顿量，然后将所有边求和。则
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230708191202.png)


| H的基态能量 | H的基态  |
| ----------- | -------- |
| 切割边数    | 切割方案 | 


优化目标：哈密顿量的期望值的绝对值对应切割的边，使其最小化，就可以找到最大切割边数。

%%之所以将不同量子态时的期望值设为-1，是因为在量子神经网络的训练中，Ansatz中的参数的梯度会一直下降，同时测量值也会一直减少%%

> 在量子线路中，哈密顿量 H 对应着量子系统的能量表达和演化。它可以用来描述量子比特之间的相互作用以及量子比特与环境之间的相互作用。我们可以使用**一系列的量子门**来模拟和操作哈密顿量 H。这些量子门可以对量子比特进行操作，改变它们的状态，并模拟系统在哈密顿量作用下的**演化**过程。


### 量子绝热演化

想要使对应哈密顿量的期望值最小化，也就是我们需要找到对应最小期望值的基态$|\psi \rangle$。

>对此我们可以采用量子绝热演化的方法，使系统先处于某一简单哈密顿量HB的基态上，然后使简单的哈密顿量HB绝热地、缓慢地演化至某一复杂的哈密顿量HC，根据绝热定理，系统将始终保持在哈密顿量的基态上，最终达到复杂哈密顿量HC的基态。

==实质上是两个不同的量子线路，第一个量子线路不断优化量子门参数使得HB演化至HC。我们记录这些参数（量子门顺序），在第二个量子线路中，先制备HB的基态，然后对其应用之前的参数，最后进行多次量子观测，最后的观测结果概率最高的就最有可能是HC的基态。==

在这里选取HB=![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230708190752.png)，则
$$其基态对应为|+\rangle ^{\otimes n}$$
（可以证明，在基态时HB的期望值为0，最低）

### ansatz线路
#### 演化方程
t=0时为HB，t=T为HC
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230708204249.png)

当T足够大时，系统将始终处于H（t）的瞬时基态上。存在积分形式：
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230708204523.png)

其中![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230708204602.png)对应一系列量子门，
$$\begin{matrix}
 |\psi (0)\rangle 对应HB
的基态\\|\psi (T)\rangle对应HC的基态
\end{matrix}$$
可根据该公式构造量子线路。

根据trotter公式
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230708204739.png)
代入H（tl）
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230708204854.png)
取N为有限大的整数
$$\begin{matrix}令\beta_l=(1-t_l/T)\Delta t\text{,}\ \ \gamma_l=t_l\Delta t/T
 \\
则原式=\prod_{l=1}^pe^{-i\beta_lH_B}e^{-i\gamma_lH_C}
\end{matrix}$$
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230708205404.png)对应每个量子比特都使用RX门，因为
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230708212603.png)

$$\begin{matrix}e^{-i\beta_lX}=RX(2\beta_l)
 \\
e^{-i\beta_lH_B}=e^{-i\beta_l\sum_{i} X_i}=\prod_{i}RX(2\beta_l) 
\end{matrix}$$


![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230708205507.png)对应ZZ门，由此我们可以根据公式![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230708210909.png)构建量子线路。p代表线路循环次数，p越大，模拟的越好。循环次数受算力制约。





## 难点
1. 限制量子比特个数最多15个。节点个数远超可使用的量子比特数。



