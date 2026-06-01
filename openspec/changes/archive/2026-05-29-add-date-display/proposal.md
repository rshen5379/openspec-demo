## Why

主页面目前没有任何时间信息展示，用户无法直观感知当前日期。增加日期显示可以提升页面的信息完整度和用户体验。

## What Changes

- 在主页面添加当前日期的显示组件
- 日期格式遵循中文本地化习惯（如：2026年5月29日 星期四）
- 日期随系统时间自动更新

## Capabilities

### New Capabilities
- `date-display`: 主页面日期显示功能，包含日期格式化与自动更新

### Modified Capabilities
- `ai-chat`: Chat UI Layout 需调整以适配页面新增的日期区域

## Impact

- 前端页面布局需调整，为日期显示预留位置
- 无后端 API 变更，纯前端功能
