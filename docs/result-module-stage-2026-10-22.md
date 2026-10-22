# 结果统计模块阶段整理（2026-10-22）

状态：本阶段实现及独立分支验证完成，供草稿 PR 审阅；尚未部署或重算线上结果。

## 已完成

| 范围 | 行为 |
|---|---|
| 快照时间轴 | 人工计票保存投票起止、统计截止及结果生成时间，六处趋势页使用同一快照时间；保留部分小时、补零和负增量 |
| 部门有效票数 | 每账号每部门最新未作废提交计一票，多票位不重复计数；单票组合不展示但其提交计入部门有效票 |
| 问卷填写情况 | 按真实问卷 key、最新答案批次和可见题组计算完成数及人群完成率，门禁行为保持原样 |
| 详情投票人群 | 角色/音乐/组合详情的问卷使用原约束 AND 当前目标；指令模式条件可传递到详情；组合完整无序匹配并保留重复成员 |

## 发布约束

1. 后端 PR 合入并发布，提供 queryResultTimeline 和 cp 条件支持。
2. 前端使用后端新 schema codegen 后构建发布。生成产物沿用现有忽略规则，不提交本地生成文件。
3. 旧结果不会自动改写；在人工反作弊完成、业务安排允许时重新计票，产生新口径和时间信息。

无数据库迁移、新增配置、依赖或工作流；本次未改投票门禁产品规则、反作弊或全局数据模型。

## 下一阶段

- 高级搜索的问卷选项从前端静态表改为后端正式问卷定义；先确认题目/选项语义 code 的来源和映射。
- 用少量代表条件测量首次查询、缓存命中的耗时，拆开数据库读取和 Python 计算，不预先增加后台任务或额外缓存层。
- 往届对比、候选总数、组合单票相关其他概览指标、正式问卷题目展示及提名概览仍按需求清单分别处理，不纳入本次 PR。

## 验证范围

在最新远端目标分支的独立工作区重新运行相关后端检查，以及前端本地 schema codegen、条件/时间轴测试、生产构建。后端 160 项测试通过、全 src flake8 通过；前端 5 项测试、8 份 GraphQL 查询校验、codegen 和生产构建通过。没有浏览器交互、真实数据迁移或线上计票验证。

验证命令（在对应仓库中执行）：

```bash
NACOS_ENABLED=false DATABASE_URL=sqlite+aiosqlite:///:memory: REDIS_URL=redis://localhost:6379/15 python -m pytest tests/unit/test_compute.py tests/unit/test_compute_gaps.py tests/unit/test_compute_ranking_id.py tests/unit/test_compute_cp_ranking_id.py tests/unit/test_questionnaire_completion.py tests/unit/test_advanced_search_dsl.py tests/unit/test_advanced_search_subset.py tests/unit/test_advanced_search_perf.py tests/unit/test_net_delta_trend.py tests/unit/test_result_compat_schema.py tests/unit/test_result_compat_historical_sentinel.py tests/integration/test_compute_dao_raw.py tests/integration/test_result_compute.py tests/integration/test_result_compat_ranking.py tests/integration/test_result_compat_rest.py tests/integration/test_result_compat_advanced_search.py tests/integration/test_advanced_search_service.py tests/contract/test_result_endpoints.py -q
python -m flake8 src/ --max-line-length=88
# 先由本次后端 schema 导出本地 SDL，再将 GRAPHQL_SCHEMA_URL 指向该文件。
GRAPHQL_SCHEMA_URL=/tmp/sunyunbo/thvote-result-pr-schema.graphql pnpm result:codegen
pnpm exec tsx --test packages/result/src/lib/__tests__/Graph.test.ts packages/result/src/lib/__tests__/detailConstraint.test.ts
pnpm result:build
git diff --check
```
