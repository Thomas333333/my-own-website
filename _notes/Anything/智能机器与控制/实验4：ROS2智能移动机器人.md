---
---

### 实验一： ROS2移动机器人设置

### 实验二：ROS2移动机器人仿真
#### 在gazebo默认环境的空世界测试虚拟TurtleBot3
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20231010142844.png)


#### 运行 TurtleBot3 world
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20231010143153.png)
由简单对象组成的地图，可以看到小车的视野，修改参数使小车移动

#### TurtleBot3 House
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20231010143515.png)
#### Rviz可视化
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20231010144728.png)
针对TurtleBot3 world
#### 带有TurtleBot3的虚拟SLAM
##### rviz 
Cartographer SLAM
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20231015193944.png)

![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20231015194319.png)
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20231015194350.png)

![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20231015194658.png)

### 实验三：ROS2移动机器人动态避障（基于强化学习）

## 第一阶段（无障碍）

第1阶段是没有障碍的4x4地图。

> 提示:在执行此命令之前，您必须指定TurtleBot3的模型名称。`${TB3_MODEL}`是您在`burger`、`waffle`、`waffle_pi`中使用的模型的名称。如果您想永久地设置export设定，请参考 [Export TURTLEBOT3_MODEL](http://emanual.robotis.com/docs/en/platform/turtlebot3/export_turtlebot3_model) 页面。

在终端中运行：

```
source /opt/ros/dashing/setup.sh
export TURTLEBOT3_MODEL=${TB3_MODEL}
ros2 launch turtlebot3_gazebo turtlebot3_dqn_stage1.launch.py
```

打开另一个终端，运行：

```
source /opt/ros/dashing/setup.sh
export TURTLEBOT3_MODEL=${TB3_MODEL}
ros2 run turtlebot3_dqn dqn_gazebo 1
```

打开另一个终端，运行：

```
source /opt/ros/dashing/setup.sh
export TURTLEBOT3_MODEL=${TB3_MODEL}
ros2 run turtlebot3_dqn dqn_environment
```

打开另一个终端，运行：

```
source /opt/ros/dashing/setup.sh
export TURTLEBOT3_MODEL=${TB3_MODEL}
ros2 run turtlebot3_dqn dqn_agent 1
```

![](https://cslabcg.whu.edu.cn/userfiles/markdown/exp/2020_5/1354ll1590393002.png)

如果要测试训练有素的模型，请使用以下命令。

```
source /opt/ros/dashing/setup.sh
export TURTLEBOT3_MODEL=${TB3_MODEL}
ros2 run turtlebot3_dqn dqn_test 1
```

## 第二阶段（静态障碍）

第2阶段是一个4x4地图，其中包含四个静态圆柱体障碍物。

在终端中运行：

```
source /opt/ros/dashing/setup.sh
export TURTLEBOT3_MODEL=${TB3_MODEL}
ros2 launch turtlebot3_gazebo turtlebot3_dqn_stage2.launch.py
```

打开另一个终端，运行：

```
source /opt/ros/dashing/setup.sh
export TURTLEBOT3_MODEL=${TB3_MODEL}
ros2 run turtlebot3_dqn dqn_gazebo 2
```

打开另一个终端，运行：

```
source /opt/ros/dashing/setup.sh
export TURTLEBOT3_MODEL=${TB3_MODEL}
ros2 run turtlebot3_dqn dqn_environment
```

打开另一个终端，运行：

```
source /opt/ros/dashing/setup.sh
export TURTLEBOT3_MODEL=${TB3_MODEL}
ros2 run turtlebot3_dqn dqn_agent 2
```

![](https://cslabcg.whu.edu.cn/userfiles/markdown/exp/2020_5/1354ll1590393010.png)

如果要测试训练有素的模型，请使用以下命令。

```
source /opt/ros/dashing/setup.sh
export TURTLEBOT3_MODEL=${TB3_MODEL}
ros2 run turtlebot3_dqn dqn_test 2
```

## 第三阶段（运动障碍）

第3阶段是一个4x4地图，其中有四个移动的圆柱体障碍物。

在终端中运行：

```
source /opt/ros/dashing/setup.sh
export TURTLEBOT3_MODEL=${TB3_MODEL}
ros2 launch turtlebot3_gazebo turtlebot3_dqn_stage3.launch.py
```

打开另一个终端，运行：

```
source /opt/ros/dashing/setup.sh
export TURTLEBOT3_MODEL=${TB3_MODEL}
ros2 run turtlebot3_dqn dqn_gazebo 3
```

打开另一个终端，运行：

```
source /opt/ros/dashing/setup.sh
export TURTLEBOT3_MODEL=${TB3_MODEL}
ros2 run turtlebot3_dqn dqn_environment
```

打开另一个终端，运行：

```
source /opt/ros/dashing/setup.sh
export TURTLEBOT3_MODEL=${TB3_MODEL}
ros2 run turtlebot3_dqn dqn_agent 3
```

![](https://cslabcg.whu.edu.cn/userfiles/markdown/exp/2020_5/1354ll1590393019.png)

如果要测试训练有素的模型，请使用以下命令。

```
source /opt/ros/dashing/setup.sh
export TURTLEBOT3_MODEL=${TB3_MODEL}
ros2 run turtlebot3_dqn dqn_test 3
```

## 第四阶段（组合障碍）

第4阶段是一个5x5地图，其中有墙壁和两个移动的圆柱体障碍物。

在终端中运行：

```
source /opt/ros/dashing/setup.sh
export TURTLEBOT3_MODEL=${TB3_MODEL}
ros2 launch turtlebot3_gazebo turtlebot3_dqn_stage4.launch.py
```

打开另一个终端，运行：

```
source /opt/ros/dashing/setup.sh
export TURTLEBOT3_MODEL=${TB3_MODEL}
ros2 run turtlebot3_dqn dqn_gazebo 4
```

打开另一个终端，运行：

```
source /opt/ros/dashing/setup.sh
export TURTLEBOT3_MODEL=${TB3_MODEL}
ros2 run turtlebot3_dqn dqn_environment
```

打开另一个终端，运行：

```
source /opt/ros/dashing/setup.sh
export TURTLEBOT3_MODEL=${TB3_MODEL}
ros2 run turtlebot3_dqn dqn_agent 4
```

![](https://cslabcg.whu.edu.cn/userfiles/markdown/exp/2020_5/1354ll1590393027.png)

如果要测试训练有素的模型，请使用以下命令。

```
source /opt/ros/dashing/setup.sh
export TURTLEBOT3_MODEL=${TB3_MODEL}
ros2 run turtlebot3_dqn dqn_test 4
```