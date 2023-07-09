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
```python
import os
os.environ['OMP_NUM_THREADS'] = '2'
from itertools import count
import numpy as np
import time
import copy
import sys
import random
import matplotlib.pyplot as plt
import pickle
import numpy as np
from utils import *

'''
本赛题旨在引领选手探索，在NISQ时代规模有限的量子计算机上，求解真实场景中的大规模图分割问题。
本代码为求解最大割
'''
import resource
soft, hard = resource.getrlimit(resource.RLIMIT_AS)
resource.setrlimit(resource.RLIMIT_AS, (1024*1024*4000, hard)) #设置虚拟内存限制4G
N_sub=15 # 量子比特的规模限制

filelist=['./graphs/regular_d3_n40_cut54_0.txt', './graphs/regular_d3_n80_cut108_0.txt',
          './graphs/weight_p0.5_n40_cut238.txt','./graphs/weight_p0.2_cut406.txt',
          './graphs/partition_n80_cut226_0.txt', './graphs/partition_n80_cut231_1.txt'
          ]#图文件


def build_sub_qubo(solution,N_sub,J,h=None,C=0.0):
    '''
    自定义函数选取subqubo子问题。
    例如可简单选择对cost影响最大的前N_sub个变量组合成为subqubo子问题。
    【注】本函数非必须，仅供参考
    
    返回
    subqubo问题变量的指标，和对应的J，h，C。
    '''
    delta_L=[]
    for j in range(len(solution)):
        copy_x=copy.deepcopy(solution)
        copy_x[j]=-copy_x[j]
        x_flip=copy_x
        sol_qubo=calc_qubo_x(J,solution,h=h,C=C)
        x_flip_qubo=calc_qubo_x(J,x_flip,h=h,C=C)
        delta=x_flip_qubo-sol_qubo
        delta_L.append(delta)
    delta_L=np.array(delta_L)
    #print(delta_L)
    sub_index = np.argpartition(delta_L, -N_sub)[-N_sub:] # subqubo子问题的变量们
    #选取能量增量最大的前 N_sub 个变量的索引，存储在 sub_index 中。
    #print('subindex:',sub_index)
    J_sub,h_sub,C_sub = calc_subqubo(sub_index, solution, J, h=h,C=C )
    return sub_index,J_sub,h_sub,C_sub

def solve(sol,G):
    '''
    自定义求解函数。
    例如可简单通过不断抽取N_sub个变量组成subqubo问题并对子问题进行求解，最终收敛到一个固定值。
    或者可采取其他方法...
    
    【注】可任意改变求解过程，但不可使用经典算法如模拟退火，禁忌搜索等提升解质量。请保持输入输出一致。
    
    输入：
    sol （numpy.array）：初始随机0/1比特串，从左到右分别对应从第1到第N个问题变量。
    G （matrix): QUBO问题矩阵
    
    输出：
    sol （numpy.array）：求解结果的0/1比特串
    cut_temp （float）：最终结果的cut值
    '''
    i=0
    while(i<4):
        sub_index,J_sub,h_sub,C_sub=build_sub_qubo(sol,N_sub,G,h=None,C=0)
        #print('before sol:',calc_qubo_x(G, sol))
        sol=solve_QAOA(J_sub,h_sub,C_sub,sub_index,sol,depth=3,tol=1e-5) # You can change the depth and tolerance of QAOA solver
        qubo_temp=calc_qubo_x(G, sol)
        cut_temp =calc_cut_x(G, sol)
 #       print('after subqubo:',qubo_temp,'|cut:',cut_temp)
        i+=1
    return sol, cut_temp


def run():
    """
    Main run function, for each graph need to run for 20 times to get the mean result.
    Please do not change this function, we use this function to score your algorithm. 
    """
    cut_list=[]
    for filename in filelist[:]:
        #print(f'--------- File: {filename}--------')
        g,G=read_graph(filename)
        n=len(g.nodes) # 图整体规模
        cuts=[]
        for turn in range(20):
            #print(f'------turn {turn}------')
            sol=init_solution(n) # 随机初始化解   
            qubo_start = calc_qubo_x(G, sol)
            cut_start =calc_cut_x(G, sol)
            #print('origin qubo:',qubo_start,'|cut:',cut_start)
            solution,cut=solve(sol, G) #主要求解函数, 主要代码实现
            cuts.append(cut)
        cut_list.append(cuts)    
    return np.array(cut_list)  



if __name__== "__main__": 
    #计算分数
    cut_list=run()
    print(cut_list)
    max_arr=np.array([54,108,238,406,226,231])
    size_arr=np.array([40,80,40,80,80,80])
    score=np.array(np.mean(cut_list,axis=1))/max_arr*size_arr
    print('score:',np.sum(score))
    
```

### utils.py

```python 
import numpy as np
import networkx as nx
from scipy.sparse import csr_matrix
from qupack.qaoa import QAOA
from mindquantum.core.operators import QubitOperator, count_qubits
from scipy.optimize import minimize
'''
本文件禁止改动!!!
'''

def read_graph(filename):
    '''
    返回图g，以及QUBO问题对应的矩阵
    g是nx中的图格式，G是QUBO矩阵
    '''
    g=nx.Graph()
    with open(filename,"r") as file:
        print('Nodes Edges:',file.readline())
        for line in file:
            e1,e2=[int(x) for x in line.split()]
            g.add_edge(e1,e2)
    edges=[]
    for i in g.edges:
        edges.append((int(i[0]),int(i[1]),int(1))) 
    edge_list = np.array(edges)
    n=len(g.nodes)
    G = csr_matrix((-1 * edge_list[:, 2], (edge_list[:, 0], edge_list[:, 1])), shape=(n, n)) 
    #CSR 格式的稀疏矩阵适用于表示稀疏图或稀疏矩阵，通过存储非零元素及其对应的行索引和列索引来节省内存空间。
    
    G = (G + G.T)/2 
    #对称矩阵
    return g,G

def calc_subqubo(sub_index, x, J, h=None,C=0.0 ):
    '''
    1.将节点状态 x 转换为 {-1, +1} 的取值，即将节点状态的值大于 0.5 的设置为 +1，小于等于 0.5 的设置为 -1。
    2.
    '''
    
    x = np.sign(x-0.5)
    fix_index=[i for i in range(len(x)) if i not in sub_index ]
    J_sub=(J[:,sub_index])[sub_index]
    
    temp=0
    if h is not None:
        h_sub=h[sub_index]
    else:
        h_sub=np.array([0]*len(sub_index))
    C_sub=float(C)
    # h'
    for i in range(len(h_sub)):
        Jarr=J.toarray()[sub_index[i],fix_index]
        h_sub[i]=h_sub[i]+2*Jarr.dot(x[fix_index])  
    # C'
    if h is not None:
        C_sub+=(h[fix_index]).dot(x[fix_index])
    Jarr=(J[:,fix_index])[fix_index]
    C_sub=C_sub+(Jarr.dot(x[fix_index])).dot(x[fix_index]) 
    return J_sub,h_sub,C_sub

class CallingCounter(object):
    def __init__ (self, func):
        self.func = func
        self.count = 0

    def __call__ (self, *args, **kwargs):
        self.count += 1
        return self.func(*args, **kwargs)

def check_degenerate(J_dict, h):
    nodes=()
    for x in list(J_dict.keys()):
        nodes = nodes+x
    for i in range(len(h)):
        if h[i] == 0 and i not in nodes:
            h[i] += ((i%2)-0.5)*2
    
def build_ham(J_dict,h):
    n_qubits = len(h)
    ham = QubitOperator()
    for node,Jij in J_dict.items():
        if node[0]<node[1]:
            ham += QubitOperator('Z{} Z{}'.format(*node), -2*Jij)
    for i in range(n_qubits):
        ham+= QubitOperator('Z{}'.format(i), -h[i])
    return ham

@CallingCounter
def QAOAsolver(J, h, C, depth = 2, tol=1e-4,info=True):
    n_qubits = len(h)
    J_dict=dict(J.todok())
    ham=build_ham(J_dict,h)
    if count_qubits(ham)<n_qubits: # if some spin are degenerate, randomly specify one term for h
        check_degenerate(J_dict, h) 
        ham=build_ham(J_dict,h) 
    sim = QAOA(n_qubits, depth, ham)
    # 优化门参数gamma和beta使目标哈密顿量的期望值最小化
    init_p = np.random.uniform(size=depth*2)
    def func(x):
        expectation, gamma_grad, beta_grad = sim.get_expectation_with_grad(x[:depth], x[depth:])
        return expectation, gamma_grad + beta_grad
    global Nfeval
    Nfeval = 1
    def callbackF(Xi):
        global Nfeval
        print('{0:4d} Parameters: {1: 3.6f}   {2: 3.6f}  {3: 3.6f}   {4: 3.6f} Expectation: {5: 3.6f}'.format(Nfeval, Xi[0], Xi[1],Xi[2], Xi[3], C-func(Xi)[0]))
        Nfeval += 1
    if info==False:
        callbackF = None  
    res = minimize(func, init_p, method='bfgs', tol=tol,jac=True, callback=callbackF)

    expectation2 = sim.get_expectation(res.x[:depth], res.x[depth:])
    #打印最终得到的max—cut值
    sim.evolution(res.x[:depth], res.x[depth:])
    sol_vec=sim.get_qs()
    ind = np.argmax(np.power(np.abs(sol_vec),2))
    #cost_all=-(sim.get_expectation(ham)).real
    str_sol=str(bin(ind).replace('0b',''))
    str_sol=str_sol.rjust(n_qubits,'0')   
    sol=[1-int(x) for x in str_sol][::-1]
    return np.array(sol)


def solve_QAOA(J_sub,h_sub,C_sub,sub_index,x,depth=2,tol=1e-4):
    '''
    利用QupackQAOA求解子问题
    可调节QAOA求解器depth深度以及tol
    '''
    subqubo=calc_qubo_x(J_sub,x[sub_index],h=h_sub,C=C_sub)
    xarr=np.array(x[sub_index]-0.5)
    xarr=xarr.reshape((-1,1))
    sol2= QAOAsolver(J_sub, h_sub,C_sub,depth=depth, tol=tol, info=False)
    ind=np.argmax(subqubo)
    x[sub_index]=sol2[:]
    return x



def calc_qubo_x(J,x,h=None,C=0):
    #对应x为+1->|0>态，-1->|1>态
    x = np.sign(x-0.5)
    Jterm =  np.sum(J.dot(x) * x, axis=0)
    hterm=0
    if h is not None:
        hterm += h.dot(x)
    qubo_term=Jterm+hterm+C
    #print('J:',Jterm,'h:',hterm,'C:', C)
    return qubo_term


def calc_cut_x(G, x):
    x = np.sign(x-0.5)
    energy = np.sum(G.dot(x) * x, axis=0)
    ret = (energy/2 - 0.5 * G.sum())
    return ret


def init_solution(n): 
    return np.random.randint(2,size=n)


    
```