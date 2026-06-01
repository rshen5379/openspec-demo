## Why

AI 对话框当前为全屏页面布局（100vh），占据整个视口，用户无法同时浏览页面内容。需要将对话框改为页面中央弹框形式，缩小占页面的比例，提升用户体验和页面空间利用率。

## What Changes

- 将 AI 对话框从全屏布局改为 fixed 定位居中弹框（520×620px，不超过 90vw×80vh）
- 添加半透明遮罩层，点击遮罩或按 ESC 键可关闭弹框
- 在页面右下角添加浮动按钮（FAB）用于打开对话框
- 缩小弹框内的字体（14px→13px）和间距，使内容更紧凑
- 为深色和浅色主题新增 overlay、shadow、fabBg、fabHover 颜色变量

## Capabilities

### New Capabilities

（无新增能力）

### Modified Capabilities

- `ai-chat`: 对话框 UI 从全屏布局改为居中弹框形式，新增浮动打开按钮、遮罩层、关闭功能

## Impact

- 前端代码：`src/frontend/src/App.jsx` — 整体布局重构，从全屏改为弹框
- 主题配置：`src/frontend/src/themes.js` — 新增 4 个颜色变量（overlay、shadow、fabBg、fabHover）
