// src/components/task/TaskDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTaskById } from '../../api/taskApi';

export default function TaskDetail() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTaskById(taskId)
      .then((res) => {
        setTask(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError('タスク情報の取得に失敗しました');
      });
  }, [taskId]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!task) return <p>読み込み中…</p>;

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">タスク詳細</h2>
      <div>
        <p><strong>タイトル：</strong>{task.title}</p>
        <p><strong>説明：</strong>{task.description || '-'}</p>
        <p><strong>計画期間：</strong>{task.plannedStartDate} ～ {task.plannedEndDate}</p>
        <p><strong>実績期間：</strong>
          {task.actualStartDate ? task.actualStartDate : '-'} ～ {task.actualEndDate ? task.actualEndDate : '-'}
        </p>
        <p><strong>進捗：</strong>{task.progress}%</p>
        <p><strong>ステータス：</strong>{task.status}</p>
        <p><strong>優先度：</strong>{task.priority}</p>
      </div>
      {/* 編集ボタン */}
      <div className="mt-4">
        <Link
          to={`/projects/${task.projectId}/tasks/${task.id}/edit`}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          編集
        </Link>
      </div>
    </div>
  );
}
