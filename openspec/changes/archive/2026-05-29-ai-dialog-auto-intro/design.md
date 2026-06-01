## Context

对话框打开时原本显示静态欢迎文案，缺乏互动感。需要改为首次打开时自动插入一条 AI 自我介绍消息，后续重新打开不重复。

## Goals / Non-Goals

**Goals:**
- 首次打开对话框时自动显示 AI 自我介绍消息
- 自我介绍以 Markdown 格式展示，介绍 AI 的能力
- 使用 ref 标记是否已发送，避免重复

**Non-Goals:**
- 不调用后端 API，消息为前端本地生成
- 不支持自定义自我介绍内容

## Decisions

- 使用 `introducedRef` (useRef) 标记是否已发送自我介绍，跨打开/关闭不重置
- 自我介绍消息作为常量 `INTRO_MESSAGE` 定义，以 assistant 角色插入消息列表
- 移除原有静态欢迎文案，统一由消息列表渲染

## Risks / Trade-offs

- 无显著风险，纯前端状态管理
