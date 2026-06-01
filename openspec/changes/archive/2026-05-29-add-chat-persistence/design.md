## Context

当前 messages 状态使用 useState([]) 初始化，每次页面加载都是空数组。对话框打开时会插入 INTRO_MESSAGE，但关闭后数据全部丢失。

## Goals / Non-Goals

**Goals:**
- 消息列表在页面刷新后自动恢复
- "新对话"按钮清除 localStorage 和内存中的消息
- 首次使用（无历史记录）时显示欢迎消息

**Non-Goals:**
- 不支持多会话管理（仅一条对话历史）
- 不跨设备同步（纯本地存储）
- 不设置存储容量限制（消息量通常不大）

## Decisions

- 使用 localStorage key `ai-chat-messages` 存储消息数组 JSON
- useState 初始值从 localStorage 读取，fallback 为空数组
- 每次消息变更时写入 localStorage（useEffect 监听 messages）
- introducedRef 逻辑调整：仅当 localStorage 无历史时显示欢迎消息

## Risks / Trade-offs

- localStorage 容量约 5MB，对话消息通常远小于此限制
- 敏感对话内容会明文存储在本地，对本项目场景可接受
