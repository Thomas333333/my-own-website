---
---

### `score_fusion.py`
读取csv分数文件路径，将对应questionID和帧图片的得分等权重融合，并最终归一化。
用于基础模型的分数融合。

### `QRA算法`
+ QRA_1:题目之间的权重是相同的：相信模型的泛化能力。
	- [x] 交互一次，一次交互三十道题，每道题的权重是相同的
- QRA_2:题目之间的权重是不同的：每个模型在不同的题目上表现有差别。
	- [-] 每道题的权重会作为下一道题的初始权重。
	- [x] 权重是按题目确定的，初始权重都相同
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230714172123.png)

算法2证明逐题目操作效果不错，以算法2为后续测试算法

- [x]  怀疑算法程序写的原理不对，后续需要修改
	- [x] 模型相似度不用平方。按照量子计算原理，概率振幅的平方即为模型得分。
	- [x] 正反馈后的图片需要放到前面，负反馈的图片需要放到最后，使得每轮需要反馈的图片不会重复![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230714210903.png)

- [ ] 加入负反馈，加入视频连续帧（实时取帧）
### 交互心得
1. 存在动作流，不能仅凭单张图片来判断，必须知道上下文。比如：
	+ `716  A drone landing or rising from the ground`
	+ `721  Two persons are seen while at least one of them is speaking in a non-English language outdoors`
2. 只用图片交互，有时也很难判断是否符合query的真实意图。
3. 在处理用prompt处理query时，可以考虑将复杂词汇进行翻译，比如
	+ 717 a dry area  TOP30仍然存在水池地![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230713122920.png)
	+ 730 non-kitchen  因为存在刀这个单词，很多仍然在厨房里。![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230713123617.png)
4. 生成待交互的文件也是43min-1h，交互时间大概20min，生成权重5min，生成csv文件43min-1h
	+ 减少交互时间，TOP30可以取前100000个。生成待交互的图片从43min变为4 min
5. 加入将反馈后的代码添加到列表前后的代码后，运行时间超长。主要原因是修改一次值大概需要2.2s，而修改metadata一共四个模型，假设一道题有30个shotID 则会有2.2x30x4=264s 
	+ 加速方法：不修改待融合的metadata，修改融合后的metadata，问题是需要记录三轮反馈所有的反馈记录。
	- [x] 第二轮反馈的时候不需要第一轮的反馈信息，不然反馈项之前随着迭代，权重就不是均等的了。==7.16==
	- [x] 整合成一个python文件，省去一些等待时间 ==7.16==
6. 不敢做负反馈，以及很难判断是否是负反馈，负反馈得分不能超过正反馈得分`1707，1721`
+ A person is ==mixing== ingredients in a bowl, cup, or similar type of containers![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230721100032.png)
+ A person wearing a light t-shirt with dark or black writing on it![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230721100140.png)
+ A man wearing black shorts![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230721100224.png)![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230721100312.png)

### `csv2xml.py`
用于将csv文件转化为xml格式的提交结果。

7.18
刚刚做完第一轮循环，生成了csv结果。明天重新按照读取顺序生成权重new_w，然后进行第二轮反馈。
7.19
+ 用ChatGPT生成的语料训练的Caclip说不定能更好地帮助我们理解query
7.20
+ 算法结果越跑越差，交互算法的问题。首先在反馈列表为空的时候，结果是正常的。
	+ 怀疑是fusion时对列表中正反馈和负反馈的元素进行了提前或者滞后

### 重要时间
+  Final submissions：Washington, DC time on July 31st. 大概是中国7月31日十二点开始。
+ 提交网址：压缩成zip文件，选择自己的id，填写自己的邮箱地址
+ 注意qid要替换成731-750，并且对应的符号需要更换。

### stable-diffusion 
stable-diffusion模型提特征：ViT-B/32
1400s=23min 20s - 30topics/10——33h
虚假4倍加速后 1081s=18min——30h
真实4倍加速后  328s= 5min—— 10h

提取特征用时 1min27s——8700s=2h30min


