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
  if (!project) return <p className="text-neon-cyan">読み込み中…</p>;

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
   <div className="max-w-lg mx-auto p-6 cyber-panel-bg neon-outline rounded-2xl drop-shadow-glow-pink">
     <h2 className="text-2xl neon-text font-bold mb-6">プロジェクト詳細</h2>
      <div>
       <p className="mb-2"><span className="text-neon-pink font-semibold">● 名前：</span><span className="text-white">{project.name}</span></p>
       <p className="mb-2"><span className="text-neon-pink font-semibold">● 概要：</span><span className="text-white">{project.description || '-'}</span></p>
       <p className="mb-2"><span className="text-neon-pink font-semibold">● 親プロジェクト：</span>
         {project.parentProjectId ? (
           <Link
             to={`/projects/${project.parentProjectId}`}
             className="text-neon-cyan hover:text-neon-pink underline"
           >
             プロジェクト #{project.parentProjectId}
           </Link>
         ) : (
           <span className="text-white">-</span>
         )}
       </p>
       <p className="mb-2"><span className="text-neon-pink font-semibold">● 計画期間：</span><span className="text-white">{project.plannedStartDate} ～ {project.plannedEndDate}</span></p>
       <p className="mb-2"><span className="text-neon-pink font-semibold">● 進捗：</span><span className="text-white">{project.progress}%</span></p>
       <p className="mb-2"><span className="text-neon-pink font-semibold">● 作成日時：</span><span className="text-white">{project.createdAt}</span></p>
       <p className="mb-2"><span className="text-neon-pink font-semibold">● 更新日時：</span><span className="text-white">{project.updatedAt}</span></p>
      </div>

      <div className="mt-6 flex space-x-4">
        {/* 編集ボタン */}
       <Link
         to={`/projects/${projectId}/edit`}
         className="neon-button text-sm flex items-center space-x-2"
       >
         <span>編集</span>
       </Link>

        {/* タスク一覧ボタン */}
       <Link
         to={`/projects/${projectId}/tasks`}
         className="neon-button text-sm flex items-center space-x-2"
       >
         <span>タスク一覧</span>
       </Link>

        {/* ガントチャートボタン */}
       <Link
         to={`/projects/${projectId}/gantt`}
         className="neon-button text-sm flex items-center space-x-2"
       >
         <span>ガントチャート</span>
       </Link>

        {/* 削除ボタン */}
       <button
         onClick={handleDelete}
         className="neon-button text-sm flex items-center space-x-2"
       >
         <span>削除</span>
       </button>
      </div>
    </div>
  );
}
