
### Introduction 
+ AVS任务解释
+ 与KIS的区别：强调抽象，简短——引出对理解语义的要求较高——嵌入模型

### Step1：Pre-processing 
+ 将官方数据集中的关键帧处理成图片嵌入向量，提前储存，用于计算
+ 5个Embedding models 
	+ CLIP、SLIP是较为经典和常用的模型
	+ BLIP 是我们去年在VBS上使用的模型，在测试任务中大幅超过了CLIP。我们在去年的AVS任务重测试过后，得到了相同的结论。
	+ BLIP-2作为BLIP的改进模型，其效果在同类 Language-Image models也是同样优秀的。
	+ LaCLIP是最近的成果，使用LLM rewrite image cautions of classic dataset for training，相比CLIP取得了一定提升。  
	+ 右边的数字式我们使用的对应模型下的pre-trained model。

### Step 2 &3：
### Step 4 ：
+ 他们的集合产生一个“平均图片查询”

### Step 5 ：
+ 权重是由我们根据各模型在2022AVS题目的表现所人为设置的
+ 