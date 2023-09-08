---
layout: page
title: Home
id: home
permalink: / 
---

<style>     .container {         display: flex;         align-items: center;  justify-content: space-between;   }          .container img {         width: 300px;         height: 200px;     } </style>  
<div class="container">         <h1>This is Thomas's! 🌱 </h1> <img src='https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/DSC_7355.JPG' width="300" height="200"> </div>

<p style="padding: 3em 1em; background: #f5f7ff; border-radius: 4px;">
    这里是Thomas的个人网站，目前在WHU读AI专业。该网站主要用于分享科研论文笔记、同时记录一些接触过的工程文件。笔记主要分为以下几个部分:
    </p>
  <ol style="background: #f5f7ff;">
    <li style="background: #f5f7ff;"><strong>[[论文阅读]]</strong></li>
    <li style="background: #f5f7ff;"><strong>[[代码项目]]</strong></li>
    <li style="background: #f5f7ff;"><strong>[[算法知识]]</strong></li>
    <li style="background: #f5f7ff;"><strong>[[生活]]</strong></li>

  </ol>

---




## Research Interest

之前做的研究主要集中在

+ 多模态复合语义视频检索
+ 量子计算的数学框架在AI中的应用
+ 主动学习

目前的研究兴趣集中在**数学在AI中的应用**、**各种learning theory**、**NLP**、**量子计算交叉内容**。

Codes：<a href='https://github.com/Thomas333333?tab=repositories'>https://github.com/Thomas333333?tab=repositories </a>

---

## Precious Work

+ 大创项目：量子计算启发的多模态复合语义视频检索（2022.09-2023.09  指导老师：梁超老师）
  +  [Video Browser Showdown 2023 Best Newcomer](https://videobrowsershowdown.org/hall-of-fame/) 
  + Song, W., **He, J.**, Li, X., Feng, S., & Liang, C. (2023, January). QIVISE: A Quantum-Inspired Interactive Video Search Engine in VBS2023. In *International Conference on Multimedia Modeling* (pp. 640-645). Cham: Springer International Publishing.（CCF-C类 共同一作）
+ 《量子计算》课程助教（2022.09-2023.09）
  + 参与构建课程内容：量子神经网络

---



<strong>Recently updated notes</strong>

<ul>
  {% assign recent_notes = site.notes | sort: "last_modified_at_timestamp" | reverse %}
  {% for note in recent_notes limit: 5 %}
    <li>
      {{ note.last_modified_at | date: "%Y-%m-%d" }} — <a class="internal-link" href="{{ note.url }}">{{ note.title }}</a>
    </li>
  {% endfor %}
</ul>

<style>
  .wrapper {
    max-width: 46em;
  }
</style>
