// src/pages/GanttPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGanttData } from '../api/projectApi';
import GanttChart from '../components/gantt/GanttChart';

export default function GanttPage() {
  const { projectId } = useParams();
  const [mode, setMode] = useState('annual');   // 'annual' or 'monthly'
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1〜12

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // データフェッチ
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

  if (loading) return <p>読み込み中…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="GanttPage p-4">
      <h1 className="text-2xl font-bold mb-4">ガントチャート (プロジェクト {projectId})</h1>

      {/* 切り替えUI */}
      <div className="flex items-center mb-4 space-x-4">
        {/* モード切替 */}
        <label>
          <input
            type="radio"
            value="annual"
            checked={mode === 'annual'}
            onChange={() => setMode('annual')}
            className="mr-1"
          />
          年間表示
        </label>
        <label>
          <input
            type="radio"
            value="monthly"
            checked={mode === 'monthly'}
            onChange={() => setMode('monthly')}
            className="mr-1"
          />
          月間表示
        </label>

        {/* 年月選択（monthly のときのみ有効化） */}
        {mode === 'monthly' && (
          <>
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value, 10))}
              className="border border-gray-300 rounded px-2 py-1"
            >
              {/*前年・今年・来年などから選べるよう適宜追加*/}
              <option value={today.getFullYear() - 1}>
                {today.getFullYear() - 1}
              </option>
              <option value={today.getFullYear()}>
                {today.getFullYear()}
              </option>
              <option value={today.getFullYear() + 1}>
                {today.getFullYear() + 1}
              </option>
            </select>
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value, 10))}
              className="border border-gray-300 rounded px-2 py-1"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}月
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* 実際のガントチャートを描画するコンポーネント */}
      <GanttChart tasks={tasks} mode={mode} year={year} month={month} />
    </div>
  );
}
