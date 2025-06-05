// src/pages/ProjectsPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';         // 追記
import ProjectList from '../components/project/ProjectList';
import { getAllProjects } from '../api/projectApi';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllProjects()
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('プロジェクトの取得に失敗しました');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>読み込み中…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="ProjectsPage">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">プロジェクト一覧</h1>
        {/* 新規作成ボタン */}
        <Link
          to="/projects/new"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          新規プロジェクト作成
        </Link>
      </div>
      <ProjectList projects={projects} />
    </div>
  );
}
