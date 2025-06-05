// src/components/layout/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
   <nav className="flex justify-between items-center p-4 cyber-panel-bg neon-outline">
     <h1 className="text-3xl neon-text font-bold">⚡ TaskGanttApp</h1>
     <div className="flex space-x-6">
       <Link to="/projects" className="neon-text font-medium hover:text-neon-pink transition-colors">
         プロジェクト一覧
       </Link>
       <Link to="/projects/1/gantt" className="neon-text font-medium hover:text-neon-pink transition-colors">
         ガントチャート
       </Link>
     </div>
   </nav>
  );
}
