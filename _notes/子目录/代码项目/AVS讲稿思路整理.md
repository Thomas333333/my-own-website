
### 基本构建思路：
+ 多模型融合
	+ 模型种类
		+ BLIP 
		+ CLIP 
		+ SLIP 
		+ LaCLIP （加强最后理解文字的表现能力）
		+ BLIP2 
		+ Diffusion （在object上表现很好）
	+ 融合
		+ 相同模型的基础模型进行等权重融合，最后不同种类的模型按照给出的权重进行加权融合。
+ 交互算法
	+ Top-K
	+ QRA算法


### 论文结构
+ Abstract 
+  Introduction 
+  Our Method 
	+ Embedding Models
	+ Ranking Aggregation
	+ Relevance Feedback 
		+ QRA 
		+ Top-K
+ Analysis 
+ Conculsion

### 最终结果
| Priority | F (1st)   | R (1st)    |
| -------- | --- | ----- |
| 1        |   0.292  | 0.299 |
| 2        |  0.292   | 0.298 |
| 3        |  0.291   | 0.299 |
| 4        | 0.290    | 0.296 | 


## 论文
### Abstract
After referencing last year's team's approach, we chose to utilize embedding models and incorporated some of the successful practices from the previous teams. For automatic runs,we applied classic  Language-Image pre-training models CLIP and its various variants:SLIP,BLIP,BLIP2,LaCLIP. Besides, we also applied Diffusion model to turn text query into abundant generated picture in order to attain so-called "mean image query".All models used any other training data with any annotation except V3C2. For those using feedback runs, we used Top-K Feedback and a new algorithm Quantum-Theoretic Interactive Ranking Aggregation (QT-IRA) that adjusts models' weight with relevance feedback. We submit 4 runs for automatic and interactive tasks respectively.  
The introduction of each run is shown in Table 1. The official evaluations show that the proposed strategies rank 1 st in both automatic and interactive tracks.