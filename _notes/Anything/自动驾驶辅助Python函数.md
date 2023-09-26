
来源：课上实验

### 基础
- `cv2.inRange()` 用于颜色选择
- `cv2.fillPoly()` 用于区域选择
- `cv2.line()` 在给定端点的图像上画线
- `cv2.addWeighted()` 添加/覆盖两个图像
- `cv2.cvtColor()` 灰度化或改变颜色
- `cv2.imwrite()` 将图像输出到文件
- `cv2.bitwise_and()` 对图像（灰度图像或彩色图像均可）每个像素值进行二进制“与”操作

### 灰度变换函数：

```
def grayscale(img):
    return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
```

cv2.cvtColor(p1,p2) 是颜色空间转换函数，p1是需要转换的图片，p2是转换成何种格式。

- `cv2.COLOR_BGR2RGB` 将BGR格式转换成RGB格式
- `cv2.COLOR_BGR2GRAY` 将BGR格式转换成灰度图片

这将返回一个只有一个颜色通道的图像。注意:返回的图像是灰度的

### Canny变换函数：

```
def canny(img, low_threshold, high_threshold):
    return cv2.Canny(img, low_threshold, high_threshold)
```

参数解释:

- `img`：源图像
- `low_threshold`：低阈值
- `high_threshold`：高阈值

其中，较大的高阈值用于检测图像中明显的边缘，但一般情况下检测的效果不会那么完美，边缘检测出来是断断续续的。所以这时候用较小的低阈值将这些间断的边缘连接起来。

函数返回的是二值图，包含检测出的边缘。

### 高斯噪声核函数：

```
def gaussian_blur(img, kernel_size):
    return cv2.GaussianBlur(img, (kernel_size, kernel_size), 0)
```

参数解释:

- `img`：原图像
- `(kernel_size, kernel_size)`：高斯核的大小(width, height)；两者都是正奇数。如果设为0，则可以根据sigma得到
- `0`：高斯核标准差，如果为0，则可以根据高斯核的大小来计算得到

使用高斯滤波器模糊图像。

### 应用一个图像掩码：

```
def region_of_interest(img, vertices):
    # 首先定义一个空白掩码
    mask = np.zeros_like(img)   
    
    # 根据输入图像定义一个3通道或1通道颜色来填充掩码
    if len(img.shape) > 2:
        channel_count = img.shape[2]  # 3或4取决于你的图像
        ignore_mask_color = (255,) * channel_count
    else:
        ignore_mask_color = 255
        
    # 用填充色填充由vertices定义的多边形内的像素
    cv2.fillPoly(mask, vertices, ignore_mask_color)
    
    # 只返回掩码像素非零的图像
    masked_image = cv2.bitwise_and(img, mask)
    return masked_image
```

只保留由多边形`vertices`定义的图像区域。图像的其余部分设置为黑色。

cv2.fillPoly(mask, vertices, ignore_mask_color)函数可以用来填充任意形状的图型.可以用来绘制多边形,工作中也经常使用非常多个边来近似的画一条曲线.cv2.fillPoly()函数可以一次填充多个图型.

- `mask`：掩码图像
- `vertices`：填充形状
- `ignore_mask_color`：填充色

### 绘制线段函数

注意:当您想要平均/外推您所检测到的用于绘制整个车道的线段时，这个函数可能是您想要使用的起始点。

根据斜率((y2-y1)/(x2-x1))来划分线段，从而决定哪些线段是左直线的一部分，哪些是右直线的一部分。然后，您可以平均每条线的位置，并推断出车道的顶部和底部。

这个函数用颜色（color）和厚度（thickness）绘制线条（lines）。线被绘制在图像的相应地点上(使图像发生变化)。如果您想让这些线成为半透明的，可以考虑将这个函数与下面的weighted_img()函数结合起来

```
def draw_lines(img, lines, color=[255, 0, 0], thickness=10):
    # In case of error, don't draw the line
    draw_right = True
    draw_left = True
    
    # 求所有直线的斜率，但是只关心abs(slope) > slope_threshold处的线
    slope_threshold = 0.5
    slopes = []
    new_lines = []
    for line in lines:
        x1, y1, x2, y2 = line[0]  # line = [[x1, y1, x2, y2]]
        
        # 计算斜率
        if x2 - x1 == 0.:  # 避免被0除
            slope = 999.  # 设置为几乎无限的斜率
        else:
            slope = (y2 - y1) / (x2 - x1)
            
        # 基于斜率的过滤线
        if abs(slope) > slope_threshold:
            slopes.append(slope)
            new_lines.append(line)
        
    lines = new_lines
    
    # 将线拆分为right_lines和left_lines，分别表示右行和左行
    # 右/左车道线必须有正/负斜率，并且位于图像的右/左半边
    right_lines = []
    left_lines = []
    for i, line in enumerate(lines):
        x1, y1, x2, y2 = line[0]
        img_x_center = img.shape[1] / 2  # 图像中心的x坐标
        if slopes[i] > 0 and x1 > img_x_center and x2 > img_x_center:
            right_lines.append(line)
        elif slopes[i] < 0 and x1 < img_x_center and x2 < img_x_center:
            left_lines.append(line)
            
    # 进行线性回归，找出最适合左右车道线的直线
    # 右车道线
    right_lines_x = []
    right_lines_y = []
    
    for line in right_lines:
        x1, y1, x2, y2 = line[0]
        
        right_lines_x.append(x1)
        right_lines_x.append(x2)
        
        right_lines_y.append(y1)
        right_lines_y.append(y2)
        
    if len(right_lines_x) > 0:
        right_m, right_b = np.polyfit(right_lines_x, right_lines_y, 1)  # y = m*x + b
    else:
        right_m, right_b = 1, 1
        draw_right = False
        
    # 左车道线
    left_lines_x = []
    left_lines_y = []
    
    for line in left_lines:
        x1, y1, x2, y2 = line[0]
        
        left_lines_x.append(x1)
        left_lines_x.append(x2)
        
        left_lines_y.append(y1)
        left_lines_y.append(y2)
        
    if len(left_lines_x) > 0:
        left_m, left_b = np.polyfit(left_lines_x, left_lines_y, 1)  # y = m*x + b
    else:
        left_m, left_b = 1, 1
        draw_left = False
    
    # 找出左右线的两个端点，用来画线
    # y = m*x + b --> x = (y - b)/m
    y1 = img.shape[0]
    y2 = img.shape[0] * (1 - trap_height)
    
    right_x1 = (y1 - right_b) / right_m
    right_x2 = (y2 - right_b) / right_m
    
    left_x1 = (y1 - left_b) / left_m
    left_x2 = (y2 - left_b) / left_m
    
    # 将计算的端点从浮点数转换为整型数
    y1 = int(y1)
    y2 = int(y2)
    right_x1 = int(right_x1)
    right_x2 = int(right_x2)
    left_x1 = int(left_x1)
    left_x2 = int(left_x2)
    
    # 在图像上画出左右线
    if draw_right:
        cv2.line(img, (right_x1, y1), (right_x2, y2), color, thickness)
    if draw_left:
        cv2.line(img, (left_x1, y1), (left_x2, y2), color, thickness)
```

numpy.polyfit(x,y,deg)：进行曲线拟合的函数:

- `x`：x坐标集合
- `y`：y坐标集合
- `deg`：阶数

cv2.line(img, (right_x1, y1), (right_x2, y2), color, thickness)：绘制直线的函数：

- `img`：源图像
- `(right_x1, y1), (right_x2, y2)`：2端点
- `color`：线条的颜色
- `thickness`：线条的粗细

### hough线函数

`img`应该是一个Canny变换的产物。

```
def hough_lines(img, rho, theta, threshold, min_line_len, max_line_gap):
    lines = cv2.HoughLinesP(img, rho, theta, threshold, np.array([]), minLineLength=min_line_len, maxLineGap=max_line_gap)
    #line_img = np.zeros(img.shape, dtype=np.uint8)  # 这就产生了单通道 (灰度) 图像
    line_img = np.zeros((*img.shape, 3), dtype=np.uint8)  # 3通道RGB图像
    draw_lines(line_img, lines)
    #draw_lines_debug2(line_img, lines)
    return line_img
```

返回绘制了hough线的图像。

cv2.HoughLinesP(img, rho, theta, threshold, np.array([]), minLineLength=min_line_len, maxLineGap=max_line_gap)霍夫直线检测函数：

- `img`：源图像，必须是二值图像
- `rho`：线段以像素为单位的距离精度
- `theta`：线段以弧度为单位的角度精度
- `threshold`：累加平面的阈值参数，超过设定阈值才被检测出线段，值越大，基本上意味着检出的线段越长，检出的线段个数越少。
- `np.array([])`：表示储存着检测到的直线的参数对的容器，也就是线段两个端点的坐标。
- `minLineLength`：线段以像素为单位的最小长度
- `maxLineGap`：同一方向上两条线段判定为一条线段的最大允许间隔，超过了设定值，则把两条线段当成一条线段，值越大，允许线段上的断裂越大，越有可能检出潜在的直线段

### 图像权重函数

`img`是hough_lines()的输出，它是一个带有线条的图像。应该是一个空白的图像(全黑)与画在其中的线。

`initial_img`应该是在进行了任何处理之前的图像。

计算的结果图像为:`initial_img * α + img * β + λ`

注意:initial_img和img必须是相同的形状!

```
def weighted_img(img, initial_img, α=0.8, β=1., λ=0.):
    return cv2.addWeighted(initial_img, α, img, β, λ)
```

cv2.addWeighted(initial_img, α, img, β, λ)图像叠加or图像混合加权：

- `initial_img`：图像1
- `α`：图像1权重
- `img`：图像2
- `β`：图像2权重
- `λ`：每个和都加上标量

### 过滤图像函数

过滤图像，只包含黄色和白色像素

```
def filter_colors(image):
    # 过滤白色像素
    white_threshold = 200
    lower_white = np.array([white_threshold, white_threshold, white_threshold])
    upper_white = np.array([255, 255, 255])
    white_mask = cv2.inRange(image, lower_white, upper_white)
    white_image = cv2.bitwise_and(image, image, mask=white_mask)

    # 过滤黄色像素
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    lower_yellow = np.array([90,100,100])
    upper_yellow = np.array([110,255,255])
    yellow_mask = cv2.inRange(hsv, lower_yellow, upper_yellow)
    yellow_image = cv2.bitwise_and(image, image, mask=yellow_mask)

    # 合并以上两张图片
    image2 = cv2.addWeighted(white_image, 1., yellow_image, 1., 0.)

    return image2
```

cv2.inRange(hsv, lower_yellow, upper_yellow)函数设阈值，去除背景部分：

- `hsv`：原图
- `lower_yellow`：lower_red指的是图像中低于这个lower_red的值，图像值变为0
- `upper_yellow`：upper_red指的是图像中高于这个upper_red的值，图像值变为0

而在lower_red～upper_red之间的值变成255