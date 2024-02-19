
分割：ICLR‘22 Language-Driven Semantic Segmentation 
		CVPR'22 GroupViT

目标检测：ICLR'22 Open-vocabulary Object detection via vision and language knowledge distillation


## 多模态论文串讲
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240216182540.png)
a）VSE++  强调视觉嵌入
c）强调模态交互


### ALBEF
8卡机训练3、4天
ITC Loss 
ITM Loss （image text matching）
MTM Loss （masked text）

动量蒸馏

### VLMo（）
动机：
+ mixture of modality expert
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240216204407.png)
+  stagewise pre-training strategy
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240216205444.png)

### BLIP 
202201
 + 文本端作3次forward，训练时间长
 + 引入captioner，让模型自动做了数据清理的工作，使用更高质量的数据集。也引出了很多其他的工作比如Pokemon 、LAION团队清洗出来的600M pairs

### Coca
202205
+ attention pooling 

### BEiT v3
之前的综合
VLMO+ VL BEiT + BEiT v2


