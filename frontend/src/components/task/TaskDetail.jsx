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
  if (!task) return <p className="text-neon-cyan">読み込み中…</p>;

  return (
   <div className="max-w-md mx-auto p-6 cyber-panel-bg neon-outline rounded-2xl drop-shadow-glow-lime">
     <h2 className="text-2xl neon-text font-bold mb-6">タスク詳細</h2>
     <div className="space-y-3">
       <p><span className="text-neon-pink font-semibold">► タイトル：</span><span className="text-white">{task.title}</span></p>
       <p><span className="text-neon-pink font-semibold">► 説明：</span><span className="text-white">{task.description || '-'}</span></p>
       <p><span className="text-neon-pink font-semibold">► 計画期間：</span><span className="text-white">{task.plannedStartDate} ～ {task.plannedEndDate}</span></p>
       <p><span className="text-neon-pink font-semibold">► 実績期間：</span>
         <span className="text-white">{task.actualStartDate || '-'} ～ {task.actualEndDate || '-'}</span>
       </p>
       <p><span className="text-neon-pink font-semibold">► 進捗：</span><span className="text-white">{task.progress}%</span></p>
       <p><span className="text-neon-pink font-semibold">► ステータス：</span><span className="text-white">{task.status}</span></p>
       <p><span className="text-neon-pink font-semibold">► 優先度：</span><span className="text-white">{task.priority}</span></p>
     </div>
     <div className="mt-6">
       <Link
         to={`/projects/${task.projectId}/tasks/${task.id}/edit`}
         className="neon-button text-sm flex items-center space-x-2"
       >
         <span>編集</span>
       </Link>
     </div>
   </div>
  );
}
