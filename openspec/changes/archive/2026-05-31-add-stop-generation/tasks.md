## 1. AbortController 集成

- [x] 1.1 在 sendMessage 中创建 AbortController 并将 signal 传入 fetch
- [x] 1.2 将 abortRef.current 指向新建的 AbortController
- [x] 1.3 处理 abort 后的 catch 逻辑，不显示错误消息（用户主动停止）

## 2. 停止按钮 UI

- [x] 2.1 loading 时将"发送"按钮替换为"停止"按钮
- [x] 2.2 点击"停止"按钮调用 abortRef.current.abort()

## 3. 状态恢复

- [x] 3.1 停止后将 loading 置为 false
- [x] 3.2 保留已接收的部分消息内容

## 4. 验证

- [x] 4.1 验证生成过程中显示"停止"按钮
- [x] 4.2 验证点击停止后流式中断，部分内容保留
- [x] 4.3 验证停止后可继续发送新消息
