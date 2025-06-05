// src/components/gantt/GanttChart.jsx
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Gantt from 'frappe-gantt';
import '../../style/frappe-gantt.css'; // コピーしたCSSを読み込み

export default function GanttChart({ tasks, mode, year, month }) {
  const ganttRef = useRef(null);

  const mapToGanttTasks = () => {
    return tasks.map((item) => {
      const start = item.plannedStartDate;
      const end = item.plannedEndDate;

      return {
        id: item.taskId.toString(),
        name: item.title,
        start,
        end,
        progress: item.progress,
        custom_class: 'planned-task',
        actual_start: item.actualStartDate,
        actual_end: item.actualEndDate,
      };
    });
  };

  useEffect(() => {
    if (!ganttRef.current) return;
    ganttRef.current.innerHTML = '';

    const tasksForGantt = mapToGanttTasks();
    const options = {
      view_mode: mode === 'annual' ? 'Year' : 'Day',
      date_format: 'YYYY-MM-DD',
      custom_popup_html: (task) => {
        return `
          <div class="gantt-popup">
            <strong>${task.name}</strong><br/>
            <span class="text-sm text-neon-cyan">予定: ${task._start.format('YYYY-MM-DD')} ～ ${task._end.format('YYYY-MM-DD')}</span><br/>
            <span class="text-sm text-neon-pink">実績: ${task.actual_start || '-'} ～ ${task.actual_end || '-'}</span><br/>
            <span class="text-sm text-neon-lime">進捗: ${task.progress}%</span>
          </div>
        `;
      },
    };

    const gantt = new Gantt(ganttRef.current, tasksForGantt, options);

    // 実績バーをカスタムCSSで表示する場合の例（擬似要素を追加）
    // ここではCSSのみでグローを付与
  }, [tasks, mode, year, month]);

  return (
    <div className="overflow-auto cyber-panel-bg neon-outline rounded-lg p-4 drop-shadow-glow-cyan">
      <div
        ref={ganttRef}
        className="gantt-container"
        style={{ minHeight: '500px' }}
      />
    </div>
  );
}

GanttChart.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      taskId: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      plannedStartDate: PropTypes.string.isRequired,
      plannedEndDate: PropTypes.string.isRequired,
      actualStartDate: PropTypes.string,
      actualEndDate: PropTypes.string,
      progress: PropTypes.number.isRequired,
    })
  ).isRequired,
  mode: PropTypes.oneOf(['annual', 'monthly']).isRequired,
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
};
