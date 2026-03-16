
## 分页
+ 下载软件rectangle
	+ control+option+←/→ 左右分页
	+ 拖拽窗口到四边：全屏/左页/右页/三分之一页

+ 浏览器标签切换：option+command+←/→

## 仿windows操作
+ command + Q 退出软件，即右上角红叉
+ command + W 关闭前段页面，不是退出而是只关掉多个窗口的其中一个
+ command + H 隐藏窗口，command+tab能切换回来
+ command + R刷新浏览器

## 刘海屏菜单栏
+ 使用开源软件`ice`进行管理，通过额外增加一行菜单栏来避免任务图表的丢失遮挡。
  
## 快速全屏
Mac需要点击左上角的绿色按钮进行全屏和退出全屏，太麻烦了。

**操作步骤：**

1. 下载并安装 [Hammerspoon](https://www.hammerspoon.org/)。
    
2. 点击菜单栏图标 -> `Open Config`。
    
3. 粘贴以下 Lua 代码：
可用版本1：
```Lua
local screen = require "hs.screen"
local window = require "hs.window"
local timer = require "hs.timer"
local mouse = require "hs.mouse"

-- ------------------------------------------------
-- 配置区
-- ------------------------------------------------
local corner = "topright"    
local dwellTime = 0.4        -- 停留阈值
local cooldown = 2.0         -- 动画冷却保护
local checkInterval = 0.1    -- 扫描频率

-- ------------------------------------------------
-- 状态变量
-- ------------------------------------------------
GlobalFullscreenWatcher = nil
local enterCornerTime = 0    
local isHovering = false     
local isCoolingDown = false  

-- 【核心新增】复位锁：触发后必须离开一次才能重置
local waitingForLeave = false 

function checkCorner()
    -- 1. 获取坐标
    local pos = mouse.absolutePosition()
    if not pos then return end
    
    local mainScr = screen.mainScreen()
    if not mainScr then return end
    local frame = mainScr:fullFrame()
    local buffer = 10 

    -- 2. 判断当前是否在角落
    local inCorner = (pos.x >= (frame.x + frame.w - buffer)) and (pos.y <= (frame.y + buffer))

    -- 3. 【复位锁逻辑】优先处理
    -- 如果处于"等待离开"状态
    if waitingForLeave then
        if not inCorner then
            -- 只有检测到鼠标真的离开了，才解除锁定
            waitingForLeave = false
            isHovering = false -- 顺便重置悬停状态，防止瞬发
            -- print("🔓 鼠标已离开，逻辑复位")
        end
        -- 如果还在角落里，直接强行终止，不允许做任何事
        return 
    end

    -- 4. 冷却逻辑
    if isCoolingDown then return end

    local now = timer.secondsSinceEpoch()

    -- 5. 标准停留检测逻辑
    if inCorner then
        if not isHovering then
            -- [状态 A] 刚进入
            isHovering = true
            enterCornerTime = now
        elseif (now - enterCornerTime >= dwellTime) then
            -- [状态 B] 停留达标 -> 触发！
            local win = window.focusedWindow()
            if win then
                win:toggleFullScreen()
                
                -- 开启双重保险
                isCoolingDown = true       -- 时间锁：防动画期间操作
                waitingForLeave = true     -- 位置锁：防死赖在角落不走
                
                print("⚡️ 触发全屏 -> 锁定逻辑，请移开鼠标")
                
                -- 仅重置时间锁
                timer.doAfter(cooldown, function() isCoolingDown = false end)
            end
        end
    else
        -- [状态 C] 没触发就离开了
        if isHovering then
            isHovering = false
            enterCornerTime = 0
        end
    end
end

if GlobalFullscreenWatcher then GlobalFullscreenWatcher:stop() end
GlobalFullscreenWatcher = timer.doEvery(checkInterval, checkCorner)

hs.alert.show("全屏脚本 V5 (死锁复位版) 已加载 🛡️")
```

多显示屏+优化效率版本：
```Lua 
local screen = require "hs.screen"
local window = require "hs.window"
local timer = require "hs.timer"
local mouse = require "hs.mouse"
local drawing = require "hs.drawing" -- 引入绘图模块用于调试
-- ------------------------------------------------

-- 配置区

-- ------------------------------------------------

local dwellTime = 0.4 -- 停留阈值

local cooldown = 2.0 -- 冷却时间

local checkInterval = 0.1 -- 轮询间隔

local edgeSize = 10 -- 感应区域大小 (px) -> 建议稍微改大一点点，5px在高分屏太难瞄准

local showDebugZone = true -- 开启调试模式：屏幕变化时显示红色识别区

  

-- ------------------------------------------------

-- 状态变量

-- ------------------------------------------------

GlobalFullscreenWatcher = nil

ScreenWatcher = nil

local enterCornerTime = 0

local isHovering = false

local isCoolingDown = false

local waitingForLeave = false

local updateTimer = nil -- 用于防抖动的定时器

local debugDrawings = {} -- 存储红框框

  

-- 缓存：触发区域列表

-- 结构改为严格的矩形: { x=..., y=..., w=..., h=... }

local triggerZones = {}

  

-- ------------------------------------------------

-- 辅助功能：显示调试红框

-- ------------------------------------------------

function flashTriggerZones()

if not showDebugZone then return end

-- 清除旧框

for _, d in ipairs(debugDrawings) do d:delete() end

debugDrawings = {}

  

-- 绘制新框

for _, zone in ipairs(triggerZones) do

local rect = drawing.rectangle(zone)

rect:setStrokeColor({["red"]=1,["blue"]=0,["green"]=0,["alpha"]=1})

rect:setFill(false)

rect:setStrokeWidth(2)

rect:show()

table.insert(debugDrawings, rect)

end

  

-- 2秒后消失

timer.doAfter(2, function()

for _, d in ipairs(debugDrawings) do d:delete() end

debugDrawings = {}

end)

end

  

-- ------------------------------------------------

-- 缓存更新逻辑 (增加延时防抖)

-- ------------------------------------------------

function updateBounds()

-- 如果已经在等待更新，就取消上一次，重新计时（防抖）

if updateTimer then updateTimer:stop() end

  

-- 延迟 1.0 秒执行，等待 macOS 坐标系完全稳定

updateTimer = timer.doAfter(1.0, function()

triggerZones = {}

local allScreens = screen.allScreens()

print("🖥️ 屏幕布局变更，正在重新计算触发区...")

for i, scr in ipairs(allScreens) do

local frame = scr:fullFrame()

-- 定义一个严格的矩形盒子

local zone = {

x = frame.x + frame.w - edgeSize, -- 左边界

y = frame.y, -- 上边界

w = edgeSize, -- 宽度

h = edgeSize, -- 高度

-- 缓存边界值用于快速比对

maxX = frame.x + frame.w,

maxY = frame.y + edgeSize

}

table.insert(triggerZones, zone)

print(string.format(" >> 屏幕 [%s] 触发区: X[%d-%d], Y[%d-%d]",

scr:name(), zone.x, zone.maxX, zone.y, zone.maxY))

end

-- 闪烁红框提示用户

flashTriggerZones()

end)

end

  

-- ------------------------------------------------

-- 极速检测循环

-- ------------------------------------------------

function checkCorner()

local pos = mouse.absolutePosition()

if not pos then return end

  

local inCorner = false

-- 1. 严格的矩形碰撞检测

for _, zone in ipairs(triggerZones) do

-- 核心修改：不仅检测 > minX，还要检测 < maxX，Y轴同理

-- 这样可以防止鼠标滑到右下角时误触发

if (pos.x >= zone.x) and (pos.x <= zone.maxX) and

(pos.y >= zone.y) and (pos.y <= zone.maxY) then

inCorner = true

break

end

end

  

-- 2. 复位锁逻辑

if waitingForLeave then

if not inCorner then

waitingForLeave = false

isHovering = false

-- print("👋 鼠标离开区域，重置锁")

end

return

end

  

if isCoolingDown then return end

  

if inCorner then

local now = timer.secondsSinceEpoch()

if not isHovering then

isHovering = true

enterCornerTime = now

print("👀 鼠标进入触发区...")

elseif (now - enterCornerTime >= dwellTime) then

local win = window.focusedWindow()

if win then

win:toggleFullScreen()

isCoolingDown = true

waitingForLeave = true

print("⚡️ 触发全屏切换！")

timer.doAfter(cooldown, function() isCoolingDown = false end)

end

end

else

if isHovering then

isHovering = false

enterCornerTime = 0

print("❌ 未达到停留时间，鼠标移出")

end

end

end

  

-- ------------------------------------------------

-- 初始化

-- ------------------------------------------------

if GlobalFullscreenWatcher then GlobalFullscreenWatcher:stop() end

if ScreenWatcher then ScreenWatcher:stop() end

  

-- 监听屏幕变化（分辨率改变、插拔屏幕）

ScreenWatcher = screen.watcher.new(updateBounds)

ScreenWatcher:start()

  

updateBounds() -- 立即执行一次

  

GlobalFullscreenWatcher = timer.doEvery(checkInterval, checkCorner)

  

hs.alert.show("全屏脚本 V9 (带可视调试区) 📺")
```

4. 保存，点击 `Reload Config`。
    
5. **体验：** 只要把鼠标狠狠往右上角一甩，当前窗口就全屏了；再甩一下，退出全屏。**完全免费，极其高效。**


## gemini浏览器拓展推荐

[gemini-voyager](https://github.com/Nagi-ovo/gemini-voyager?tab=readme-ov-file)
