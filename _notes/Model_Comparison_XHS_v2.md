---
title: 三个网页版大模型科研对比（个人小结）
---


>
> 本文是我在科研场景下，用 **Gemini-3.1 Pro / GPT-5.3 / Claude-Sonnet 4.6** 做的一次小范围对比，只看 3 个具体任务，**结论只代表个人体验**。
>
> 完整demo含模型回答截图与打分细则）可以在这里看到：  
> [`https://thomas-s-ai-home.netlify.app/model-comparison`](https://thomas-s-ai-home.netlify.app/model-comparison)
> 本文中 GPT / Claude 均通过 **SoruxGPT** 使用：  
> - SoruxGPT 邀请码：**74e136cb-c728-4977-94f3-70140f310af4**（使用推荐码推荐朋友注册购买，双方可以获得 5R 返现）  
> - SoruxGPT API 邀请码（含 Claude Code / Codex）：**VYGXW79F**

## 测试背景（尽量贴近日常科研）

- 使用场景都是我真实会遇到的需求：  
  1. 找近期论文  
  2. 看懂新出的论文  
  3. 围绕自己手上的问题想下一步实验/idea
- 每个场景各出 3 个 Prompt，分别让三个模型回答，然后我按统一标准打分。
- 为了尽量贴近日常「直接对话」的使用方式：  
  - **Gemini-3.1 Pro**：没有开启耗时的 Deep Research，只用普通聊天模式回答（即使它具备更重的检索/推理能力）；  
  - **GPT-5.3 / Claude-Sonnet 4.6**：在需要联网的任务里开启网页搜索，在纯理解/想法类任务里关闭搜索，只看模型本身的能力。

## 模型与使用方式

- **Gemini-3.1 Pro（网页版）**
  - 官方网页端
  - 截图通过 Gemini Voyage 导出
- **GPT-5.3（网页版）**
  - 使用 SoruxGPT 平台
  - 使用平台提供的截图功能
- **Claude-Sonnet 4.6（网页版）**
  - 使用 SoruxGPT 平台
  - 先导出对话 PDF，再转成图片

这里只记录「使用体验」和「结果大致水平」，不讨论价格、稳定性等因素。

## 任务 1：找论文

目标：  
- 找 2024–2026 年顶会 / 高质量期刊相关论文  
- 看模型能不能：**找对方向、更新、且不只给一条路**

我的平均打分（满分 10 分）：

<table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
  <thead>
    <tr>
      <th style="border-bottom: 1px solid #ddd; padding: 4px;">模型</th>
      <th style="border-bottom: 1px solid #ddd; padding: 4px;">平均得分</th>
      <th style="border-bottom: 1px solid #ddd; padding: 4px;">简短评价</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px;">Gemini-3.1 Pro</td>
      <td style="padding: 4px; font-weight: bold;">6.33</td>
      <td style="padding: 4px;">内容有条理，但受限于检索能力，时效性一般</td>
    </tr>
    <tr>
      <td style="padding: 4px;">GPT-5.3</td>
      <td style="padding: 4px; font-weight: bold;">7.66</td>
      <td style="padding: 4px;">能比较快给到新论文，覆盖面也还可以</td>
    </tr>
    <tr>
      <td style="padding: 4px;">Claude-Sonnet 4.6</td>
      <td style="padding: 4px; font-weight: bold;">8.00</td>
      <td style="padding: 4px;">数量不算多，但常常能点中相对关键的几篇</td>
    </tr>
  </tbody>
</table>

个人结论：  
如果只是「先把相关论文找全一点」，我更倾向先用 **GPT** 做第一轮，再用 **Claude** 看它挑出的重点是否有补充价值。

## 任务 2：论文理解

目标：  
- 直接丢 2026 年的几篇新论文标题/链接  
- 不开搜索，看模型对「没见过的内容」理解到什么程度

平均打分（满分 10 分）：

<table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
  <thead>
    <tr>
      <th style="border-bottom: 1px solid #ddd; padding: 4px;">模型</th>
      <th style="border-bottom: 1px solid #ddd; padding: 4px;">平均得分</th>
      <th style="border-bottom: 1px solid #ddd; padding: 4px;">简短评价</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px;">Gemini-3.1 Pro</td>
      <td style="padding: 4px; font-weight: bold;">6.33</td>
      <td style="padding: 4px;">能大概说清楚，但不太深入</td>
    </tr>
    <tr>
      <td style="padding: 4px;">GPT-5.3</td>
      <td style="padding: 4px; font-weight: bold;">9.00</td>
      <td style="padding: 4px;">对结构、动机、方法讲得比较完整，有时会加一点自己的理解</td>
    </tr>
    <tr>
      <td style="padding: 4px;">Claude-Sonnet 4.6</td>
      <td style="padding: 4px; font-weight: bold;">7.33</td>
      <td style="padding: 4px;">可读性好，但技术细节不如 GPT 展开得多</td>
    </tr>
  </tbody>
</table>

个人感受：  
如果是「快速搞清一篇论文值不值得细看」，我目前更习惯先丢给 **GPT** 看一版，再根据需要自己去原文核对。

## 任务 3：论文 idea / 下一步实验

目标：  
- 给出我现在手上遇到的真实问题（例如：视频到音乐模型训练瓶颈、能力注入效果不理想等）  
- 让模型给出**可能的原因 + 可以尝试的改进方案**

平均打分（满分 10 分）：

<table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
  <thead>
    <tr>
      <th style="border-bottom: 1px solid #ddd; padding: 4px;">模型</th>
      <th style="border-bottom: 1px solid #ddd; padding: 4px;">平均得分</th>
      <th style="border-bottom: 1px solid #ddd; padding: 4px;">简短评价</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px;">Gemini-3.1 Pro</td>
      <td style="padding: 4px; font-weight: bold;">8.00</td>
      <td style="padding: 4px;">给出的路径比较稳妥，接近人类常规思路</td>
    </tr>
    <tr>
      <td style="padding: 4px;">GPT-5.3</td>
      <td style="padding: 4px; font-weight: bold;">9.66</td>
      <td style="padding: 4px;">会把问题拆得比较细，并给出一系列可以按优先级尝试的方案</td>
    </tr>
    <tr>
      <td style="padding: 4px;">Claude-Sonnet 4.6</td>
      <td style="padding: 4px; font-weight: bold;">6.66</td>
      <td style="padding: 4px;">提的建议偏保守，偶尔会有不错的角度，但整体不如 GPT 系统</td>
    </tr>
  </tbody>
</table>

对「一起想实验怎么做」这个任务，目前我最常用的是 **GPT**，因为它更容易给出一条「可以直接写进实验计划」的路线。

## 一个更简单的总结

从这次小范围测试里，我自己的结论是：

- **如果只能选一个当主力科研助手**，我现在会选：**GPT-5.3（网页端）**  
  - 找论文：新、范围广  
  - 理解论文：结构比较清楚  
  - 想 idea：给出的下一步实验比较具体
- **Gemini-3.1 Pro** 更适合用来「整理和解释」，但在「最新信息」上略吃亏  
- **Claude-Sonnet 4.6** 偏向「舒服的表达」和零星的灵感，在这次测试里并不弱，但综合得分略低于 GPT

最后再强调一次：  
- 这只是**一次小样本个人测试**，数据点很少，也没有严格控制变量  
- 如果你研究方向、习惯都和我不一样，结论很可能也不一样  
- 建议有条件的话可以用类似的方式，**围绕自己的科研问题做一轮小测**，会比看别人评分更有参考价值

