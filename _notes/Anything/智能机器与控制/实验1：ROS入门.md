---
---


本教程中我们将会用到ros-tutorials程序包，请先在命令行输入以下命令进行安装：
```bash
sudo apt-get install ros-kinetic-ros-tutorials
```
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230912143247.png)

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


---
### ROS程序包

#### catkin_make
![image.png|500](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919144255.png)

#### 创建beginner_tutorials文件夹
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919144841.png)

#### 查看程序包依赖关系
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919145029.png)

#### 所有文件在运行前需要打开roscore
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919145918.png)


### 实验6

#### Num.msg 
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919152753.png)

#### 插入build_depend 和exec_depend 
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919153017.png)

#### 修改CMakeLists.txt
#### rosmsg show 显示消息
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919153629.png)

#### 修改CMakeLists.txt
![](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919154323.png)
#### rossrv show 显示消息
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919154248.png)


![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919154539.png)

利用catkin_make重新编译
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919154638.png)


### 编写简单的服务器和客户端
将代码写入`scripts/add_two_ints_server.py`
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919155351.png)

```python
#!/usr/bin/env python

from beginner_tutorials.srv import AddTwoInts,AddTwoIntsResponse
import rospy

def handle_add_two_ints(req):
    print "Returning [%s + %s = %s]"%(req.a, req.b, (req.a + req.b))
    return AddTwoIntsResponse(req.a + req.b)

def add_two_ints_server():
    rospy.init_node('add_two_ints_server')#声明节点
    s = rospy.Service('add_two_ints', AddTwoInts, handle_add_two_ints)#声明服务 服务类型：AddTwoInts
    print "Ready to add two ints."
    rospy.spin()#防止代码退出，直到服务关闭“

if __name__ == "__main__":
    add_two_ints_server()
```

#### 编写client节点
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919155708.png)

```python
#!/usr/bin/env python

import sys
import rospy
from beginner_tutorials.srv import *

def add_two_ints_client(x, y):
    rospy.wait_for_service('add_two_ints') #直到服务器端可用
    try:
        add_two_ints = rospy.ServiceProxy('add_two_ints', AddTwoInts)
        resp1 = add_two_ints(x, y)
        return resp1.sum
    except rospy.ServiceException, e:
        print "Service call failed: %s"%e

def usage():
    return "%s [x y]"%sys.argv[0]

if __name__ == "__main__":
    if len(sys.argv) == 3:
        x = int(sys.argv[1])
        y = int(sys.argv[2])
    else:
        print usage()
        sys.exit(1)
    print "Requesting %s+%s"%(x, y)
    print "%s + %s = %s"%(x, y, add_two_ints_client(x, y))
```

编译节点

![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919155929.png)

#### 对servicer和client进行测试
启动server
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919160109.png)

启动client 并测试
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919160829.png)
其中server端返回
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919160924.png)


### 录制和回放数据
rosbag
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919161417.png)
生成记录文件
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919161447.png)

rosbag info 
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919161534.png)

rosbag play xx
乌龟会在没有操控的情况下自动回放

![image.png|475](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919161636.png)

只录取指定内容
````bash
rosbag record -O subset /turtle1/cmd_vel /turtle1/pose
````
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919162105.png)

### TurtleBot导航仿真
gazebo界面
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919162705.png)

rviz界面
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919163115.png)

控制机器人移动
jl分别是左右转向，`，`是前进，i是后退
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919163851.png)

保存地图
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919164823.png)

### 发布器和订阅器
发布器源代码
```python
#!/usr/bin/env python
# license removed for brevity
import rospy
from std_msgs.msg import String

def talker():
    pub = rospy.Publisher('chatter', String, queue_size=10)# 使用消息类型字符串发布到聊天主题
    rospy.init_node('talker', anonymous=True)
    rate = rospy.Rate(10) # 10hz 创建一个Rate对象rate 每秒循环十次
    while not rospy.is_shutdown():
        hello_str = "hello world %s" % rospy.get_time()
        rospy.loginfo(hello_str) # 消息被打印到屏幕，它被写入节点的日志文件，并被写入rosout
        pub.publish(hello_str)
        rate.sleep()

if __name__ == '__main__':
    try:
        talker()
    except rospy.ROSInterruptException:
        pass
```

订阅器源代码
```python
#!/usr/bin/env python
import rospy
from std_msgs.msg import String

def callback(data):
    rospy.loginfo(rospy.get_caller_id() + "I heard %s", data.data)
    
def listener():
    rospy.init_node('listener', anonymous=True)

    rospy.Subscriber("chatter", String, callback)
	#这声明你的节点订阅了类型为std_msgs.string的chatter主题。当接收到新消息时，将以消息作为第一个参数调用回调。
    rospy.spin()

if __name__ == '__main__':
    listener()
```
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919165931.png)

编写完代码后进行编译
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919170110.png)

#### 测试发布器和订阅器

发布器
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919171050.png)

订阅器
![image.png](https://cdn.jsdelivr.net/gh/Thomas333333/MyPostImage/Images/20230919171131.png)
