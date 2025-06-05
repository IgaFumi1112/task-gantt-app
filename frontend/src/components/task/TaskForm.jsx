// src/components/task/TaskForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getTaskById,
  createTask,
  updateTask,
} from '../../api/taskApi';

export default function TaskForm() {
  const navigate = useNavigate();
  const { projectId, taskId } = useParams();

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
    if (!title.trim()) return alert('タスク名は必須です');
    if (plannedStartDate > plannedEndDate) return alert('計画開始日は終了日以前を指定してください');
    if (actualStartDate && actualEndDate && actualStartDate > actualEndDate) return alert('実績開始日は実績終了日以前を指定してください');

    const dto = {
      projectId: parseInt(projectId, 10),
      title,
      description,
      plannedStartDate,
      plannedEndDate,
      actualStartDate: actualStartDate || null,
      actualEndDate: actualEndDate || null,
      status,
      priority,
    };

    if (taskId) {
      updateTask(taskId, dto)
        .then(() => navigate(`/projects/${projectId}/tasks`))
        .catch((err) => {
          console.error(err);
          alert('タスクの更新に失敗しました');
        });
    } else {
      createTask(dto)
        .then(() => navigate(`/projects/${projectId}/tasks`))
        .catch((err) => {
          console.error(err);
          alert('タスクの作成に失敗しました');
        });
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-xl mx-auto p-8 cyber-panel-bg neon-outline rounded-3xl drop-shadow-glow-cyan">
      <h2 className="text-2xl neon-text font-bold mb-6">
        {taskId ? 'タスク編集' : '新規タスク作成'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">
            タスク名 <span className="text-neon-pink">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
             className="w-full px-3 py-2 bg-cyber-panel border border-gray-700 rounded-lg text-white focus-neon"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">詳細説明</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
             className="w-full px-3 py-2 bg-cyber-panel border border-gray-700 rounded-lg text-white focus-neon"
            rows="3"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">計画開始日</label>
          <input
            type="date"
            value={plannedStartDate}
            onChange={(e) => setPlannedStartDate(e.target.value)}
             className="px-3 py-2 bg-cyber-panel border border-gray-700 rounded-lg text-white focus-neon"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">計画終了日</label>
          <input
            type="date"
            value={plannedEndDate}
            onChange={(e) => setPlannedEndDate(e.target.value)}
             className="px-3 py-2 bg-cyber-panel border border-gray-700 rounded-lg text-white focus-neon"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">実績開始日 (任意)</label>
          <input
            type="date"
            value={actualStartDate}
            onChange={(e) => setActualStartDate(e.target.value)}
             className="px-3 py-2 bg-cyber-panel border border-gray-700 rounded-lg text-white focus-neon"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">実績終了日 (任意)</label>
          <input
            type="date"
            value={actualEndDate}
            onChange={(e) => setActualEndDate(e.target.value)}
             className="px-3 py-2 bg-cyber-panel border border-gray-700 rounded-lg text-white focus-neon"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">ステータス</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
             className="px-3 py-2 bg-cyber-panel border border-gray-700 rounded-lg text-white focus-neon"
          >
            <option value="未着手">未着手</option>
            <option value="進行中">進行中</option>
            <option value="完了">完了</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">優先度</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
             className="px-3 py-2 bg-cyber-panel border border-gray-700 rounded-lg text-white focus-neon"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

         <div className="flex space-x-6">
           <button
             type="submit"
             className="neon-button"
           >
             {taskId ? '更新' : '作成'}
           </button>
           <button
             type="button"
             onClick={() => navigate(`/projects/${projectId}/tasks`)}
             className="px-6 py-3 bg-gray-800 text-neon-cyan rounded-lg hover:bg-gray-700 transition duration-150"
           >
             キャンセル
           </button>
         </div>
       </form>
     </div>
  );
}
