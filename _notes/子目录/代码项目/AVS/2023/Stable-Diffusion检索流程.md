---
---


==注意修改路径==
- [ ] 7.28测试 跑分为0
1. 使用`generate_img.py`每一个topics生成1000张图片作为查询模拟
	+ 30 topics 分4个程序跑需要10h
	- [x] 生成的图片符合语义
2. `feature_extractor.py`使用CLIP的ViT-B/32提取每个生成图片的特征向量并保存
	+ 2个topics，每个topic有1000张图片 9min10s，大概5h
	- [x] 找一张图片的特征向量和数据集的特征向量计算并排序，看看top10
		- 7.29测试 top5没有问题
		- ![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230729113646.png)
3. `compute_score.py`使用faiss加速计算生成图片与数据库图片的相似度。
	+ 2个topics ——1h13min  总的 15h
	- [x] 大概率问题出在这里。
		- 是faiss计算的结果并不是相似度，而是一个给分，分数越大，相关性越低，所以应该升序排序，`sorted()`函数内不该加`reverse = True`
4.  `merge_result_prob.py`将所有txt文件合并成一个txt文件用作计算指标
	
5. `perl_to_excel.py`计算指标

- [x] 7.29 23:47 测试成功！终于到正常水平了。![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230729234737.png)
- [ ] 20topics——20x35min~11h40min  明天中午12点，明天可以想想4个优先级的提交思路，和老师汇报一下，或者改一下交互算法。


