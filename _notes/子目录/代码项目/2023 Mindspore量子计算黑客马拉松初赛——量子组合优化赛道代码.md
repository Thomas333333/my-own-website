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

#### calc_subqubo(sub_index, x, J, h=None,C=0.0 )
返回修正后的子矩阵 `J_sub`、修正后的节点偏置 `h_sub` 和修正后的常数项 `C_sub`。
+ 将节点状态 `x` 转换为 {-1, +1} 的取值
+ 根据子问题的节点索引 `sub_index` 和完整问题的 QUBO 矩阵 `J`，提取子问题对应的子矩阵 `J_sub`
+ 如果节点偏置列表 `h` 不为 None，则提取子问题对应的节点偏置 `h_sub`，否则设置为全零数组。
+ 计算修正后的节点偏置 `h_sub`。对于子问题中的每个节点，计算其在完整问题中与其他节点的连接边的权重乘以其他节点的状态，并将其累加到对应的节点偏置上。

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
```python
def build_sub_qubo(solution,N_sub,J,h=None,C=0.0):
    '''
    自定义函数选取subqubo子问题。
    例如可简单选择对cost影响最大的前N_sub个变量组合成为subqubo子问题。
    【注】本函数非必须，仅供参考
    
    返回
    subqubo问题变量的指标，和对应的J，h，C。
    '''
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