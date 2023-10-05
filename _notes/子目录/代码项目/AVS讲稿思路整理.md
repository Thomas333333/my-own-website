
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
#### Relevance Feedback 
##### QRA 
##### Top-K
### Analysis 
###  Conculsion


引用：J. Wu, Z. Hou, Z. Ma, and C.-W. Ngo, “VIREO@trecvid 2021: Ad-hoc video search,” in In NIST TRECVID Workshop, 2021.


## presentation

1. 如何确定权重