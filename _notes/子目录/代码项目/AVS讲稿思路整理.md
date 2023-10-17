
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
After referencing last year's team's approach, we chose to utilize embedding models and incorporated some of the successful practices from the previous teams. For automatic runs,we applied classic  Language-Image pre-training models CLIP and its various variants:SLIP,BLIP,BLIP-2,LaCLIP. Besides, we also applied Diffusion model to turn text query into abundant generated pictures in order to attain so-called "mean image query".All models used any other training data with any annotation except V3C2. For those using feedback runs, we used Top-K Feedback and a new algorithm Quantum-Theoretic Interactive Ranking Aggregation (QT-IRA) that adjusts models' weight with relevance feedback. We submit 4 runs for automatic and interactive tasks respectively.  The introduction of each run is shown in Table 1. The official evaluations show that the proposed strategies rank 1 st in both automatic and interactive tracks.
### Introduction 
==The task of Ad-hoc search requires participants modeling user's text query properly to serach for 符合文字描述的视频shot。每个query最多返回前一千个 shot IDs。今年的数据集和去年一样是V3C2，which contains 总时长为1300h的9760个视频。The number of queries 从去年的30个变为今年的20个。Our method is to 将不同Language-Image models下的文字查询和数据集keyframs图片的相似度进行加权融来得到 automatic reuslt. In addition，this year we 使用新的交互方法来使 interactive result 更加优秀。==


The Ad-hoc search task necessitates participants to appropriately model a user's text query to search for video shots that align with the textual description. Each query can return a maximum of 1000 shot IDs. This year's dataset remains consistent with the previous year, being V3C2, which comprises 9760 videos with a total duration of 1300 hours. The number of queries has reduced from 30 last year to 20 this year.Our approach involves weighting the similarity under different Language-Image models between textual queries and keyframe images from the dataset to obtain automatic results. Additionally, this year, we have incorporated a new interaction method to enhance the quality of automatic results. 

### Our Method 
We used following Language-Image pre-trained models to construct our system. 
####  Embedding Models
+ [CLIP](https://github.com/openai/CLIP):RN50x4,RN50x16,RN50x64,RN50,RN101,ViT-B/16,ViT-B/32,ViT-L/14.
+ [SLIP](https://github.com/facebookresearch/SLIP) :ViT-Small,ViT-Base,ViT-Large,ViT-Base(CC3M)，ViT-Base（CC12M）.
+ [BLIP](https://github.com/salesforce/BLIP) :ViT-B(COCO),ViT-B(Flickr30k),ViT-L(COCO),ViT-L(Flickr30k).
+ [BLIP-2](https://github.com/salesforce/LAVIS):blip2-COCO
+ [LaCLIP](https://github.com/LijieFan/LaCLIP):LaCLIP-CC12M
%% 其中，CLIP 在去年的比赛中得到了广泛的应用，于是我们choose is and its newest various variants to 增加系统文字和图片的匹配能力。同样的，为了增强其文字理解能力，我们加入了LaCLIP which使用LLM扩展后的语料库进行重新训练。

对于上述所有模型，我们抽取数据集中每个关键帧的图片向量，并将其保存到数据库中等待检索。当用户输入文字查询后，我们再抽取出对应的文字向量，并与saved 对应模型的 image feature计算相似度。对于相同类型的不同预训练模型，我们将相同关键帧的相似度得分进行等权重相加，并进行归一化。用公式表示为：
$$s^{M}_{id}=norm(\sum_{p \in M} s^{p}_{id}) $$
其中，id表示关键帧对应的 shot id，M代表的模型种类，p表示的是不同的预训练模型。在经过计算后，我们可以得到5个相似度列表。

此外，我们参考了去年队伍的做法，根据文字输入，使用DIffusion的v1-5模型生成1000张图片并使用CLIP的Vit-B/32模型提取图片向量。针对每一个关键帧图片，他的文本向量需要和这1000张图片的图片向量计算相似度后求和并进行归一化。这里我们可以把这种操作看作生成了一个mean image query，从而将跨模态任务转换成同在图片模态上进行比较。在我们的测试中，这种方法在某些CLIP做的较差的查询中表现反而更好。凭借扩散模型，我们可以再得到一个相似度的列表。 %%

In the previous year's competition, CLIP received extensive utilization. Consequently, we chose it and its latest variants to enhance the system's ability to match text and images. Similarly, to augment its text understanding capabilities, we introduced LaCLIP, which underwent retraining using the extended corpus from LLM.

For all the mentioned models, we extract image vectors for each keyframe in the dataset and store them in a database for retrieval. When a user inputs a text query, we then extract the corresponding text vectors and calculate similarity with the saved image features of the corresponding model. For different pre-trained models of the same type, we add up the similarity scores for the same keyframes with equal weights and normalize them. This can be represented by the formula:
$$s^{M}_{id}=norm(\sum_{p \in M} s^{p}_{id}) $$
Here, "id" represents the shot id corresponding to the keyframe, "M" denotes the type of model, "p" represents different pre-trained models. After this computation, we obtain five lists of similarity scores.

Furthermore, we referred to the practices of last year's team. Based on textual input, we employed [the Diffusion model](https://huggingface.co/runwayml/stable-diffusion-v1-5) to generate 1000 images and utilized CLIP's Vit-B/32 model to extract image vectors. For each keyframe image, its text vector needs to be summed and normalized after calculating similarity with the image vectors of these 1000 images. Here, we can view this operation as generating a "mean image query", effectively transforming cross-modal tasks into comparisons within the image modality. In our testing, this method performed even better in certain queries where CLIP underperformed. With the Diffusion model, we obtained another list of similarity scores.
#### Ranking Aggregation
With the mentioned cross-modal models, we acquire multiple score lists ${s_i}$, and the final score can be defined as：

$$s = \sum w_i s_i,$$

which means we need to select an appropriate weight $w_i$, to achieve a relatively optimal result. Typically we set the respective weights heuristically. Based on the practices of previous years' teams and our experimental data, our model parameters are set as shown in the table.

#### Relevance Feedback 

In the Relevance-Feedback (R) runs, we fit the weights according to the users’ feedback. In the following part, we will introduce a Quantum-inspired Ranking Aggregation (QRA) method via users’ feedback on the relevance of the results.

##### Top-K Feedback
In interactive submissions, we can conduct a maximum of three rounds, with interactions involving the top 30 items in each round. To maximize interactions, we promote the shots marked as positive feedback to the top of the list and place the shots marked as negative feedback at the end. This way, the same keyframes won't appear in each round, avoiding repetition.
##### QRA 

A document can be determined by the relevance and non-relevance of a query in the quantum-inspired approaches to information retrieval,

$$\left | d \right \rangle  = \alpha |r \rangle + \tilde{\alpha} |\neg r \rangle$$

where $\left | d \right \rangle$ is the state of the document to be retrieved, $|r  \rangle$ is the relevant state of the query, $|\neg r \rangle$ is the complementary state of $|r \rangle$, $\alpha$ and $\beta$ are the coefficients that subject to $|\alpha|^2 + |\tilde{\alpha}|^2 = 1$.于是，

$$||\left \langle r \right | d\rangle  ||^2= |\alpha|^2 $$represents similarity between the document and the query.

Given a specific query and the weights set heuristically, we can get an initial ranking result. After one round of the user’s interaction, there are the images set with positive feedback $\Phi_+$ and the set with negative feedback $\Phi_-$.

为了保证Top30的结果里尽可能多地出现正反馈图片，尽可能少地出现负反馈，我们希望包含负反馈的模型的权值减小，包含正反馈的模型的权值增加。
To ensure that as many positive feedback images as possible appear in the Top 30 results，we want to decrease the weight of models that include negative feedback and increase the weight of models that include positive feedback.Considering both positive and negative feedback, in the perspective of [1], a new weight $\tilde{w_i}$ of the $i$ th method can be defined as:

$$\begin{aligned}

   \tilde{w_i}&= \frac{1}{|\Phi_+|}\sum_{d_j \in \Phi_+} ||\langle d_j| r\rangle||^2 + \frac{1}{|\Phi_-|}\sum_{d_k \in                \Phi_-} ||\langle d_k|\neg r\rangle||^2 \\
   &= \frac{1}{|\Phi_+|}\sum_{d_j \in \Phi_+} s_{i,d_j} + \frac{1}{|\Phi_-|}\sum_{d_k \in                \Phi_-} \tilde{s}_{i,d_k} \\

            &=\frac{1}{|\Phi_+|}\sum_{d_j \in \Phi_+} s_{i,d_j} + \frac{1}{|\Phi_-|}\sum_{d_k \in \Phi_-} 1 - s_{i,d_k} \\

            &=\frac{1}{|\Phi_+|}\sum_{d_j \in \Phi_+} s_{i,d_j} - \frac{1}{|\Phi_-|}\sum_{d_k \in \Phi_-}s_{i,d_k} + 1

\end{aligned}$$
For the sake of computation simplicity, we can ignore the trailing constants since we only need the change in weight trends. The new weights can be expressed in the following form:

$$ \tilde{w_i}= \frac{1}{|\Phi_+|}\sum_{d \in \Phi_+} s_{i,d} - \frac{1}{|\Phi_-|}\sum_{d \in \Phi_-}s_{i,d}$$

To get a smooth update of the weight as well as avoid the updated weights becoming 0, we adopt the weighted average in our experiments:

$$w_i = \alpha \tilde{w}_i + (1 - \alpha)w_i, \alpha =0.9$$

The above feedback interaction can be repeated by iteration.

### Analysis 
#### 融合模型选择
#### 同模态
#### 交互算法


###  Conculsion






## Presentation
### proposal

### Experiment 
1. various language-image model 
	+ The more diverse the types of models, the better the results after fusion.
	+ For models of the same kind, the fewer models that perform poorly, the better the results.
	+ 像一个投票器（集成学习）
		+ 机器学习p171
		+ 多数model认为正确的命中会在融合过程中获得较为靠前的排名
1. mean image query （相同模态下处理）文-文 图-图 在简单语义上能取得较好的成绩
3.用GPT prompt修改题目
过渡：如何确定各个权重以到达最佳效果
无监督算法——效果不佳
引入交互

4. Relevance Feedback：QT-IRA +Top-K
	+ our method 
	+ 反映问题
5. 当我交互时会遇到的问题：

### 总结
1.多元化模型
2.同模态处理
3.交互时
