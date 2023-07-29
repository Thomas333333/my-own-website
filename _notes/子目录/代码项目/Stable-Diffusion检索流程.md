
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
	- [ ] 大概率问题出在这里。
2.  `merge_result_prob.py`将所有txt文件合并成一个txt文件用作计算指标
	- [ ] 在此之前出了问题
3. `perl_to_excel.py`计算指标
