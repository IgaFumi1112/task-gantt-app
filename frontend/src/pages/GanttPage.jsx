// src/pages/GanttPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGanttData } from '../api/projectApi';
import GanttChart from '../components/gantt/GanttChart';

export default function GanttPage() {
  const { projectId } = useParams();
  const [mode, setMode] = useState('annual');
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const params = mode === 'annual'
      ? { mode: 'annual' }
      : { mode: 'monthly', year, month };
    getGanttData(projectId, params.mode, params.year, params.month)
      .then((res) => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('ガントチャート用データ取得に失敗しました');
        setLoading(false);
      });
  }, [projectId, mode, year, month]);

  if (loading) return <p className="text-neon-cyan">読み込み中…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="GanttPage p-4">
      <h1 className="text-3xl neon-text font-bold mb-6">
        ガントチャート (プロジェクト {projectId})
      </h1>

      <div className="flex items-center mb-6 space-x-6">
        <label className="flex items-center neon-text">
          <input
            type="radio"
            value="annual"
            checked={mode === 'annual'}
            onChange={() => setMode('annual')}
            className="mr-2 accent-neon-cyan"
          />
          年間表示
        </label>
        <label className="flex items-center neon-text">
          <input
            type="radio"
            value="monthly"
            checked={mode === 'monthly'}
            onChange={() => setMode('monthly')}
            className="mr-2 accent-neon-cyan"
          />
          月間表示
        </label>

        {mode === 'monthly' && (
          <>
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value, 10))}
              className="px-3 py-2 bg-cyber-panel border border-gray-700 rounded-lg text-white focus-neon"
            >
              <option value={today.getFullYear() - 1}>{today.getFullYear() - 1}</option>
              <option value={today.getFullYear()}>{today.getFullYear()}</option>
              <option value={today.getFullYear() + 1}>{today.getFullYear() + 1}</option>
            </select>
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value, 10))}
              className="px-3 py-2 bg-cyber-panel border border-gray-700 rounded-lg text-white focus-neon"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} 月
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* ガントチャート本体 */}
      <GanttChart tasks={tasks} mode={mode} year={year} month={month} />
    </div>
  );
}
