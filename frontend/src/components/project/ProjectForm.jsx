// src/components/project/ProjectForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllProjects, getProjectById, createProject, updateProject } from '../../api/projectApi';

export default function ProjectForm() {
  const navigate = useNavigate();
  const { projectId } = useParams(); // 編集モード → projectId が存在

  // フォーム入力用の state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState(null);
  const [plannedStartDate, setPlannedStartDate] = useState('');
  const [plannedEndDate, setPlannedEndDate] = useState('');

  // プロジェクト一覧を取得し、親プロジェクト選択用に使う
  const [allProjects, setAllProjects] = useState([]);
  const [loadingParents, setLoadingParents] = useState(true);
  const [error, setError] = useState(null);

  // 編集モード時は既存プロジェクト情報を取得してフォームを初期化
  useEffect(() => {
    getAllProjects()
      .then((res) => {
        setAllProjects(res.data);
        setLoadingParents(false);
      })
      .catch((err) => {
        console.error(err);
        setError('親プロジェクトの取得に失敗しました');
        setLoadingParents(false);
      });

    if (projectId) {
      // 編集 → 既存情報を取得
      getProjectById(projectId)
        .then((res) => {
          const proj = res.data;
          setName(proj.name);
          setDescription(proj.description || '');
          setParentId(proj.parentProjectId || null);
          setPlannedStartDate(proj.plannedStartDate);
          setPlannedEndDate(proj.plannedEndDate);
        })
        .catch((err) => {
          console.error(err);
          setError('プロジェクト情報の取得に失敗しました');
        });
    }
  }, [projectId]);

  // Form の送信処理
  const handleSubmit = (e) => {
    e.preventDefault();

    // バリデーション：名前必須、日付チェック
    if (!name.trim()) {
      alert('プロジェクト名は必須です');
      return;
    }
    if (plannedStartDate > plannedEndDate) {
      alert('開始日は終了日以前を指定してください');
      return;
    }

    // DTO を作成
    const dto = {
      name,
      description,
      parentProjectId: parentId,
      plannedStartDate,
      plannedEndDate,
    };

    if (projectId) {
      // 編集モード
      updateProject(projectId, dto)
        .then(() => {
          navigate('/projects');
        })
        .catch((err) => {
          console.error(err);
          alert('プロジェクトの更新に失敗しました');
        });
    } else {
      // 新規作成モード
      createProject(dto)
        .then(() => {
          navigate('/projects');
        })
        .catch((err) => {
          console.error(err);
          alert('プロジェクトの作成に失敗しました');
        });
    }
  };

  if (loadingParents) return <p>親プロジェクト情報を読み込み中…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">
        {projectId ? 'プロジェクト編集' : '新規プロジェクト作成'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* プロジェクト名 */}
        <div>
          <label className="block mb-1 font-medium">
            プロジェクト名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1"
            required
          />
        </div>

        {/* 概要 */}
        <div>
          <label className="block mb-1 font-medium">概要</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1"
            rows="3"
          />
        </div>

        {/* 親プロジェクト選択 */}
        <div>
          <label className="block mb-1 font-medium">親プロジェクト (任意)</label>
          <select
            value={parentId || ''}
            onChange={(e) => setParentId(e.target.value || null)}
            className="w-full border border-gray-300 rounded px-2 py-1"
          >
            <option value="">-- 親プロジェクトなし --</option>
            {allProjects
              .filter((p) => p.id.toString() !== projectId) // 自分自身を除外
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>
        </div>

        {/* 計画開始日 */}
        <div>
          <label className="block mb-1 font-medium">計画開始日</label>
          <input
            type="date"
            value={plannedStartDate}
            onChange={(e) => setPlannedStartDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
            required
          />
        </div>

        {/* 計画終了日 */}
        <div>
          <label className="block mb-1 font-medium">計画終了日</label>
          <input
            type="date"
            value={plannedEndDate}
            onChange={(e) => setPlannedEndDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
            required
          />
        </div>

        {/* 送信ボタン */}
        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {projectId ? '更新' : '作成'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="ml-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
