// src/components/task/TaskForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getTasksByProjectId,
  getTaskById,
  createTask,
  updateTask,
} from '../../api/taskApi';

export default function TaskForm() {
  const navigate = useNavigate();
  const { projectId, taskId } = useParams(); // 編集モードなら taskId が存在

  // フォーム入力用 state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [plannedStartDate, setPlannedStartDate] = useState('');
  const [plannedEndDate, setPlannedEndDate] = useState('');
  const [actualStartDate, setActualStartDate] = useState('');
  const [actualEndDate, setActualEndDate] = useState('');
  const [status, setStatus] = useState('未着手');
  const [priority, setPriority] = useState('Medium');

  const [error, setError] = useState(null);

  useEffect(() => {
    if (taskId) {
      // 編集モード → 既存タスク情報を取得
      getTaskById(taskId)
        .then((res) => {
          const t = res.data;
          setTitle(t.title);
          setDescription(t.description || '');
          setPlannedStartDate(t.plannedStartDate);
          setPlannedEndDate(t.plannedEndDate);
          setActualStartDate(t.actualStartDate || '');
          setActualEndDate(t.actualEndDate || '');
          setStatus(t.status);
          setPriority(t.priority);
        })
        .catch((err) => {
          console.error(err);
          setError('タスク情報の取得に失敗しました');
        });
    }
  }, [taskId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // バリデーション
    if (!title.trim()) {
      alert('タスク名は必須です');
      return;
    }
    if (plannedStartDate > plannedEndDate) {
      alert('計画開始日は終了日以前を指定してください');
      return;
    }
    if (actualStartDate && actualEndDate && actualStartDate > actualEndDate) {
      alert('実績開始日は実績終了日以前を指定してください');
      return;
    }

    const dto = {
      projectId: parseInt(projectId, 10),
      title,
      description,
      plannedStartDate,
      plannedEndDate,
      actualStartDate: actualStartDate || null,
      actualEndDate: actualEndDate || null,
      // サーバー側で progress を自動計算する想定なので、ここでは送らない
      status,
      priority,
    };

    if (taskId) {
      // 編集モード
      updateTask(taskId, dto)
        .then(() => {
          navigate(`/projects/${projectId}/tasks`);
        })
        .catch((err) => {
          console.error(err);
          alert('タスクの更新に失敗しました');
        });
    } else {
      // 新規作成
      createTask(dto)
        .then(() => {
          navigate(`/projects/${projectId}/tasks`);
        })
        .catch((err) => {
          console.error(err);
          alert('タスクの作成に失敗しました');
        });
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">
        {taskId ? 'タスク編集' : '新規タスク作成'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* タスク名 */}
        <div>
          <label className="block mb-1 font-medium">
            タスク名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1"
            required
          />
        </div>

        {/* 詳細説明 */}
        <div>
          <label className="block mb-1 font-medium">詳細説明</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1"
            rows="3"
          />
        </div>

        {/* 計画開始日 */}
        <div>
          <label className="block mb-1 font-medium">計画開始日</label>
          <input
            type="date"
            value={plannedStartDate}
            onChange={(e) => setPlannedStartDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
            required
          />
        </div>

        {/* 計画終了日 */}
        <div>
          <label className="block mb-1 font-medium">計画終了日</label>
          <input
            type="date"
            value={plannedEndDate}
            onChange={(e) => setPlannedEndDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
            required
          />
        </div>

        {/* 実績開始日 */}
        <div>
          <label className="block mb-1 font-medium">実績開始日 (任意)</label>
          <input
            type="date"
            value={actualStartDate}
            onChange={(e) => setActualStartDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>

        {/* 実績終了日 */}
        <div>
          <label className="block mb-1 font-medium">実績終了日 (任意)</label>
          <input
            type="date"
            value={actualEndDate}
            onChange={(e) => setActualEndDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>

        {/* ステータス */}
        <div>
          <label className="block mb-1 font-medium">ステータス</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="未着手">未着手</option>
            <option value="進行中">進行中</option>
            <option value="完了">完了</option>
          </select>
        </div>

        {/* 優先度 */}
        <div>
          <label className="block mb-1 font-medium">優先度</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* 送信ボタン */}
        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {taskId ? '更新' : '作成'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/projects/${projectId}/tasks`)}
            className="ml-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
