# Implementation Tasks

## 1. 数据层

- [ ] 1.1 定义多会话数据结构（sessionId, title, messages, createdAt, updatedAt）和 localStorage key `ai-chat-sessions`
- [ ] 1.2 编写数据迁移逻辑：检测旧 `ai-chat-messages` 存在时自动迁移为新格式
- [ ] 1.3 实现会话 CRUD 工具函数（createSession, deleteSession, renameSession, switchSession, getAllSessions）

## 2. 主题扩展

- [ ] 2.1 在 `themes.js` 中添加侧边栏相关颜色 token（sidebarBg, sidebarItemBg, sidebarItemHover, sidebarActiveBg, sidebarActiveText, sidebarBorder）

## 3. UI 组件

- [ ] 3.1 在 `App.jsx` 中实现侧边栏组件（SessionSidebar），包含会话列表和新建按钮
- [ ] 3.2 实现会话列表项：显示标题、时间、hover 时显示删除/重命名按钮
- [ ] 3.3 实现内联重命名：双击标题进入编辑模式，Enter 或失焦保存
- [ ] 3.4 调整模态对话框布局：宽度扩展到 720px，左侧侧边栏（200px）+ 右侧聊天区
- [ ] 3.5 实现侧边栏收起/展开切换按钮（小屏适配）

## 4. 逻辑集成

- [ ] 4.1 重构 App 组件状态管理：从单 messages 改为多会话结构，当前活跃会话 ID
- [ ] 4.2 修改 sendMessage：自动更新当前会话的 title（首条用户消息）和 updatedAt
- [ ] 4.3 修改 newChat：不再清除 localStorage，而是创建新会话并切换
- [ ] 4.4 修改消息持久化逻辑：saveMessages 改为按会话 ID 保存

## 5. 验证

- [ ] 5.1 验证：旧数据迁移 — 含旧 `ai-chat-messages` 时打开应用，数据正确迁移到新格式
- [ ] 5.2 验证：新建/切换/删除/重命名 — 全部操作正常且 localStorage 同步正确
- [ ] 5.3 验证：主题切换 — 侧边栏颜色在 dark/light 模式下正确切换
- [ ] 5.4 验证：侧边栏收起/展开 — 点击切换按钮正常工作，不影响当前对话
- [ ] 5.5 验证：响应式 — 小屏（< 640px）侧边栏默认收起，展开后覆盖聊天区
