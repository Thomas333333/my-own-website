
本教程中我们将会用到ros-tutorials程序包，请先在命令行输入以下命令进行安装：
```bash
sudo apt-get install ros-kinetic-ros-tutorials
```
![image.png|500](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230912143247.png)

#### rospack
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230912143803.png)

#### rosed 
使用指令
```bash
$ rosed roscpp Logger.msg
```
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230912151759.png)

## 使用 rqt_console 和 roslaunch
### 安装`rqt` 和 `turtlesim`这两个程序包
```bash
$ sudo apt-get install ros-kinetic-rqt ros-kinetic-rqt-common-plugins ros-kinetic-turtlesim
```
 
### 使用rqt_console和rqt_logger_level

#### roscore
![image.png|425](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230912152027.png)

#### rqt
![image.png|325](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230912152121.png)

#### rqt_logger_level
![image.png|375](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230912152155.png)

#### turtlesim
![image.png|450](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230912152320.png)


在rqt_console可以看到turtlesim节点的输出信息
![image.png|500](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230912152454.png)

将等级修改为warn后，在新终端运行新指令
```bash
$ rostopic pub /turtle1/cmd_vel geometry_msgs/Twist -r 1 -- '[2.0, 0.0, 0.0]' '[0.0, 0.0, 0.0]'
```

![image.png|650](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230912152814.png)

###  使用roslaunch

+ 创建程序包
```
cd ~/catkin_ws/src
catkin_create_pkg beginner_tutorials std_msgs rospy roscpp
```
+ cd切换到新创建的程序包下
+ 再创建一个luanch文件夹
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230912153226.png)
+ 创建一个名为turtlemimic.launch的launch文件并复制以下内容
	+ ns是命名，都使用同一个包`turtlesim`
	+ 启动模仿节点，使turtlesim2模仿turtlesim1
```xml
<launch>

  <group ns="turtlesim1">
    <node pkg="turtlesim" name="sim" type="turtlesim_node"></node>
  </group>

  <group ns="turtlesim2">
    <node pkg="turtlesim" name="sim" type="turtlesim_node"></node>
  </group>

  <node pkg="turtlesim" name="mimic" type="mimic">
    <remap from="input" to="turtlesim1/turtle1"></remap>
    <remap from="output" to="turtlesim2/turtle1"></remap>
  </node>

</launch>
```
+  启动launch文件
```bash
$ roslaunch beginner_tutorials turtlemimic.launch
```
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230912154136.png)
+ 然后我们让turtlesim1运行，会发现turtlesim2也会运行
```bash
$ rostopic pub /turtlesim1/turtle1/cmd_vel geometry_msgs/Twist -r 1 -- '[2.0, 0.0, 0.0]' '[0.0, 0.0, -1.8]'
```
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230912154317.png)

#### rqt

可以通过rqt来更好地理解launch文件，运行rqt_graph。

圆形的就是节点，/minic就是launch文件中新建的模仿节点，输入为turtlesim1的pose，输出为turtlesim2。
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230912154604.png)

## roswtf
#### 安装检查（没有运行roscore）
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230912155050.png)
#### 启动roscore后检查
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230912155209.png)
#### 错误报告
+ 在`ROS_PACKAGE_PATH` 环境变量中设置一个 bad值
	+ 显示bad不存在
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230912155406.png)



