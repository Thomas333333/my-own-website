---
cssclasses: []
---


在去年的TRECVID比赛中，我们使用的是2023年的[stable-diffusion-v1-5](https://huggingface.co/runwayml/stable-diffusion-v1-5)。在实验中，感觉图片质量并不高，对于人物形状的处理还有待提升。于是萌发了调研最近新的可用模型的想法，供之后的实验使用。

> 本次调研的目的还是落在方便调用和生成质量好这两点上，主要偏向应用而非学术。

### 示例

```
We see a girl in a dark dress pushing the door of a convenience store, after it closes, she runs away. There are two bikes and four trash cans in front of the shop windows. The store's brand colors are green, white and  blue.
```

GT：
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240130144832.png)

| Model | stable-diffusion-v1-5                                                                        |     |     |     |
| ----- | -------------------------------------------------------------------------------------------- | --- | --- | --- |
| image | ![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240302135957.png) |     |     |     |
|       |                                                                                              |     |     |     |







