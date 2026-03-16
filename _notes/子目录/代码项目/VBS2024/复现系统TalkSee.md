---
---


### 改进点：
+ 将DRES测试缩小到我们系统展示图片的大小（需要resize），减少记忆负担，直接对比
+ 图片从剪切板直接读取
+ OCR网站
	+ https://simpletex.cn/ai/latex_ocr


### 加入输入文本和权重

#### 前端home_demo1.html
首先调整原本输入框的宽度`.input-container input[type="text"]`为3vh 。同时需要加入新的文本框和滑动条的css样式。
```css 
.input-row {

            display: flex;

            align-items: center;

            margin-top: 10px;

        }

        .input-row input[type="text"] {

            flex-grow: 1;

            margin-right: 10px;

        }

        .input-row input[type="range"] {

            flex-basis: 200px;

        }

        .range-value {

            margin-left: 10px;

            font-family: Arial, sans-serif;

        }
```

在html加入：
```html
<button type="button" id="add-input">+</button>

                <div id="additional-inputs"></div>
```

在javascript中加入：
```JavaScript
document.getElementById('add-input').addEventListener('click', function() {

    var additionalInputs = document.getElementById('additional-inputs');

    var inputRow = document.createElement('div');

    inputRow.className = 'input-row';

    var textInput = document.createElement('input');

    textInput.type = 'text';

    textInput.name = 'additional-text';

    textInput.placeholder = 'Enter text';

    var rangeInput = document.createElement('input');

    rangeInput.type = 'range';

    rangeInput.name = 'additional-range';

    rangeInput.min = '0';

    rangeInput.max = '1';

    rangeInput.step = '0.01';

    var rangeValue = document.createElement('span');

    rangeValue.className = 'range-value';

    rangeValue.textContent = '1'; // 初始值

    // 监听滑动条的值变化

    rangeInput.addEventListener('input', function() {

        rangeValue.textContent = this.value;

    });

    inputRow.appendChild(textInput);

    inputRow.appendChild(rangeInput);

    inputRow.appendChild(rangeValue);

    additionalInputs.appendChild(inputRow);

});
```

其中关于search的点击操作需要传入additional_json，用于传输新加入的文本和权重信息到后台。
```JavaScript
    $("#search").click(function () {

        var csrf_token = $("[name='csrfmiddlewaretoken']").val();

        {% comment %} 新 {% endcomment %}

        var additionalTexts = $("input[name='additional-text']").map(function(){ return $(this).val(); }).get();

        var additionalRanges = $("input[name='additional-range']").map(function(){ return $(this).val(); }).get();

        var additionalData = additionalTexts.map(function(text, index) {

            return { text: text, value: additionalRanges[index] };

        });

        {% comment %} 新 {% endcomment %}

        $("#loading_message").text("正在加载，请稍候...");

        $.ajax({

            url: "/search/",

            method: "post",

            data: {

                'task': $("#task").val(),

                'text': $("#text").val(),

                'image': $("#file").val(),

                {% comment %} 如何在后端拿到 {% endcomment %}

                'additional': JSON.stringify(additionalData),
```

之后在`view.py`修改`search`，接收新参数
```python
additional_json = request.POST.get('additional')

 if additional_json:

            additional_data = json.loads(additional_json)

        else:

            additional_data = None
```

在`new_engine.py`中修改`searchListByText(text, refresh, additional_data)`，加入新参数的同时，修改函数内部
```python
if additional_data is not None:

        for additional_text in additional_data:

            print('additional text is')

            print(additional_text)

            text_feature += float(additional_text['value'])*extract_text_features(additional_text['text'])
```

同时修改`searchListByImage(text, refresh, additional_data)`

### 问题 1.27
- [ ]  AVS任务提交数量
- [x]  Enter？
- [x]  VBS2022测试  
- [x]  人员分配
- [x]  UI界面

#### 前端

+ VQA的提交按钮
+ 文本框变大变小
+ Enter直接search

#### AVS 

- [x]  只展示同个视频


new_engine
+ searchListByText