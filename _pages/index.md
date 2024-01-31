---
layout: page
title: Home
id: home
permalink: / 
---

<style>     .container {         display: flex;         align-items: center;  justify-content: space-between;   }          .container img {         width: 300px;         height: 200px;     } </style>  
<div class="container">         <h1>This is Thomas's! 🌱 </h1> <img src='https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/ZFC_8983.JPG' width="300" height="200"> </div>

<p style="padding: 3em 1em; background: #f5f7ff; border-radius: 4px;">
    This is Thomas's personal website. I am major in Artificial Intelligence in <a href="https://www.whu.edu.cn/" style="background: #d5e1ff; padding: 0 3px; border-radius: 3px;">Wuhan University</a>. This website is used for sharing notes of papers and recording experience of projects. The main parts are as follows:
    </p>
  <ol style="background: #f5f7ff;">
    <li style="background: #f5f7ff;"><strong>[[Paper-Reading]]</strong></li>
    <li style="background: #f5f7ff;"><strong>[[Projects]]</strong></li>
    <li style="background: #f5f7ff;"><strong>[[Algorithm and Classes]]</strong></li>
    <li style="background: #f5f7ff;"><strong>[[Life]]</strong></li>
  	<li style="background: #f5f7ff;"><strong><a href="https://docs.google.com/viewer?url=https://raw.githubusercontent.com/Thomas333333/my-own-website/master/_notes/CV-Chinese.pdf">CV</a></strong></li>
  </ol>

---




## Research Interests

Previous research is about:

+ Multimodal compound semantics video retrieval
+ Quantum Computing
+ Video-Language pre-trained model

Current research interests are focused on **Math in AI**、**all kinds of learning theory**、**NLP** **and** **Quantum computing cross application**.

<p style="padding: 3em 1em; background: #f5f7ff; border-radius: 4px;"> 
    <strong>Especially use AI to achieve automatic reasoning, such as solving hard Math problems or Theorem Proof.</strong>
        </p>

**Codes**：<a href='https://github.com/Thomas333333?tab=repositories'>https://github.com/Thomas333333?tab=repositories </a>

---

## Precious Work

+ **College student innovation projects**：Multimodal compound semantic video retrieval inspired by quantum computing（2022.09-2023.09  Supervising teacher：Chao Liang）
  +  **Award**：[Video Browser Showdown 2023 Best Newcomer](https://videobrowsershowdown.org/hall-of-fame/) 
  + **Paper**：[Song, W., **He, J.**, Li, X., Feng, S., & Liang, C. (2023, January). QIVISE: A Quantum-Inspired Interactive Video Search Engine in VBS2023. In *International Conference on Multimedia Modeling* (pp. 640-645). Cham: Springer International Publishing.](https://link.springer.com/chapter/10.1007/978-3-031-27077-2_52)（CCF-C conference paper——Co-first author）
+ **[TREC Video Retrieval Evaluation2023 Ad-hoc Search](https://www-nlpir.nist.gov/projects/tvpubs/tv.pubs.23.org.html)**: 1st in automatic runs and interactive runs（2023.01-2023.11  Supervising teacher：[Chao Liang](https://cs.whu.edu.cn/info/1019/2832.htm)）
  + Lead person
  + Present a speech of our approach and experience in the online meeting in English

+ **《Quantum Computing》assistant**（2022.09-2023.09）
  + Build course content：Quantum neural network
+ Video Browser Showdown 2024  (2024.1.29)
  + TBD


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
