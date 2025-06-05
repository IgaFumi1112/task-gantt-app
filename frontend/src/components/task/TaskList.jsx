// src/components/task/TaskList.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { deleteTask } from '../../api/taskApi';

/**
 * props:
 * - tasks: Array of { id, projectId, title, plannedStartDate, plannedEndDate, actualStartDate, actualEndDate, progress, status, priority }
 * - projectId: 親プロジェクトID
 * - sortKey, sortOrder, setSortKey, setSortOrder: ソート制御
 * - keyword: 検索キーワード
 * - onDeleteSuccess: 削除後の再フェッチを呼び出すコールバック
 */
export default function TaskList({
  tasks,
  projectId,
  sortKey,
  sortOrder,
  setSortKey,
  setSortOrder,
  keyword,
  onDeleteSuccess,
}) {
  // ソート・フィルタリングを適用
  const filtered = tasks
    .filter((t) => t.title.toLowerCase().includes(keyword.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[sortKey] || '';
      const bVal = b[sortKey] || '';
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (key) => {
    if (sortKey === key) {
      // 同じ列をクリック → オーダーを反転
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // 新しい列をクリック → 昇順でセット
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleDelete = (taskId) => {
    if (!window.confirm('本当にこのタスクを削除しますか？')) return;
    deleteTask(taskId)
      .then(() => {
        onDeleteSuccess();
      })
      .catch((err) => {
        console.error(err);
        alert('タスクの削除に失敗しました');
      });
  };

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-200">
          <th
            className="p-2 cursor-pointer"
            onClick={() => handleSort('title')}
          >
            タスク名 {sortKey === 'title' && (sortOrder === 'asc' ? '▲' : '▼')}
          </th>
          <th
            className="p-2 cursor-pointer"
            onClick={() => handleSort('plannedStartDate')}
          >
            計画開始日 {sortKey === 'plannedStartDate' && (sortOrder === 'asc' ? '▲' : '▼')}
          </th>
          <th
            className="p-2 cursor-pointer"
            onClick={() => handleSort('plannedEndDate')}
          >
            計画終了日 {sortKey === 'plannedEndDate' && (sortOrder === 'asc' ? '▲' : '▼')}
          </th>
          <th className="p-2">実績開始日</th>
          <th className="p-2">実績終了日</th>
          <th
            className="p-2 cursor-pointer"
            onClick={() => handleSort('progress')}
          >
            進捗率 {sortKey === 'progress' && (sortOrder === 'asc' ? '▲' : '▼')}
          </th>
          <th
            className="p-2 cursor-pointer"
            onClick={() => handleSort('status')}
          >
            ステータス {sortKey === 'status' && (sortOrder === 'asc' ? '▲' : '▼')}
          </th>
          <th
            className="p-2 cursor-pointer"
            onClick={() => handleSort('priority')}
          >
            優先度 {sortKey === 'priority' && (sortOrder === 'asc' ? '▲' : '▼')}
          </th>
          <th className="p-2">操作</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((t) => (
          <tr key={t.id} className="border-b">
            <td className="p-2">{t.title}</td>
            <td className="p-2">{t.plannedStartDate}</td>
            <td className="p-2">{t.plannedEndDate}</td>
            <td className="p-2">{t.actualStartDate || '-'}</td>
            <td className="p-2">{t.actualEndDate || '-'}</td>
            <td className="p-2">{t.progress}%</td>
            <td className="p-2">{t.status}</td>
            <td className="p-2">{t.priority}</td>
            <td className="p-2 space-x-2">
              <Link
                to={`/tasks/${t.id}`}
                className="text-sm px-2 py-1 bg-green-200 rounded hover:bg-green-300"
              >
                詳細
              </Link>
              <Link
                to={`/projects/${projectId}/tasks/${t.id}/edit`}
                className="text-sm px-2 py-1 bg-blue-200 rounded hover:bg-blue-300"
              >
                編集
              </Link>
              <button
                onClick={() => handleDelete(t.id)}
                className="text-sm px-2 py-1 bg-red-200 rounded hover:bg-red-300"
              >
                削除
              </button>
            </td>
          </tr>
        ))}
        {filtered.length === 0 && (
          <tr>
            <td colSpan="9" className="p-4 text-center text-gray-500">
              該当するタスクがありません
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      projectId: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      plannedStartDate: PropTypes.string.isRequired,
      plannedEndDate: PropTypes.string.isRequired,
      actualStartDate: PropTypes.string,
      actualEndDate: PropTypes.string,
      progress: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
    })
  ).isRequired,
  projectId: PropTypes.string.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  setSortKey: PropTypes.func.isRequired,
  setSortOrder: PropTypes.func.isRequired,
  keyword: PropTypes.string.isRequired,
  onDeleteSuccess: PropTypes.func.isRequired,
};
