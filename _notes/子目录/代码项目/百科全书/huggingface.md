
## 下载huggingface的文件
`hf download xx/xx`

从[open-sora项目](https://github.com/hpcaitech/Open-Sora)获得的经验
+ For users from mainland China, try export HF_ENDPOINT=https://hf-mirror.com to successfully download the weights. （可以避免耗费VPN的流量额度，但是下载速度有点慢）

linux上使用`export HF_ENDPOINT=https://hf-mirror.com`可以实现加速


### 方法二：开启官方加速库 `hf_transfer`

Hugging Face 官方提供了一个名为 `hf_transfer` 的库，它使用 Rust 编写，可以实现高速、并行的多线程下载，效果类似于 `aria2`。==镜像网站有限速==

1. **安装 `hf_transfer`**：
```
    pip install -U hf-transfer
```
    
2. **开启加速功能**： 通过设置另一个环境变量来启用它。

```
    export HF_HUB_ENABLE_HF_TRANSFER=1
```