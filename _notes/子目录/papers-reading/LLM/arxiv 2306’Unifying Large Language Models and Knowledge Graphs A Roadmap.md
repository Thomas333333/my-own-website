
阅读时间：24.1.10

## 1.引言
LLM可以看做一个巨大的知识库，在各种问题上有较好的表现，但是容易产生幻觉，不能给出准确答案且不容易解释。KG由于其图的性质是容易解释的，但是构建困难，性能容易受其大小限制。
+ KG-enhanced LLMs：KG加强LLM
+ LLM-augmented KGs：LLM扩充KG
+ Synergized LLM + KG：互帮互助

## 2.背景
### 2.1 LLM
+ Meta AI （原Facebook）的Llama
+ OpenAI的ChatGPT 
+ Google 的Gemini（多模态）、Palm（文本） 
+ Microsoft的  Phi-2

模型架构

### 2.3 KGs
用三元组（A,B,C）存储结构信息。其中AC是实体，B是关系
+ 百科全书式的KG，如Wikipedia，随着网络自动更新
+ 常识KG，更注重文中的隐性知识
+ 特定领域KG，尺寸较小，内容准确可靠
+ 多模态KG，除了文本还结合了语音和图像

## 3.Roadmap
### 3.1 KG-enhanced LLMs
+ 在预训练阶段将KG和LLM融合
+ 在推理阶段，LLM利用KG检索知识，并解释自己的推理过程。
### 3.2 LLM-augmented KGs
+ 用LLM在语料库中提取实体和关系构建KGs
+ 有效地将结构KG转换为LLM可以理解的搜索
### 3.3 Synergized LLMs +KGs

LPAQA [125] proposes a mining and paraphrasing-based
method to automatically generate high-quality and diverse
prompts for a more accurate assessment of the knowledge
contained in the language model.  （可以用于微调VBS的输入，使其更符合模型）


