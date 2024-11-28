---
---



## VLM
参考[榜单](https://chat.lmsys.org/?leaderboard)中的Vision部分

| 模型种类           | 价格  | APIkey网站 | 调用方式                                                                                                                           |
| -------------- | --- | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| GPT-4o         |     |          | [教程](https://www.datacamp.com/tutorial/gpt4o-api-openai-tutorial#rdl)                                                          |
| Gemini-1.5-pro |     |          | [教程](https://ai.google.dev/gemini-api/docs/get-started/tutorial?hl=zh-cn&lang=python#generate_text_from_image_and_text_inputs) |
|                |     |          |                                                                                                                                |
|                |     |          |                                                                                                                                |


## 单图能力
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240718171422.png)

text prompt：please write the detail of picture

### Gemini-1.5-flash

```
The picture shows a curved colonnade made of white stone, with a series of columns and a balustrade decorated with intricate carvings. The columns are tall and slender, with smooth, rounded shafts. The balustrade features a variety of sculpted figures and scenes, including mythological creatures, human figures, and floral motifs.  A small trash can is visible in the foreground and two couples sit on benches at the base of the colonnade. The ground is made of small grey stones.  The background features a sunny sky and trees.  The overall effect is one of grandeur and elegance.
```
### Gemini-1.5-pro

```
The photograph captures a sweeping view of a grand, curved colonnade b`athed in bright sunlight. The structure is a majestic display of classical architecture, featuring a series of identical, white columns supporting an elaborately decorated entablature. Relief sculptures adorn the upper sections, hinting at historical or mythological scenes. 

The colonnade encloses a wide, paved courtyard, sparsely populated with a few individuals finding respite on benches along the structure's base. Two figures enjoy each other's company on the left, while another person sits alone further down, emphasizing the vastness and tranquility of the space.

Lush green trees peek from behind the colonnade, their vibrant hues contrasting beautifully with the white stone. A clear, blue sky forms a stunning backdrop, highlighting the architectural details and creating a sense of openness and grandeur. The overall impression is one of serenity, history, and timeless beauty. 
```

### GPT-4o
cost: 0.004852$
time:12s
```
The image depicts a portion of a grand architectural structure featuring a series of tall, elegant columns arranged in a semi-circular formation. This colonnade is part of a larger classical building style with ornate detailing along the tops of the columns and on the balcony above. The columns support an entablature and a balustrade, with decorative elements that reflect classical architecture, possibly of the neoclassical style.

In the foreground, there is a gravel or stone-paved area where a few people are seated on benches, enjoying the atmosphere. Trees are visible in the background, indicating that the structure is situated in an outdoor setting, possibly a park or garden. The sky is clear, suggesting good weather, and the sunlight casts shadows that emphasize the architectural details of the columns and the overall structure.

The serene setting and the historical classical design suggest that this might be part of a monument or a significant public space known for its beauty and historical value.
```

## 多图能力
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240718211532.png)

text prompt:I am working on a video retrieval task, and these are the results returned for a particular query. Please summarize the characteristics of these queries to guess the possible content of the query.

### Gemini-1.5-flash
```
The query is likely about **cycling** or **biking**. 

This can be inferred from the video clips which show a first-person perspective of someone riding a bicycle.  The videos include shots of the handlebars, the rider's hands, and the road ahead.
```
### Gemini-1.5-pro
```
The common characteristic of these images is the first-person perspective of someone riding a bicycle. 

Therefore, the query likely pertains to:

* **"Bike riding"** 
* **"Cycling POV"** 
* **"GoPro bike ride"**
* **"First-person cycling"**

These queries all capture the essence of the images: the viewpoint is from the rider's position, suggesting action and movement. The presence of gloves, handlebars, and the road further reinforces this conclusion. 
```
### GPT-4o
cost:0.020324$
time:12s
```
Based on the provided images, the query likely pertains to bicycle riding, possibly focusing on urban cycling or commuting. Here are some observed characteristics in the images:

1. **Perspective:** All images are taken from a first-person point of view, featuring the handlebar of a bicycle.
2. **Cycling Gear:** The riders are wearing gloves, which is common for cycling.
3. **Clothing:** The clothing varies but seems appropriate for outdoor cycling—some images show long sleeves which can be for safety or biking in varying weather conditions.
4. **Environment:** The backgrounds include roadways and urban settings, indicating the cycling occurs in city environments.
5. **Activity:** The common activity is handling the bicycle, suggesting motion and possibly navigation through city streets.

Given these characteristics, the query could be related to topics like "city bike riding," "bike commuting," "cycling in urban areas," or "first-person cycling videos."
```


## 负反馈能力
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20240718212502.png)

text prompt：The Query is 'A man carrying a bag on one of his shoulders (excluding backbags)'.This image does not match the query, why?

## Gemini-1.5-flash
```
The image shows a man carrying a backpack on his back. The query asks for an image of a man carrying a bag on one of his shoulders, excluding backpacks. 
```
## Gemini-1.5-pro
```
The image doesn't match the query because the query specifically excludes backpacks. The man in the image is clearly wearing a **backpack**, which has two straps and is worn on both shoulders. 

The query is looking for an image of a man carrying a bag with a single strap designed to be worn on one shoulder, like a messenger bag, sling bag, or a duffel bag with a single shoulder strap
```

## GPT-4o
```
The image does not match the query because the man in the photo is carrying a backpack, which is explicitly excluded in the query. The query specifies a man carrying a bag on one of his shoulders (excluding backpacks), and a backpack is carried on both shoulders.
```