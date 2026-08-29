# 🚀 フリーランスWeb制作 統合ダッシュボード (Mission Control)

本ダッシュボードは、個人フリーランス活動における営業・案件進行・開発品質・法務チェック・保守運用を**マルチAIハイブリッド体制（Antigravity × Claude Code × ChatGPT）**とObsidianで一元統括するための司令塔画面です。

---

## 🌐 マルチAI連携体制（Multi-AI Architecture）

| AIツール | 役割 | 担当エージェント |
| :--- | :--- | :--- |
| **Antigravity (Gemini)** | **全体統括・進捗管理・Obsidian連携** | [[02_Director_PM_Agent.md\|ディレクション＆PM]] |
| **Claude Code / Claude** | **UI/UX実装・CSSデザイン・コード品質** | [[03_Dev_QA_Agent.md\|開発＆品質管理]] |
| **ChatGPT (o3 / GPT-4o)** | **提案書コピー・SEO戦略・競合分析** | [[06_SEO_Marketing_Agent.md\|SEO＆マーケティング]] / [[01_Sales_Strategy_Agent.md\|営業戦略]] |

---

## 📊 案件・営業パイプライン（Kanban連携）
- [[freelance-workspace/00_Hub/Project_Kanban.md|📋 案件・営業カンバンボードを開く]]

---

## 📁 現在進行中のプロジェクト (Dataview)

```dataview
TABLE file.mtime AS "最終更新", status AS "ステータス", client AS "クライアント名", budget AS "想定予算"
FROM "freelance-workspace/03_Projects"
SORT file.mtime DESC
```

---

## ⚖️ 法務・契約・セキュリティチェックリスト
- [[freelance-workspace/05_Compliance_and_Security/Contract_and_Copyright_Policy.md|契約・著作権帰属規定]]
- [[freelance-workspace/05_Compliance_and_Security/Privacy_and_PII_Policy.md|個人情報・パスワード管理規定]]
- [[freelance-workspace/05_Compliance_and_Security/SEO_and_Performance_Standard.md|SEO・パフォーマンス品質標準]]

---

## 📄 各種実務テンプレートショートカット
- [[freelance-workspace/04_Templates/Proposal_Template.md|提案書テンプレート]]
- [[freelance-workspace/04_Templates/Estimate_Template.md|見積書テンプレート]]
- [[freelance-workspace/04_Templates/Hearing_Sheet_Template.md|ヒアリングシート]]
- [[freelance-workspace/04_Templates/Contract_Checklist_Template.md|契約チェックリスト]]
- [[freelance-workspace/04_Templates/Client_Manual_Template.md|クライアントマニュアル]]
