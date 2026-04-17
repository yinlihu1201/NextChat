# 多自定义 OpenAI 模型配置

## TL;DR

> **快速摘要**: 在设置页面添加独立的选择器区域，支持配置多个自定义 OpenAI 格式的模型，每个模型可独立配置 URL、API Key 和模型名称。选择自定义模型时，现有模型列表不可用。

> **交付物**:
> - 自定义模型配置 Modal（增/删/改）
> - 独立的选择器 UI
> - API 调用适配（使用对应模型的凭证）

> **估计工作量**: Short
> **并行执行**: YES - 3 waves
> **关键路径**: T1 → T2 → T4 → T5

---

## Context

### 原始需求
用户需要支持配置多个自定义 OpenAI 格式的模型，当前只能配置一个。每个模型需要：
- URL: `http://ip:port/v1` 格式
- API Key: 独立的 API 密钥
- 模型名称: modelName

### 需求确认
- **显示名称**: 仅使用模型名 (modelName)
- **配置方式**: 独立 Modal
- **调用方式**: 独立选择器，与现有模型列表分开；选择自定义模型时，现有模型不可用

### 研究发现
- 当前自定义模型机制在 `app/utils/model.ts` 中通过 `customModels` 字符串配置
- API 调用统一使用 `accessStore.openaiUrl` 和 `accessStore.openaiApiKey`
- 需要新增状态管理来存储多个自定义模型配置

---

## Work Objectives

### 核心目标
在设置页面添加多自定义 OpenAI 模型支持，实现：
1. 独立的选择器 UI，与现有模型列表分开
2. 独立的配置 Modal，管理多个自定义模型
3. API 调用时根据选中的模型使用对应的 URL 和 API Key

### 具体交付物
- `app/store/access.ts`: 新增 `customOpenAIModels` 状态和验证方法
- `app/components/settings.tsx`: 新增自定义模型管理 Modal 和选择器
- `app/client/platforms/openai.ts`: 适配根据选中模型使用对应配置

### 定义完成
- [ ] 设置页面显示独立的"自定义 OpenAI 模型"选择器
- [ ] 可以添加、编辑、删除自定义模型
- [ ] 选择自定义模型后，API 调用使用对应 URL 和 API Key
- [ ] 选择自定义模型时，现有的模型选择器禁用

### Must Have
- 支持添加/编辑/删除自定义模型
- 每个模型可配置：URL、API Key、模型名称
- 选择自定义模型时禁用现有模型列表

### Must NOT Have
- 不要修改现有的官方模型（OpenAI/Azure/Google 等）逻辑
- 不要破坏现有的 API 调用流程

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: NO
- **Framework**: N/A
- **Agent-Executed QA**: 手动验证功能是否正常

### QA Policy
每个任务包含 Agent-Executed QA Scenarios，通过实际操作验证功能。

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (核心数据结构):
├── T1: 在 access.ts 中添加 customOpenAIModels 状态
├── T2: 在 constant.ts 中添加 CustomOpenAI ProviderType
└── T3: 在 openai.ts 中添加自定义模型判断逻辑

Wave 2 (UI 实现):
├── T4: 在 settings.tsx 中添加自定义模型管理 Modal
├── T5: 在 settings.tsx 中添加独立选择器 UI
└── T6: 添加国际化文案

Wave 3 (集成测试):
├── T7: 端到端测试 - 验证添加、选择、调用流程
└── T8: 回归测试 - 验证现有功能不受影响
```

### 依赖矩阵
- T1 (access.ts): - - T4, T5, T7
- T2 (constant.ts): T1 - T3, T5
- T3 (openai.ts): T1, T2 - T7
- T4 (Modal UI): T1, T2 - T7
- T5 (选择器 UI): T1, T2, T3, T4 - T7
- T6 (i18n): - - T4, T5
- T7 (集成测试): T1, T2, T3, T4, T5, T6 - F1
- T8 (回归测试): T7 - F1
- F1 (验证): T7, T8 - -

---

## TODOs

- [ ] 1. 在 access.ts 添加 customOpenAIModels 状态

  **What to do**:
  - 在 `DEFAULT_ACCESS_STATE` 中添加 `customOpenAIModels: []` 数组
  - 添加类型定义 `CustomOpenAIModel`
  - 添加验证方法 `isValidCustomOpenAIModel(id)` 和获取方法 `getCustomOpenAIModel(id)`

  **Must NOT do**:
  - 不要修改现有的 openaiUrl/openaiApiKey 逻辑

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - Reason: 主要是状态管理修改，逻辑简单

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T2, T3)
  - **Blocks**: T4, T5, T7
  - **Blocked By**: None

  **References**:
  - `app/store/access.ts:65-154` - DEFAULT_ACCESS_STATE 结构参考
  - `app/store/access.ts:175-250` - isValid* 验证方法参考

  **Acceptance Criteria**:
  - [ ] 编译通过，无 TypeScript 错误

  **QA Scenarios**:
  - 无需自动化测试，手动验证

  **Commit**: YES
  - Message: `feat(access): add customOpenAIModels state`
  - Files: `app/store/access.ts`

---

- [ ] 2. 在 constant.ts 添加 CustomOpenAI ProviderType

  **What to do**:
  - 在 `ServiceProvider` 枚举中添加 `CustomOpenAI`
  - 确保排序值正确

  **Must NOT do**:
  - 不要删除或修改现有的 Provider

  **Recommended Agent Profile**:
  - **Category**: `quick`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T1, T3)
  - **Blocks**: T3, T5
  - **Blocked By**: T1

  **References**:
  - `app/constant.ts:1-50` - ServiceProvider 枚举定义

  **Acceptance Criteria**:
  - [ ] ServiceProvider.CustomOpenAI 存在

  **QA Scenarios**:
  - 无需自动化测试

  **Commit**: YES
  - Message: `feat(constant): add CustomOpenAI provider type`
  - Files: `app/constant.ts`

---

- [ ] 3. 在 openai.ts 添加自定义模型判断逻辑

  **What to do**:
  - 在 `path()` 方法中添加逻辑：判断当前模型是否为自定义模型
  - 如果是自定义模型，从 customOpenAIModels 中获取对应配置
  - 在 `getHeaders()` 或请求时使用自定义模型的 apiKey

  **Must NOT do**:
  - 不要破坏现有的 Azure/OpenAI 等 provider 的逻辑

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T1, T2)
  - **Blocks**: T7
  - **Blocked By**: T1, T2

  **References**:
  - `app/client/platforms/openai.ts:85-122` - path() 方法
  - `app/client/api.ts:1-50` - getHeaders() 定义

  **Acceptance Criteria**:
  - [ ] 编译通过
  - [ ] 选择自定义模型时，使用自定义模型的 URL 和 API Key

  **QA Scenarios**:
  Scenario: 选择自定义模型时使用对应配置
    Tool: Bash
    Preconditions: 已配置自定义模型 {url: "http://localhost:11434/v1", apiKey: "test-key", modelName: "llama3"}
    Steps:
      1. 模拟选择自定义模型 "llama3"
      2. 调用 path() 方法
    Expected Result: 返回 "http://localhost:11434/v1" 而非默认 URL

  **Commit**: YES
  - Message: `feat(openai): support custom model url and apiKey`
  - Files: `app/client/platforms/openai.ts`

---

- [ ] 4. 在 settings.tsx 添加自定义模型管理 Modal

  **What to do**:
  - 创建 `CustomModelModal` 组件
  - 支持添加、编辑、删除自定义模型
  - 每个模型可配置：URL、API Key、模型名称
  - 使用独立的 Modal 窗口

  **Must NOT do**:
  - 不要修改现有的 provider 配置 UI

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T5, T6)
  - **Blocks**: T7
  - **Blocked By**: T1, T2

  **References**:
  - `app/components/settings.tsx:93-140` - EditPromptModal 参考
  - `app/components/settings.tsx:328-487` - SyncConfigModal 参考

  **Acceptance Criteria**:
  - [ ] 可以打开 Modal
  - [ ] 可以添加新模型
  - [ ] 可以编辑现有模型
  - [ ] 可以删除模型

  **QA Scenarios**:
  Scenario: 添加自定义模型
    Tool: 手动测试
    Preconditions: 打开设置页面
    Steps:
      1. 找到自定义模型配置区域
      2. 点击添加按钮
      3. 输入 URL、API Key、模型名称
      4. 保存
    Expected Result: 模型出现在列表中

  Scenario: 编辑自定义模型
    Tool: 手动测试
    Preconditions: 已有一个自定义模型
    Steps:
      1. 点击模型旁边的编辑按钮
      2. 修改 URL
      3. 保存
    Expected Result: 模型配置已更新

  Scenario: 删除自定义模型
    Tool: 手动测试
    Preconditions: 已有一个自定义模型
    Steps:
      1. 点击模型旁边的删除按钮
      2. 确认删除
    Expected Result: 模型从列表中移除

  **Commit**: YES
  - Message: `feat(settings): add custom model management modal`
  - Files: `app/components/settings.tsx`

---

- [ ] 5. 在 settings.tsx 添加独立选择器 UI

  **What to do**:
  - 在设置页面添加独立的"自定义 OpenAI 模型"选择器
  - 显示已配置的自定义模型列表
  - 选择自定义模型时，禁用现有的模型选择器
  - 选择现有模型时，禁用自定义模型选择器

  **Must NOT do**:
  - 不要修改现有模型选择器的逻辑

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T4, T6)
  - **Blocks**: T7
  - **Blocked By**: T1, T2, T3, T4

  **References**:
  - `app/components/settings.tsx:1818-1916` - 现有 Access 配置区域
  - `app/components/model-config.tsx:26-51` - 模型选择器参考

  **Acceptance Criteria**:
  - [ ] 显示自定义模型选择器
  - [ ] 选择自定义模型时禁用现有模型选择器
  - [ ] 选择现有模型时禁用自定义模型选择器

  **QA Scenarios**:
  Scenario: 选择自定义模型禁用现有选择器
    Tool: 手动测试
    Preconditions: 已配置自定义模型
    Steps:
      1. 在自定义模型选择器中选择某个模型
      2. 观察现有的模型选择器
    Expected Result: 现有模型选择器被禁用

  Scenario: 选择现有模型禁用自定义选择器
    Tool: 手动测试
    Preconditions: 已配置自定义模型
    Steps:
      1. 在现有模型选择器中选择某个模型
      2. 观察自定义模型选择器
    Expected Result: 自定义模型选择器被禁用

  **Commit**: YES
  - Message: `feat(settings): add independent custom model selector`
  - Files: `app/components/settings.tsx`

---

- [ ] 6. 添加国际化文案

  **What to do**:
  - 在 `app/locales/` 下的语言文件中添加新的文案
  - 包括：标题、按钮、提示信息等

  **Must NOT do**:
  - 不要修改现有文案

  **Recommended Agent Profile**:
  - **Category**: `writing`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T4, T5)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  - `app/locales/en.ts` - 英文文案参考
  - `app/locales/zh.ts` - 中文文案参考

  **Acceptance Criteria**:
  - [ ] en.ts 包含新文案
  - [ ] zh.ts 包含新文案

  **QA Scenarios**:
  - 无需自动化测试

  **Commit**: YES
  - Message: `feat(i18n): add custom model locale strings`
  - Files: `app/locales/*.ts`

---

- [ ] 7. 端到端测试 - 验证完整流程

  **What to do**:
  - 测试添加自定义模型
  - 测试选择自定义模型
  - 测试发送消息使用自定义模型

  **Must NOT do**:
  - 不要修改测试框架

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`

  **Parallelization**:
  - **Can Run In Parallel**: NO (最终测试)
  - **Blocks**: T8
  - **Blocked By**: T1, T2, T3, T4, T5, T6

  **References**:
  - `app/components/settings.tsx` - 完整流程参考

  **Acceptance Criteria**:
  - [ ] 添加模型成功
  - [ ] 选择模型成功
  - [ ] API 调用成功

  **QA Scenarios**:
  Scenario: 完整流程测试
    Tool: 手动测试
    Preconditions: 干净环境
    Steps:
      1. 打开设置页面
      2. 添加自定义模型 {url: "http://localhost:11434/v1", apiKey: "test", modelName: "llama3"}
      3. 保存并关闭 Modal
      4. 选择自定义模型 "llama3"
      5. 在主界面发送消息
    Expected Result: 消息使用自定义模型配置发送

  **Commit**: NO (最后一个任务)

---

- [ ] 8. 回归测试 - 验证现有功能

  **What to do**:
  - 验证现有模型选择功能正常
  - 验证官方 API 调用正常

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: F1
  - **Blocked By**: T7

  **Acceptance Criteria**:
  - [ ] 现有模型选择正常
  - [ ] 官方 API 调用正常

  **QA Scenarios**:
  Scenario: 回归测试
    Tool: 手动测试
    Steps:
      1. 选择 OpenAI 模型
      2. 发送消息
    Expected Result: 正常工作

  **Commit**: NO

---

## Final Verification Wave

- [ ] F1. **Plan Compliance Audit** — `oracle`
  验证所有 Must Have 满足，Must NOT Have 不存在。

- [ ] F2. **Code Quality Review** — `unspecified-high`
  运行 `yarn lint` 和 `yarn build` 确保无错误。

- [ ] F3. **Real Manual QA** — `unspecified-high`
  执行所有 QA Scenarios。

- [ ] F4. **Scope Fidelity Check** — `deep`
  确保只实现了计划中的功能，无范围蔓延。

---

## Commit Strategy

- **T1**: `feat(access): add customOpenAIModels state`
- **T2**: `feat(constant): add CustomOpenAI provider type`
- **T3**: `feat(openai): support custom model url and apiKey`
- **T4**: `feat(settings): add custom model management modal`
- **T5**: `feat(settings): add independent custom model selector`
- **T6**: `feat(i18n): add custom model locale strings`

---

## Success Criteria

### Verification Commands
```bash
yarn lint  # Expected: no errors
yarn build # Expected: build success
```

### Final Checklist
- [ ] 可添加/编辑/删除自定义模型
- [ ] 独立选择器 UI 正常工作
- [ ] 选择自定义模型时禁用现有模型选择器
- [ ] API 调用使用正确的 URL 和 API Key
- [ ] 现有功能不受影响
