## Why

当前聊天消息只有文字气泡，AI 和用户消息没有视觉区分标识。添加头像可以让对话更加直观，用户一眼就能区分消息来源，提升聊天体验的沉浸感。

## What Changes

- 为 AI 消息左侧添加 AI 头像（使用 CSS/SVG 生成的机器人图标）
- 为用户消息右侧添加用户头像（使用 CSS/SVG 生成的人物图标）
- 头像为圆形，固定尺寸 32x32，使用纯 CSS 实现，无需外部图片资源

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `ai-chat`: Message Display 中消息气泡增加头像展示

## Impact

- 前端：修改 `src/frontend/src/App.jsx` 中 MessageBubble 组件
- 无后端变更
