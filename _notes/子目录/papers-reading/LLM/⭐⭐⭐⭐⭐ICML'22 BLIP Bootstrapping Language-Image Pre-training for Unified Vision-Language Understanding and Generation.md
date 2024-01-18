
阅读时间：24.1.18
作者：Junnan Li, Dongxu Li, Caiming Xiong, Steven Hoi


## 1.引言
解决的问题：
+ 大部分VLP只能做理解任务（例如图像文本检索）（编码器结构）或者生成任务（如图像字幕生成）（编解码结构）中的一种。
+ 网络收集的训练数据集有噪音。

模型的两个贡献：
+ 编解码器的混合：在image-text contrastive learning, image-text matching, and image- conditioned language modeling三个目标上联合训练
+ 字幕生成器和过滤：净化数据集。

"bootstrapping" 通常指的是使用自生成的数据来改善模型的学习过程。

## 2.方法

![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240118162324.png)

+ Text encoder:与 Bert相同 ，和图像编码器的输出共同计算ITC（contrastive loss）
+ Image-grounded text encoder:通过在文本编码器的每个transformer 块的自注意（SA）层和的前馈网络（FFN）之间插入一个额外的交叉注意（CA）层来注入视觉信息。特定于任务的[Encode]标记被附加到文本，并且[Encode]的输出嵌入被用作图像-文本对的多模式表示。用ITM（image-text matching loss）来训练，旨在学习图像-文本多模式表示。
+ Image-grounded text decoder：用因果自注意代替双向自注意，计算LM（language model）loss，用来为给定图像生成字幕，使模型具有将视觉信息转换为连贯字幕的泛化能力。