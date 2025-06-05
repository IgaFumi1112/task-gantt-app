// src/components/project/ProjectDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProjectById, deleteProject } from '../../api/projectApi';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // プロジェクト詳細を取得
    getProjectById(projectId)
      .then((res) => {
        setProject(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError('プロジェクト情報の取得に失敗しました');
      });
  }, [projectId]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!project) return <p>読み込み中…</p>;

  const handleDelete = () => {
    if (!window.confirm('本当にこのプロジェクトを削除しますか？\n※ 子プロジェクトおよび関連タスクもすべて削除されます。')) {
      return;
    }
    deleteProject(projectId)
      .then(() => {
        navigate('/projects');
      })
      .catch((err) => {
        console.error(err);
        alert('プロジェクトの削除に失敗しました');
      });
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">プロジェクト詳細</h2>
      <div className="space-y-2">
        <p>
          <strong>名前：</strong> {project.name}
        </p>
        <p>
          <strong>概要：</strong> {project.description || '-'}
        </p>
        <p>
          <strong>親プロジェクト：</strong>{' '}
          {project.parentProjectId ? (
            <Link
              to={`/projects/${project.parentProjectId}`}
              className="text-blue-600 hover:underline"
            >
              {/* 親プロジェクト名は表示されないため、ID をそのまま表示 */}
              プロジェクト #{project.parentProjectId}
            </Link>
          ) : (
            '-'
          )}
        </p>
        <p>
          <strong>計画期間：</strong> {project.plannedStartDate} ～{' '}
          {project.plannedEndDate}
        </p>
        <p>
          <strong>進捗：</strong> {project.progress}%
        </p>
        <p>
          <strong>作成日時：</strong> {project.createdAt}
        </p>
        <p>
          <strong>更新日時：</strong> {project.updatedAt}
        </p>
      </div>

      <div className="mt-4 space-x-2">
        {/* 編集ボタン */}
        <Link
          to={`/projects/${projectId}/edit`}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          編集
        </Link>

        {/* タスク一覧ボタン */}
        <Link
          to={`/projects/${projectId}/tasks`}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          タスク一覧
        </Link>

        {/* ガントチャートボタン */}
        <Link
          to={`/projects/${projectId}/gantt`}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          ガントチャート
        </Link>

        {/* 削除ボタン */}
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          削除
        </button>
      </div>
    </div>
  );
}
