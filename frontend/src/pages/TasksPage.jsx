// src/pages/TasksPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import TaskList from '../components/task/TaskList';
import { getTasksByProjectId } from '../api/taskApi';

export default function TasksPage() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ソート用 state
  const [sortKey, setSortKey] = useState('plannedEndDate');
  const [sortOrder, setSortOrder] = useState('asc');

  // 検索用 state
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = () => {
    setLoading(true);
    getTasksByProjectId(projectId)
      .then((res) => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('タスク一覧の取得に失敗しました');
        setLoading(false);
      });
  };

  if (loading) return <p>読み込み中…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="TasksPage p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">タスク一覧 (プロジェクト {projectId})</h1>
        {/* 新規タスク作成ボタン */}
        <Link
          to={`/projects/${projectId}/tasks/new`}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          新規タスク作成
        </Link>
      </div>

      {/* 検索ボックス */}
      <div className="mb-2">
        <input
          type="text"
          placeholder="タスク名で検索"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 w-1/2"
        />
      </div>

      {/* TaskList コンポーネントに props を渡す */}
      <TaskList
        tasks={tasks}
        projectId={projectId}
        sortKey={sortKey}
        sortOrder={sortOrder}
        setSortKey={setSortKey}
        setSortOrder={setSortOrder}
        keyword={keyword}
        onDeleteSuccess={fetchTasks}
      />
    </div>
  );
}
