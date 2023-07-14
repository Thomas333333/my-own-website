---
---


### `score_fusion.py`
读取csv分数文件路径，将对应questionID和帧图片的得分等权重融合，并最终归一化。
用于基础模型的分数融合。

### `QRA算法`
+ 题目之间的权重是相同的：相信模型的泛化能力。
	- [ ] 交互一次，一次交互三十道题，每道题的权重是相同的
- 题目之间的权重是不同的：每个模型在不同的题目上表现有差别。
	- [-] 每道题的权重会作为下一道题的初始权重。
	- [ ] 权重是按题目确定的，初始权重都相同


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
