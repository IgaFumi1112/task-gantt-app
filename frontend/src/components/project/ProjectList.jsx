// src/components/project/ProjectList.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * projects: 親→子→孫…とネストした配列を渡す想定
 * each project: { id, name, description, progress, plannedStartDate, plannedEndDate, children: [ ... ] }
 */
export default function ProjectList({ projects, level = 0 }) {
  return (
    <ul className={level === 0 ? 'pl-0' : 'pl-4'}>
      {projects.map((proj) => (
        <li key={proj.id} className="mb-2">
          <div className="flex items-center space-x-2">
            {/* インデント表示のため、ネストレベルに応じて左余白を付ける */}
            <div style={{ width: `${level * 1}rem` }} />

            <div className="flex-1">
              <Link
                to={`/projects/${proj.id}`}
                className="text-lg font-medium text-blue-600 hover:underline"
              >
                {proj.name}
              </Link>
              <span className="ml-2 text-sm text-gray-500">
                進捗: {proj.progress}%
              </span>
              <div className="text-xs text-gray-400">
                期間: {proj.plannedStartDate} ～ {proj.plannedEndDate}
              </div>
            </div>

            {/* タスク一覧・ガントチャートへのリンク */}
            <div className="flex space-x-2">
              <Link
                to={`/projects/${proj.id}/tasks`}
                className="text-sm px-2 py-1 bg-green-200 rounded hover:bg-green-300"
              >
                タスク一覧
              </Link>
              <Link
                to={`/projects/${proj.id}/gantt`}
                className="text-sm px-2 py-1 bg-purple-200 rounded hover:bg-purple-300"
              >
                ガントチャート
              </Link>
            </div>
          </div>

          {/* 子プロジェクトがあれば再帰呼び出し */}
          {proj.children && proj.children.length > 0 && (
            <ProjectList projects={proj.children} level={level + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}

ProjectList.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      progress: PropTypes.number.isRequired,
      plannedStartDate: PropTypes.string.isRequired,
      plannedEndDate: PropTypes.string.isRequired,
      children: PropTypes.array,
    })
  ).isRequired,
  level: PropTypes.number,
};
