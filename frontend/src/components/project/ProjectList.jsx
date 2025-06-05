// src/components/project/ProjectList.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { deleteProject } from '../../api/projectApi';

export default function ProjectList({
  projects,
  onDeleteSuccess,
  sortKey,
  sortOrder,
  setSortKey,
  setSortOrder,
  keyword,
}) {
  // フィルタ＆ソートロジックは同様なので省略
  const filtered = projects
  .filter((p) =>
    (p.name ?? '').toLowerCase().includes((keyword ?? '').toLowerCase()))
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

  const handleDelete = (projectId) => {
    if (!window.confirm('本当にこのプロジェクトを削除しますか？')) return;
    deleteProject(projectId)
      .then(() => onDeleteSuccess())
      .catch((err) => {
        console.error(err);
        alert('削除に失敗しました');
      });
  };

  return (
   <div className="overflow-x-auto cyber-panel-bg neon-outline rounded-lg">
     <table className="min-w-full text-sm">
       <thead>
         <tr className="bg-[#111421] border-b border-gray-700">
           <th
             className="p-3 neon-text cursor-pointer"
             onClick={() => handleSort('name')}
           >
             プロジェクト名 {sortKey === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
           </th>
           <th className="p-3 neon-text">概要</th>
           <th
             className="p-3 neon-text cursor-pointer"
             onClick={() => handleSort('plannedStartDate')}
           >
             計画期間 {sortKey === 'plannedStartDate' && (sortOrder === 'asc' ? '▲' : '▼')}
           </th>
           <th
             className="p-3 neon-text cursor-pointer"
             onClick={() => handleSort('progress')}
           >
             進捗 {sortKey === 'progress' && (sortOrder === 'asc' ? '▲' : '▼')}
           </th>
           <th className="p-3 neon-text">操作</th>
         </tr>
       </thead>
       <tbody>
         {filtered.map((p, idx) => (
           <tr
             key={p.id}
             className={`border-b border-gray-700
               ${idx % 2 === 0 ? 'bg-[#151a2f]' : 'bg-cyber-panel'}
               cyber-hover-bg`}
           >
             <td className="p-3 neon-text">{p.name}</td>
             <td className="p-3">{p.description}</td>
             <td className="p-3">
               {p.plannedStartDate} ～ {p.plannedEndDate}
             </td>
             <td className="p-3">{p.progress}%</td>
             <td className="p-3 flex space-x-2">
               <Link
                 to={`/projects/${p.id}`}
                 className="neon-button text-xs flex items-center space-x-1"
               >
                 <span>詳細</span>
               </Link>
               <Link
                 to={`/projects/${p.id}/edit`}
                 className="neon-button text-xs flex items-center space-x-1"
               >
                 <span>編集</span>
               </Link>
               <button
                 onClick={() => handleDelete(p.id)}
                 className="neon-button text-xs flex items-center space-x-1"
               >
                 <span>削除</span>
               </button>
             </td>
           </tr>
         ))}
         {filtered.length === 0 && (
           <tr>
             <td colSpan="5" className="p-4 text-center text-gray-500">
               該当するプロジェクトがありません
             </td>
           </tr>
         )}
       </tbody>
     </table>
   </div>
  );
}

ProjectList.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      plannedStartDate: PropTypes.string.isRequired,
      plannedEndDate: PropTypes.string.isRequired,
      progress: PropTypes.number.isRequired,
    })
  ).isRequired,
  onDeleteSuccess: PropTypes.func.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  setSortKey: PropTypes.func.isRequired,
  setSortOrder: PropTypes.func.isRequired,
  keyword: PropTypes.string.isRequired,
};
