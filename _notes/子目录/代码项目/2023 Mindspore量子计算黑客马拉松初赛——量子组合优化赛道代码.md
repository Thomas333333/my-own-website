---
---

### 环境配置

```bash
conda create -n env_name python=3.9
pip install mindspore==1.10.1 mindquantum networkx
```

**缺少包qupack**,未公开，只能在华为云平台上使用。

### utils.py

#### read_graph(filename)
返回图g，以及QUBO问题对应的矩阵
+ g是nx中的图格式，G是csr格式的稀疏矩阵

$$G_{ij}=\begin{cases}
  -\frac{1}{2} &if \ x_i与x_j相邻\\
0 & if \ x_i与x_j不相邻
\end{cases}$$

#### calc_subqubo(sub_index, x, J, h=None,C=0.0 )
sub_index是QAOA算法的15量子比特。
fix_index是不在QAOA算法的15量子比特的所有其他比特。
h_sub是一个有sub_index的解向量，目的是使得在仅修改15个节点的位置的情况下，记录该15个节点分到第二组比分到第一组的cut的变化，在哈密顿量中作为Z门的参数，参与QAOA算法优化，使得该哈密顿量为全局最优解。


#### check_degenerate(J_dict, h)
检查 Qbuild_ham(J_dict,h)UBO 问题是否存在退化情况，并对节点偏置进行修正。

#### build_ham(J_dict,h)
计算哈密顿量

#### QAOAsolver(J, h, C, depth = 2, tol=1e-4,info=True)
该函数使用 QAOA 方法求解 QUBO 问题的最优解，通过优化参数使得目标哈密顿量的期望值最小化，从而得到问题的解。

#### solve_QAOA(J_sub,h_sub,C_sub,sub_index,x,depth=2,tol=1e-4)
该函数通过调用 QAOAsolver 函数对子问题进行 QAOA 求解，利用优化得到的解向量更新原解向量，从而逐步求解整个问题。

#### calc_qubo_x(J,x,h=None,C=0)
计算QUBO问题的能量值，用于评估解的优劣程度

#### calc_cut_x(G, x)
计算解向量对应图的割大小

#### init_solution(n)
生成一个随机解向量作为初始解，作为算法起点。




### solve_max_cut.py
1. 随机初始化解向量（节点的分配方案）
2. 利用QupackQAOA求解子问题，将解向量中的其中15个影响力最大的结点进行更新
3. 更新后重新循环4次（循环次数由题目运行时间决定）

#### 关键因素
1. 一次QAOA的时间大概在1.25s，一张图需要跑20次结果。
	+ 如果分数一样依据总运行时间进行排名
	+ 程序总运行时间在1h内。（需调用qupack中的QAOA模拟器进行子问题求解）
![image.png|525](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230710101321.png)

2. 选取子问题求解的方式：在样例代码中，通过计算改变某节点分组后cut的delta值度量影响力，
3. 如何在QAOA算法中修改$H_p$ 

### 解决方案：
给出较为优秀的初始解+更新影响力较大的15个点


### 修改
1. 将影响力由一个点修改后的能量变化改为两个点的。==测试后变化不大==
```python
def build_sub_qubo(solution,N_sub,J,h=None,C=0.0):
    delta_L=[]
    sol_qubo=calc_qubo_x(J,solution,h=h,C=C)
    for j in range(len(solution)):
        copy_x=copy.deepcopy(solution)
        copy_x[j]=-copy_x[j]
        x_flip=copy_x
        total = 0
        for i in range(len(solution)):
            if j==i:
                continue
            copy_new = copy.deepcopy(x_flip)
            copy_new[i]=-copy_new[i]
            ij_filp = copy_new
            ij_flip_qubo=calc_qubo_x(J,ij_flip,h=h,C=C)
        
            delta=ij_flip_qubo-sol_qubo
            total+=delta
        total=total/(len(solution)-1)
        delta_L.append(total)
        
    delta_L=np.array(delta_L)
    #print(delta_L)
    sub_index = np.argpartition(delta_L, -N_sub)[-N_sub:] # subqubo子问题的变量们
    #选取能量增量最大的前 N_sub 个变量的索引，存储在 sub_index 中。
    #print('subindex:',sub_index)
    J_sub,h_sub,C_sub = calc_subqubo(sub_index, solution, J, h=h,C=C )
    return sub_index,J_sub,h_sub,C_sub
```
2. 选取15个点，使得选取的每个点与未选取的每个点的边的连线最少
3. 增加电路循环p
