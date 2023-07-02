---
layout: page
title: Home
id: home
permalink: / 
---

# This is Thomas's! 🌱

<p style="padding: 3em 1em; background: #f5f7ff; border-radius: 4px;">
  这里是Thomas的个人网站，目前在WHU读AI专业。该网站主要用于分享科研论文笔记、同时记录一些接触过的工程文件。主要分为以下几个部分:
  <ol style="background: #f5f7ff;">
    <li style="background: #f5f7ff;"><strong>[[论文阅读]]</strong></li>
    <li style="background: #f5f7ff;"><strong>[[代码项目]]</strong></li>
    <li style="background: #f5f7ff;"><strong>[[算法知识]]</strong></li>
  </ol>
</p>







关于如何利用obsidian和Netlify部署这样的网站可以看我的笔记：[[obsidian发布的免费替代方案]]

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
