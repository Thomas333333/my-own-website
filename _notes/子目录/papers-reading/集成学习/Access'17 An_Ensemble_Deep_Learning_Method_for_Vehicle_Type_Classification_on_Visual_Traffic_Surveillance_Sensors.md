
阅读时间：24.1.12

#### 集成学习分类
+ Bagging是bootstrap aggregating的缩写，which was proposed by Breiman [32] to improve the classification by combining prediction results of models trained independently on randomly generated training sets. 
+ Boosting 迭代训练弱学习器
+ Bucket of models  选择适合集成的模型

#### 模型方法
平衡采样用于增加原始数据集中稀有类的样本数量，训练一组初始化的CNN，通过maximum voting policy 将他们的结果组合。

#### 细节
+ 数据增强技术（翻转，平移等）。样本数量少的类别通过过度抽样随机增加。为了避免过拟合，数量并没有增加到和大类别的数量一样多，而是增加到一个小数字。
+ CNN集合包括ResNet-50、ResNet-101和ResNet-152（**都是ResNet种类的，多样性可能不足**）
+ 模型个数为奇数，避免同票现象
+ 使用多个指标来评判，带有消融实验