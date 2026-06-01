## Context

DateDisplay 组件当前仅在右上角显示中文日期，使用 `setInterval` 每分钟更新。需要扩展该组件同时展示实时时钟。

## Goals / Non-Goals

**Goals:**
- 在日期下方或同行显示实时时钟（HH:MM:SS）
- 时钟每秒更新
- 与日期保持统一的视觉风格

**Non-Goals:**
- 不支持时区切换
- 不支持 12 小时制
- 不引入第三方时间库

## Decisions

- 复用现有 DateDisplay 组件，扩展为同时显示日期和时间
- 新增 `formatTime` 函数使用 `Intl.DateTimeFormat` 格式化时间
- 将 `setInterval` 间隔从 60 秒改为 1 秒，以驱动时钟更新
- 日期和时间分两行显示，时间字体略小

## Risks / Trade-offs

- 每秒 setState 会触发重渲染，但组件极轻量（纯文本），性能影响可忽略
