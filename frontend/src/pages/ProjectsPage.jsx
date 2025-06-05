// src/pages/ProjectsPage.jsx
// import React, { useEffect, useState } from 'react';
// import ProjectList from '../components/project/ProjectList';
// import { getAllProjects } from '../api/projectApi';

// export default function ProjectsPage() {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // バックエンドの GET /api/projects を呼び、ツリー構造の配列を受け取る
//     getAllProjects()
//       .then((res) => {
//         setProjects(res.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setError('プロジェクトの取得に失敗しました');
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <p>読み込み中…</p>;
//   if (error) return <p className="text-red-600">{error}</p>;

//   return (
//     <div className="ProjectsPage">
//       <h1 className="text-2xl font-bold mb-4">プロジェクト一覧</h1>
//       <ProjectList projects={projects} />
//     </div>
//   );
// }

import React from 'react';

export default function ProjectsPage() {
  return <div style={{padding:'2rem'}}>【ProjectsPage】 が表示されています。</div>;
}
