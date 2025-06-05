// src/components/task/TaskList.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { deleteTask } from '../../api/taskApi';

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
  // フィルタ＋ソート部分は省略（変更なし）
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
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
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
   <div className="overflow-x-auto cyber-panel-bg neon-outline rounded-lg">
     <table className="min-w-full text-sm">
       <thead>
         <tr className="bg-[#111421] border-b border-gray-700">
           <th
             className="p-3 neon-text cursor-pointer"
             onClick={() => handleSort('title')}
           >
             タスク名 {sortKey === 'title' && (sortOrder === 'asc' ? '▲' : '▼')}
           </th>
           <th
             className="p-3 neon-text cursor-pointer"
             onClick={() => handleSort('plannedStartDate')}
           >
             計画開始日 {sortKey === 'plannedStartDate' && (sortOrder === 'asc' ? '▲' : '▼')}
           </th>
           <th
             className="p-3 neon-text cursor-pointer"
             onClick={() => handleSort('plannedEndDate')}
           >
             計画終了日 {sortKey === 'plannedEndDate' && (sortOrder === 'asc' ? '▲' : '▼')}
           </th>
           <th className="p-3 neon-text">実績開始日</th>
           <th className="p-3 neon-text">実績終了日</th>
           <th
             className="p-3 neon-text cursor-pointer"
             onClick={() => handleSort('progress')}
           >
             進捗率 {sortKey === 'progress' && (sortOrder === 'asc' ? '▲' : '▼')}
           </th>
           <th
             className="p-3 neon-text cursor-pointer"
             onClick={() => handleSort('status')}
           >
             ステータス {sortKey === 'status' && (sortOrder === 'asc' ? '▲' : '▼')}
           </th>
           <th
             className="p-3 neon-text cursor-pointer"
             onClick={() => handleSort('priority')}
           >
             優先度 {sortKey === 'priority' && (sortOrder === 'asc' ? '▲' : '▼')}
           </th>
           <th className="p-3 neon-text">操作</th>
         </tr>
       </thead>
       <tbody>
         {filtered.map((t, idx) => (
           <tr
             key={t.id}
             className={`border-b border-gray-700
               ${idx % 2 === 0 ? 'bg-[#151a2f]' : 'bg-cyber-panel'}
               cyber-hover-bg`}
           >
             <td className="p-3 neon-text">{t.title}</td>
             <td className="p-3">{t.plannedStartDate}</td>
             <td className="p-3">{t.plannedEndDate}</td>
             <td className="p-3">{t.actualStartDate || '-'}</td>
             <td className="p-3">{t.actualEndDate || '-'}</td>
             <td className="p-3">{t.progress}%</td>
             <td className="p-3">{t.status}</td>
             <td className="p-3">{t.priority}</td>
             <td className="p-3 flex space-x-2">
               <Link
                 to={`/tasks/${t.id}`}
                 className="neon-button text-xs flex items-center space-x-1"
               >
                 <span>詳細</span>
               </Link>
               <Link
                 to={`/projects/${projectId}/tasks/${t.id}/edit`}
                 className="neon-button text-xs flex items-center space-x-1"
               >
                 <span>編集</span>
               </Link>
               <button
                 onClick={() => handleDelete(t.id)}
                 className="neon-button text-xs flex items-center space-x-1"
               >
                 <span>削除</span>
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
   </div>
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
