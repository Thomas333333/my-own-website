---
---



### 无障碍自动避障

![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20231024142919.png)

#### 训练过程
![image.png|575](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20231024143648.png)

collison代表碰撞，将从原点位置重新开始
Goal代表得分，进入红框则视为到达终点，根据得分函数更新网络

#### 静态障碍
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20231024144153.png)


#### 运动障碍
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20231024144338.png)

#### 组合障碍
![image.png|525](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20231024144627.png)

在组合障碍中，机器人迟迟无法goal，原地打转甚至超时

![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20231024151327.png)

后续可以改进的点：
+ 设置引导goal，当机器人到这里可以获得较小的奖励，从而增大到达最终goal的概率
+ 更改得分函数，将超时的扣分设置为大于碰撞的扣分，鼓励机器勇敢试错，避免机器摆烂自转。
+ 先用之前训练出的具有避障功能的简单模型作为组合障碍的机器的初始模型。


