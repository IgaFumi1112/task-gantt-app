# task-gantt-app 要件定義書

このProjectは，AI（ChatGPT）を最大限使用して作成しております．

## 目次
- [task-gantt-app 要件定義書](#task-gantt-app-要件定義書)
  - [目次](#目次)
  - [はじめに](#はじめに)
  - [システム概要](#システム概要)
  - [ユーザー要件](#ユーザー要件)
  - [機能要件](#機能要件)
    - [プロジェクト管理](#プロジェクト管理)
    - [タスク管理](#タスク管理)
    - [進捗管理](#進捗管理)
    - [ガントチャート表示](#ガントチャート表示)
    - [CRUD操作](#crud操作)
    - [データベース](#データベース)
  - [非機能要件](#非機能要件)
  - [データ構造（DB設計）](#データ構造db設計)
    - [エンティティ一覧](#エンティティ一覧)
    - [リレーション](#リレーション)
  - [システム構成](#システム構成)
    - [バックエンド（Spring Boot）](#バックエンドspring-boot)
    - [フロントエンド（SPA）](#フロントエンドspa)
  - [デプロイ・環境構築](#デプロイ環境構築)
    - [開発環境](#開発環境)
    - [本番環境（無料枠PaaS）例](#本番環境無料枠paas例)
  - [運用・保守計画](#運用保守計画)
  - [用語定義](#用語定義)

---

## はじめに
本要件定義書は、自己学習・転職準備のためのタスク管理およびガントチャート出力機能を備えたWebアプリケーション（以降「本システム」）の機能・非機能要件を明確化することを目的とします。  
開発言語・フレームワークとして、バックエンドは Spring Boot、データベースは H2（開発時）および将来的に他DBへ移行を想定、フロントエンドは SPA（React/Vue/Angular いずれか）を用います。  

---

## システム概要
- **対象ユーザー**：自分ひとりで使用する個人用途  
- **目的**：転職に向けたスキルアップ学習を計画的・可視的に管理し、タスクごとの進捗を把握しながら年間・月単位のガントチャートを出力する  
- **提供機能（概要）**：  
  - プロジェクトおよびタスクの管理（階層構造あり）  
  - タスクの計画（開始日・終了日）、実績（実績開始日・実績終了日）の登録  
  - タスク進捗率の自動算出  
  - 年間・月単位で切り替え可能なガントチャート表示  
  - タスク・プロジェクトの CRUD 操作  
  - データはローカルの H2 データベースに保存（将来的に別DBへ移行可能）  

---

## ユーザー要件
1. **利用形態**：  
   - **単一ユーザー**（自分一人で利用）  
   - ログイン・ユーザー認証は不要  
2. **プロジェクト構造**：  
   - **多階層構造を想定**（親プロジェクト ↔ 子プロジェクト）  
   - 子プロジェクトが存在しない場合も許容  
3. **フロントエンド技術**：  
   - **SPA（React または Vue または Angular）**  
   - ライブラリ選定は無料ライセンスの Gantt チャートを想定  
4. **デプロイ環境**：  
   - **費用が発生しない方法**で本番環境を用意する  
   - 初期開発はローカル環境＋H2、将来的に無料枠の PaaS（例：Railway、Render、Fly.io など）を用いてデプロイ  
5. **運用・保守**：  
   - 個人開発のため、シンプルかつ容易にバックアップ・リストアできる構成  
   - ログ管理・バージョン管理（Git）を確実に行う  

---

## 機能要件

### プロジェクト管理
- **プロジェクト登録**  
  - プロジェクト名、概要、計画開始日、計画終了日、進捗率（%）を入力  
  - 親プロジェクトID（NULL可）を指定して多階層構造を保持  
- **プロジェクト一覧表示**  
  - 登録済みプロジェクトを階層構造付きでツリー表示  
  - プロジェクトごとに「全体進捗率」「タスク数」「計画期間（年月）」を表示  
- **プロジェクト編集・削除**  
  - 親プロジェクト・子プロジェクトの紐付けを変更可能  
  - 削除時、子プロジェクトや関連タスクも同時削除するか否かを確認  

### タスク管理
- **タスク登録**  
  - タスク名（概要）、詳細説明（テキスト）、計画開始日（plannedStartDate）、計画終了日（plannedEndDate）、実績開始日（actualStartDate）、実績終了日（actualEndDate）、ステータス（未着手／進行中／完了）、優先度（High/Medium/Low）を入力  
  - 担当者項目は不要（単一ユーザー運用）  
  - タスクIDおよび紐づくプロジェクトIDは自動採番・自動割り当て  
- **タスク一覧表示**  
  - 選択中のプロジェクト配下のタスクを一覧表示  
  - 一覧項目：タスク名／計画開始日／計画終了日／実績開始日／実績終了日／進捗率（%）／ステータス／優先度  
  - 一覧上でソート機能（期限順、進捗順、優先度順）およびキーワード検索機能を提供  
- **タスク詳細表示**  
  - 単一タスクの全フィールドを表示  
  - 詳細画面から編集・削除が可能  
- **タスク編集・削除**  
  - 一覧または詳細画面から編集・削除を行う  
  - 編集時は必須項目のバリデーションを実施（例：計画開始日 ≤ 計画終了日、実績開始日 ≤ 実績終了日）  

### 進捗管理
- **進捗率の自動計算**  
  - 「実績開始日」「実績終了日」を入力すると、進捗率を自動的に計算して保存  
    - 例：計画期間（plannedStartDate～plannedEndDate）に対して、実績終了日が当日までであれば  
      ```
      進捗率（%） = 
        ((今日の日付 － 実績開始日) ÷ (計画終了日 － 計画開始日)) × 100
      ```
      ※ただし進捗率が 0%～100% にクランプ  
  - 実績終了日が空の場合は、進捗率を「実績開始日 が未入力なら 0%、入力済みなら 1%（着手済み扱い）」など、  
    要件に応じた初期値ロジックを定義  
- **手動入力は不要**  
  - 進捗率はシステム側で自動算出し、ユーザーが直接パーセンテージを入力する項目は持たない  

### ガントチャート表示
- **表示モード**  
  - **年間表示（1月~12月）**  
  - **月単位表示**（任意の年月を選択して当該月にスケールを絞る）  
  - 表示スケールはドロップダウンやカレンダーUIで切り替えを可能とする  
- **バー構成**  
  - **計画バー**：計画開始日～計画終了日を色付きバーで表示  
  - **実績バー**：実績開始日～実績終了日を計画バーの下に別色で重ねて表示  
- **無料ライセンスのGanttライブラリ**  
  - React を採用する場合の候補例：  
    - **Frappe Gantt**（MITライセンス）  
    - **react-gantt-chart**（MITライセンス）  
    - **Vue Ganttastic**（MITライセンス、Vue 用）  
  - ライブラリ選定基準：  
    - ドラッグ＆ドロップ編集機能は不要（依存関係の自動調整は行わないため）  
    - 必要な機能は「期間バーの表示」「マウスホバーで詳細表示」「スクロール／拡大縮小」  
- **月単位切り替え時の挙動**  
  - 年間表示から任意月表示に切り替えた場合、横軸のスケールが「当該月の1日～末日」に自動的に調整される  
  - 月末をまたぐタスクの場合、当月外の部分はグレーアウトで表示  

### CRUD操作
- **プロジェクト・タスクの作成（Create）**  
  - REST API:  
    - `POST /api/projects`  
    - `POST /api/tasks`  
  - フロント側ではフォーム入力 → バリデーション → API 呼び出し  
- **読み取り（Read）**  
  - REST API:  
    - `GET /api/projects`（全プロジェクト一覧または階層ツリー）  
    - `GET /api/projects/{projectId}`（単一プロジェクト情報）  
    - `GET /api/tasks?projectId={projectId}`（該当プロジェクト配下のタスク一覧）  
    - `GET /api/tasks/{taskId}`（単一タスク情報）  
- **更新（Update）**  
  - REST API:  
    - `PUT /api/projects/{projectId}`  
    - `PUT /api/tasks/{taskId}`  
  - 進捗率は実績開始／実績終了日更新時にサーバ側で自動計算  
- **削除（Delete）**  
  - REST API:  
    - `DELETE /api/projects/{projectId}`  
    - `DELETE /api/tasks/{taskId}`  
  - プロジェクト削除時は「子プロジェクトと関連タスクも一括削除するか確認」ダイアログを表示  

### データベース
- **開発環境**：  
  - H2 Database（組み込みモード、ファイル保存）  
  - Spring Boot 起動時に自動でテーブル生成（`spring.jpa.hibernate.ddl-auto=update` など）  
- **本番環境移行時**：  
  - 無料枠の PostgreSQL（ElephantSQL, Supabase 無料プランなど）または  
  - Docker 上で起動する無料の MySQL/PostgreSQL コンテナ  
- **マイグレーション**：  
  - Flyway または Liquibase を導入し、開発→本番移行時のスキーマ整合性を確保  

---

## 非機能要件
1. **パフォーマンス**  
   - タスク件数が数百件程度でも一覧表示・ガントチャート描画が 1 秒以内に完了すること  
   - フロントエンドのバンドルは 200KB 以下を目安とし、初回ロード速度を最適化  
2. **セキュリティ**  
   - 単一ユーザーかつ認証不要だが、CSRF・XSS の基本対策は実施  
     - フロントエンドからのリクエストはすべて JSON を前提とし、CORS 設定を厳格化  
     - Spring Boot の `spring.mvc.cors` を設定して自身のドメインからのみ許可  
     - 入力項目はサーバ側でバリデーション＆サニタイズを実施  
   - セキュアなデフォルト設定（例：エラーメッセージにスタックトレースを表示しない）  
3. **可用性**  
   - 個人運用のため高可用性構成は不要  
   - ただし、データ破損を防ぐため定期バックアップ（週次）の仕組みを用意  
4. **拡張性・保守性**  
   - フロント／バックエンドを明確に分離したアーキテクチャを採用  
   - REST API 仕様書（OpenAPI など）を作成し、将来他クライアントからも呼び出し可能  
   - DB マイグレーション管理ツール（Flyway/Liquibase）を導入  
   - ソースコードは Git リポジトリ管理、Pull Request ベースで開発  
5. **可観測性**  
   - Spring Boot Actuator を導入し、アプリケーションメトリクスやヘルスチェックを取得可能にする  
   - ログは INFO レベル以上をファイル出力し、エラーログは別ファイルに分割  
6. **ユーザビリティ**  
   - ブラウザ対応は最新の Google Chrome / Firefox / Edge をターゲット  
   - レスポンシブデザインを採用し、タブレット・スマホでも最小限の確認・編集操作が可能  
   - 入力フォームにはプレースホルダーと簡単な説明を配置し、初見でもわかりやすいUIを設計  
7. **運用コスト**  
   - 本番は無料枠 PaaS（Railway/Render/Fly.io 等）を活用し、月額 ¥0～￥500 程度を想定  
   - DB は無料プランの PostgreSQL（ElephantSQL など）を利用  

---

## データ構造（DB設計）

### エンティティ一覧
1. **Project（プロジェクト）**  
   | フィールド名          | 型             | 制約・備考                                   |
   | --------------------- | -------------- | -------------------------------------------- |
   | id                    | BIGINT         | 主キー、自動採番                             |
   | name                  | VARCHAR(255)   | プロジェクト名、NotNull                      |
   | description           | TEXT           | プロジェクト概要（任意）                     |
   | parent_project_id     | BIGINT         | 親プロジェクトID（NULL可）、自己参照外部キー |
   | planned_start_date    | DATE           | 計画開始日                                   |
   | planned_end_date      | DATE           | 計画終了日                                   |
   | progress              | INTEGER        | 全体進捗率（%）、自動計算・蓄積               |
   | created_at            | TIMESTAMP      | 作成日時、自動設定                            |
   | updated_at            | TIMESTAMP      | 更新日時、自動設定                            |

2. **Task（タスク）**  
   | フィールド名         | 型           | 制約・備考                                           |
   | -------------------- | ------------ | ---------------------------------------------------- |
   | id                   | BIGINT       | 主キー、自動採番                                     |
   | project_id           | BIGINT       | 外部キー（Project.id）                              |
   | title                | VARCHAR(255) | タスク名、NotNull                                   |
   | description          | TEXT         | 詳細説明（任意）                                     |
   | planned_start_date   | DATE         | 計画開始日                                           |
   | planned_end_date     | DATE         | 計画終了日                                           |
   | actual_start_date    | DATE         | 実績開始日（NotNull ではない）                       |
   | actual_end_date      | DATE         | 実績終了日（NotNull ではない）                       |
   | progress             | INTEGER      | 進捗率（0〜100）、サーバ側で自動計算                   |
   | status               | VARCHAR(20)  | ステータス（未着手/進行中/完了 等）、デフォルト: 未着手 |
   | priority             | VARCHAR(10)  | 優先度（High/Medium/Low）、デフォルト: Medium         |
   | created_at           | TIMESTAMP    | 作成日時、自動設定                                    |
   | updated_at           | TIMESTAMP    | 更新日時、自動設定                                    |

### リレーション
- **Project**  
  - `parent_project_id` は同一テーブルを参照し、多階層プロジェクトを実現  
  - `@OneToMany(mappedBy="parentProject")` で子プロジェクトのリストを保持  
- **Task**  
  - `project_id` は `Project.id` を参照し、`@ManyToOne` で紐づくプロジェクトにアクセス可能  

---

## システム構成

### バックエンド（Spring Boot）
- **フレームワーク**：Spring Boot （最新安定版）  
- **言語**：Java 17 以上  
- **ビルドツール**：Maven または Gradle  
- **主な依存ライブラリ**：  
  - Spring Web（REST API構築）  
  - Spring Data JPA（ORM）  
  - H2 Database（開発環境）  
  - PostgreSQL Driver（本番移行時）  
  - Flyway または Liquibase（DBマイグレーション）  
  - Spring Boot Actuator（可観測性）  
- **パッケージ構成例**：  

```
com.example.taskganttapp
├─ controller
│ ├─ ProjectController.java
│ └─ TaskController.java
├─ service
│ ├─ ProjectService.java
│ └─ TaskService.java
├─ repository
│ ├─ ProjectRepository.java
│ └─ TaskRepository.java
├─ model
│ ├─ Project.java
│ └─ Task.java
├─ dto
│ ├─ ProjectDto.java
│ └─ TaskDto.java
├─ exception
│ └─ ResourceNotFoundException.java
└─ config
├─ WebConfig.java // CORS設定など
└─ DatabaseConfig.java // H2→PostgreSQL移行設定
```

- **REST API一覧**：  
- 
| メソッド  | エンドポイント                   | 機能                                   |
| -------- | ------------------------------- | -------------------------------------- |
| GET      | `/api/projects`                 | プロジェクト一覧取得（階層ツリー形式）    |
| GET      | `/api/projects/{projectId}`     | プロジェクト詳細取得                    |
| POST     | `/api/projects`                 | プロジェクト作成                        |
| PUT      | `/api/projects/{projectId}`     | プロジェクト更新                        |
| DELETE   | `/api/projects/{projectId}`     | プロジェクト削除                        |
| GET      | `/api/tasks?projectId={id}`     | タスク一覧（プロジェクトID指定）        |
| GET      | `/api/tasks/{taskId}`           | タスク詳細取得                          |
| POST     | `/api/tasks`                    | タスク作成                              |
| PUT      | `/api/tasks/{taskId}`           | タスク更新                              |
| DELETE   | `/api/tasks/{taskId}`           | タスク削除                              |
| GET      | `/api/projects/{id}/gantt?mode=`<br>`annual\|monthly&year=&month=` | ガントチャート用データ取得             |
- **ビジネスロジック（例）**  
- `TaskService` 内にて、タスクの「実績開始日」「実績終了日」が更新されたタイミングで `progress` を自動計算し、DBへ保存  
- `ProjectService` は配下タスクの平均進捗または重み付き進捗から「プロジェクト全体進捗」を再計算  

### フロントエンド（SPA）
- **フレームワーク候補**：React (v18~) または Vue (v3~)  
- **ディレクトリ構成例（React）**：  

```
src/
├─ api/ // axios などで API 呼び出しクライアントを定義
│ ├─ projectApi.js
│ └─ taskApi.js
├─ components/
│ ├─ layout/
│ │ └─ Header.jsx
│ ├─ project/
│ │ ├─ ProjectList.jsx
│ │ ├─ ProjectForm.jsx
│ │ └─ ProjectDetail.jsx
│ ├─ task/
│ │ ├─ TaskList.jsx
│ │ ├─ TaskForm.jsx
│ │ └─ TaskDetail.jsx
│ └─ gantt/
│ └─ GanttChart.jsx
├─ pages/
│ ├─ ProjectsPage.jsx
│ ├─ TasksPage.jsx
│ └─ GanttPage.jsx
├─ router/
│ └─ index.js // React Router や Vue Router 設定
├─ store/ // Redux or Vuex（状態管理ライブラリ）を必要に応じて導入
└─ App.jsx
```

- **主な機能／UI要素**  
1. **ナビゲーションバー**：  
   - 「プロジェクト一覧」「ガントチャート」「タスク検索」などへのリンク  
2. **プロジェクト一覧画面**：  
   - ツリービュー表示（親プロジェクト ⇄ 子プロジェクト）  
   - タスク一覧への遷移ボタン  
   - 「新規プロジェクト作成」ボタン  
3. **タスク一覧画面**：  
   - プロジェクト選択後のタスク一覧  
   - テーブル表示＋ソート／検索入力  
   - 「新規タスク作成」ボタン  
4. **タスク詳細画面**：  
   - 各フィールドの表示  
   - 編集・削除ボタン  
5. **タスク作成／編集フォーム**：  
   - バリデーションを効かせた入力フォーム  
   - 日付ピッカー（カレンダーUI）を利用  
6. **ガントチャート画面**：  
   - 年間表示／月単位表示の切り替えドロップダウン  
   - Gantt ライブラリ（Frappe Gantt など）を組み込んで、  
     - 計画バー（色１）、実績バー（色２）を重ねる  
     - マウスホバー時にタスク名＋開始終了日＋進捗をツールチップで表示  
   - 必要に応じて横スクロール・ズームイン／アウト操作をサポート  

---

## デプロイ・環境構築

### 開発環境
1. **バックエンド**  
 - Java 17 以上、Maven/Gradle プロジェクト  
 - `application-dev.yml` の中で H2 組み込みモードを指定  
 - `java -jar target/app.jar` でローカル起動  
 - IDE：IntelliJ IDEA / Eclipse など  
2. **フロントエンド**  
 - Node.js (v16 以上)、Yarn または npm  
 - `create-react-app` または `Vue CLI` で初期構築  
 - `npm run dev` でローカルサーバー起動（ポート例：3000）  
3. **Git リポジトリ**  
 - GitHub / GitLab / Bitbucket などにプライベートリポジトリを作成  
 - ブランチ戦略：`main`（本番相当）、`develop`（開発相当）、機能ごとに `feature/xxx`  

### 本番環境（無料枠PaaS）例
以下のいずれかを利用して「費用が発生しない」本番環境を構築可能です。  
1. **Railway（無料枠）**  
 - **バックエンド**：Railway 上に Spring Boot アプリをデプロイ（GitHub連携可）  
 - **DB**：Railway PostgreSQL 無料プラン  
 - **フロントエンド**：同じ Railway 上に Static Site（Reactビルド済み）をホスティング、または GitHub Pages/Vercel に配置  
2. **Render（無料枠）**  
 - **バックエンド**：Render の Web Service（Docker or JAR）でデプロイ  
 - **DB**：Render Free PostgreSQL インスタンス  
 - **フロントエンド**：Render Static Site、または Netlify/Vercel に配置  
3. **Fly.io（無料枠）**  
 - **バックエンド**：Flyctl で Java アプリケーションをデプロイ  
 - **DB**：Fly.io Postgres（無料枠）  
 - **フロントエンド**：Fly.io Static（Blobs） or Vercel/GitHub Pages  

> いずれの場合も、SSL（HTTPS）対応は PaaS 側で簡易に設定可能。  
> DB マイグレーションは Flyway/Liquibase を CI パイプラインに組み込むことで自動化できる。  

---

## 運用・保守計画
1. **バージョン管理**  
 - GitHub（または GitLab など）にリポジトリをホスト  
 - Pull Request ベースでレビューを行い（個人開発でもセルフコードレビューを推奨）、コミットメッセージ規約（Conventional Commits など）を導入  
2. **CI/CD**  
 - **GitHub Actions** や **GitLab CI** で以下を実行  
   - ビルド検証（`mvn clean verify` / `npm run build`）  
   - テスト自動化（ユニットテスト、E2E テスト）  
   - マイグレーション適用（Flyway/Liquibase）  
   - 本番環境への自動デプロイ（push → 自動デプロイ トリガー）  
3. **バックアップ計画**  
 - **開発環境（H2）**：定期的に `~/database_backup/` にファイルコピー  
 - **本番環境（PostgreSQL）**：  
   - PaaS の自動バックアップ機能を利用（Railway/Render では定期スナップショット）  
   - 最低でも週１回のバックアップを取得し、自分の Google Drive などにエクスポートデータを保持  
4. **ログ管理**  
 - アプリケーションログは以下のように出力レベルを分けてファイルに保存  
   - `info.log`：INFO レベル以上  
   - `error.log`：ERROR および WARN レベル  
 - ローカル開発では標準出力＋IDE での確認  
 - 本番環境では PaaS によるログ保存機能または外部ログ管理サービス（Papertrail・Logflare など）の無料枠を利用  
5. **監視・可観測性**  
 - **Spring Boot Actuator** を有効化し、`/actuator/health` や `/actuator/metrics` を活用  
 - PaaS 上で稼働している場合、外部監視ツール（Uptime Robot の無料プランなど）で定期的な HTTP 監視を行い、ダウン検知をメールで通知  
6. **テスト**  
 - **単体テスト**：JUnit 5 + Mockito  
 - **結合テスト**：Spring Boot Test（インメモリ H2 でのリポジトリテスト）  
 - **E2E テスト**：Cypress（フロントエンド）＋Mock サーバ or ローカルバックエンド  
7. **メンテナンススケジュール**  
 - 毎月第1週目に依存ライブラリのバージョンアップ確認  
 - 四半期ごとにセキュリティスキャン（Snyk、Dependabot など）実施  
 - 年１回、技術選定の見直し（フレームワークやライブラリの陳腐化チェック）  

---

## 用語定義
- **SPA（Single-Page Application）**：ユーザー操作に応じて動的に画面を書き換えるフロントエンドアーキテクチャ  
- **Gantt チャート**：タスクの開始日・終了日・進捗を視覚的にガントバーとして表現する図  
- **CRUD**：Create, Read, Update, Delete の頭文字で、データベース操作の基本的な4機能  
- **PaaS（Platform as a Service）**：アプリケーションの開発・運用環境をクラウドベンダーが提供するサービス（例：Railway, Render, Fly.io など）  
- **Flyway / Liquibase**：データベーススキーマのバージョン管理およびマイグレーションを自動化するツール  
- **H2 Database**：Java 製の組み込み型リレーショナルデータベース。開発・テスト用に最適  
- **PostgreSQL**：オープンソースのリレーショナルデータベース管理システム  
- **React / Vue / Angular**：いずれも JavaScript ベースのフロントエンドフレームワーク／ライブラリ  
- **REST API**：HTTP プロトコルを用いた設計原則に従った Web API  
- **CORS（Cross-Origin Resource Sharing）**：ブラウザ間でのリソース共有を制御する仕組み  
- **CI/CD**：継続的インテグレーション／継続的デリバリーの略。コード変更時に自動でビルド・テスト・デプロイを行うワークフロー  
- **Actuator**：Spring Boot に組み込まれた監視・管理エンドポイントを提供するモジュール  
- **E2E テスト（End-to-End Test）**：ユーザーの操作シナリオをブラウザ上で自動テストし、システム全体の動作を確認するテスト手法  

---
