// src/components/project/ProjectForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllProjects, getProjectById, createProject, updateProject } from '../../api/projectApi';

export default function ProjectForm() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState('');
  const [plannedStartDate, setPlannedStartDate] = useState('');
  const [plannedEndDate, setPlannedEndDate] = useState('');

  const [allProjects, setAllProjects] = useState([]);
  const [loadingParents, setLoadingParents] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllProjects()
      .then((res) => {
        setAllProjects(res.data);
        setLoadingParents(false);
      })
      .catch(() => {
        setError('親プロジェクト取得失敗');
        setLoadingParents(false);
      });

    if (projectId) {
      getProjectById(projectId)
        .then((res) => {
          const p = res.data;
          setName(p.name);
          setDescription(p.description || '');
          setParentId(p.parentProjectId || '');
          setPlannedStartDate(p.plannedStartDate);
          setPlannedEndDate(p.plannedEndDate);
        })
        .catch(() => setError('プロジェクト情報取得失敗'));
    }
  }, [projectId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('名前は必須です');
    if (plannedStartDate > plannedEndDate)
      return alert('開始日は終了日以前を指定してください');

    const dto = {
      name,
      description,
      parentProjectId: parentId || null,
      plannedStartDate,
      plannedEndDate,
    };

    const action = projectId
      ? updateProject(projectId, dto)
      : createProject(dto);

    action
      .then(() => navigate('/projects'))
      .catch(() => alert('保存に失敗しました'));
  };

  if (loadingParents) return <p className="text-neon-cyan">Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-lg mx-auto p-8 cyber-panel-bg neon-outline rounded-3xl drop-shadow-glow-lime">
      <h2 className="text-xl lg:text-2xl neon-text font-bold mb-6">
        {projectId ? 'プロジェクト編集' : '新規プロジェクト作成'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* プロジェクト名 */}
        <div className="space-y-1">
          <label className="block text-link font-semibold">
            プロジェクト名 <span className="text-neon-pink">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-cyber-panel border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-link"
            placeholder="例：次世代AI研究"
          />
        </div>
 
        {/* 概要 */}
        <div className="space-y-1">
          <label className="block text-link font-semibold">概要</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-cyber-panel border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-link"
            rows="4"
            placeholder="プロジェクトの概要を記入"
          />
        </div>
 
        {/* 親プロジェクト */}
        <div className="space-y-1">
          <label className="block text-neon-cyan font-semibold mb-2 text-lg">
            親プロジェクト (任意)
          </label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="w-full px-4 py-3 bg-cyber-panel border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-link"
          >
            <option value="">-- 選択しない --</option>
            {allProjects
              .filter((p) => p.id.toString() !== projectId)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>
        </div>
 
        {/* 計画期間 */}
        <div className="space-y-1">
          <label className="block text-neon-cyan font-semibold mb-2 text-lg">計画開始日</label>
          <input
            type="date"
            value={plannedStartDate}
            onChange={(e) => setPlannedStartDate(e.target.value)}
            className="w-full px-4 py-3 bg-cyber-panel border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-link"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-neon-cyan font-semibold mb-2 text-lg">計画終了日</label>
          <input
            type="date"
            value={plannedEndDate}
            onChange={(e) => setPlannedEndDate(e.target.value)}
            className="w-full px-4 py-3 bg-cyber-panel border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-link"
          />
        </div>
 
        {/* ボタン */}
        <div className="space-y-1">
          <button
            type="submit"
            className="btn px-6 py-3 bg-gray-800 text-neon-cyan rounded-lg hover:bg-gray-700 transition duration-150"
          >
            {projectId ? '更新' : '作成'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="btn px-6 py-3 bg-gray-800 text-neon-cyan rounded-lg hover:bg-gray-700 transition duration-150"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
