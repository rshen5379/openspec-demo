## Why

主页面右上角已有日期显示，但缺少实时时间。添加实时时钟可以让用户无需查看系统时钟即可获取当前时间，提升页面信息完整度。

## What Changes

- 在右上角日期旁边添加实时时钟，格式为 HH:MM:SS
- 时钟每秒更新一次
- 与现有日期组件合并展示，保持视觉一致性

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `date-display`: 新增实时时钟显示需求，DateDisplay 组件同时展示日期和时间

## Impact

- 前端：修改 `src/frontend/src/App.jsx` 中的 DateDisplay 组件
- 无后端变更
