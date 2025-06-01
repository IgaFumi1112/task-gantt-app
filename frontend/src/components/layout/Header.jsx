// src/components/layout/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <nav className="bg-gray-800 p-4 text-white flex space-x-4">
      <Link to="/projects" className="hover:underline">
        プロジェクト一覧
      </Link>
      <Link to="/projects" className="hover:underline">
        ガントチャート
      </Link>
      {/* 必要に応じて検索ページやホームへリンクを追加 */}
    </nav>
  );
}
