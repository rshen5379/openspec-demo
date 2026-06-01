## Why

当前日期显示在页面顶部居中位置，与页面标题重叠，视觉层次不清。需要将日期移至右上角固定位置，同时确保对话框保持居中弹窗模式不被遮挡。

## What Changes

- 将 DateDisplay 组件从页面内容流中移出，改为右上角固定定位
- 恢复对话框为居中弹窗模式（此前被改为右侧面板）
- 恢复遮罩层和 scaleIn 弹出动画

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `date-display`: 日期显示位置从页面顶部居中改为右上角固定定位
- `ai-chat`: Chat UI Layout 恢复居中弹窗布局

## Impact

- 前端布局样式调整，无后端变更
- DateDisplay 组件样式需更新
- App.jsx 主布局结构需恢复为非 flex 两栏模式
