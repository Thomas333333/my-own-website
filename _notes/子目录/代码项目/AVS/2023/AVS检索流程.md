---
---

1. 用模型提取比赛数据集V3C2的所有图片的特征，并以csv格式存储到服务器上，方便后续根据不同的query都可以反复调用计算相似度。（大概耗时3天，注意存储大小）
2. 根据比赛query提取文本向量，和数据库中所有图片的特征进行相似度计算，然后根据相似度大小进行归一化后排序，保存成csv文件到`/mnt/disk6/fsw/VBS/AVS/result_list`文件夹里。

$$归一化：\frac{value-min}{max-min}(缩放到0-1，用于后面按照权重融合)$$
3. 利用比赛官方给的脚本语言进行测试，得到指标，可以在终端里查看结果；具体结果在`/mnt/disk6/fsw/VBS/AVS/result_list/XLSX`文件里找到你csv文件的评价结果，下载到本地后打开。

### 目前blip模型的结果
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230721121729.png)

### 可以用的资源
(建议服务器上的代码复制一版，尽量不要修改，因为比赛还没结束我们会用到)
+ [blip2特征提取教程](https://github.com/salesforce/LAVIS/blob/3446bac20c5646d35ae383ebe6d13cec4f8b00cb/examples/blip2_feature_extraction.ipynb)
+ 图片特征提取代码`/mnt/disk6/fsw/VBS/AVS/Embedding_models/BLIP/multi_blip1.py`
+ 文本图片检索代码`/mnt/disk6/fsw/VBS/AVS/Embedding_models/BLIP/BLIP.retrieval.py`






