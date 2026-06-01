## 1. 持久化逻辑

- [x] 1.1 添加 localStorage 读写工具函数（loadMessages / saveMessages）
- [x] 1.2 修改 messages 状态初始化，从 localStorage 读取历史
- [x] 1.3 添加 useEffect 监听 messages 变化，自动写入 localStorage

## 2. 欢迎消息逻辑调整

- [x] 2.1 修改对话框打开逻辑：仅当 localStorage 无历史时插入 INTRO_MESSAGE

## 3. 新对话功能

- [x] 3.1 修改 newChat 函数，清除 localStorage 中的消息历史

## 4. 验证

- [ ] 4.1 验证发送消息后刷新页面，对话历史自动恢复
- [ ] 4.2 验证首次打开（无历史）显示欢迎消息
- [ ] 4.3 验证"新对话"按钮清除历史并重新显示欢迎消息
