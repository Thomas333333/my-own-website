---
---

## 参考资料
+ [IBM-QAOA](https://learn.qiskit.org/course/ch-applications/solving-combinatorial-optimization-problems-using-qaoa)
+ [华为官网QAOA教程](https://www.mindspore.cn/mindquantum/docs/zh-CN/master/quantum_approximate_optimization_algorithm.html)



### Max-Cut问题

Max-Cut问题需要将图中的顶点分成两部分，使得两部分被切割的边最多。当顶点较少时，给定n个顶点，可以通过穷举$2^{n-1}-1$次寻找解。

>但当图中顶点增多时，我们很难找到有效的经典算法来解决Max-Cut问题，因为这类NP-complete问题很有可能不存在多项式时间算法。但尽管精确解不容易得到，我们却可以想办法在多项式时间内找到问题的一个近似解，这就是近似优化算法。

![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230708170808.png)

Max-Cut问题$\longrightarrow$哈密顿量的基态能量求解