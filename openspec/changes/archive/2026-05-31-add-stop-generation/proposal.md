## Why

AI 回复使用流式输出，有时回复过长或方向不对，用户只能等待完成后才能继续操作。添加停止生成按钮可以让用户随时中断回复，提升交互控制感。

## What Changes

- 在输入区域旁添加"停止"按钮，仅在 AI 生成过程中显示
- 使用 AbortController 中断 fetch 流式请求
- 停止后保留已生成的内容，不清空
- 停止后恢复输入状态，用户可继续对话

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `ai-chat`: Loading State Indication 新增停止生成行为

## Impact

- 前端：修改 `src/frontend/src/App.jsx` 中 sendMessage 函数和输入区域 UI
- 无后端变更
