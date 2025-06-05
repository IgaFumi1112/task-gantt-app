// src/components/gantt/GanttChart.jsx
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Gantt from 'frappe-gantt';
import '../../style/frappe-gantt.css';

export default function GanttChart({ tasks, mode, year, month }) {
  const ganttRef = useRef(null);

  // frappe-gantt 用にデータをマッピング
  const mapToGanttTasks = () => {
    return tasks.map((item) => {
      // ガントライブラリは日付文字列（YYYY-MM-DD）を期待
      const start = item.plannedStartDate;
      const end = item.plannedEndDate;

      // render 用に進捗％と id, name を渡す
      return {
        id: item.taskId.toString(),
        name: item.title,
        start,
        end,
        progress: item.progress,
        // クラス名を付けて計画/実績の色分けを CSS で行うとよい
        custom_class: 'planned-task',
        // 「実績バー」は frappe-gantt に直接サポートがないため、
        // actual_start と actual_end をカスタムフィールドとして保持
        actual_start: item.actualStartDate,
        actual_end: item.actualEndDate,
      };
    });
  };

  useEffect(() => {
    if (!ganttRef.current) return;

    // 既存の要素をクリア
    ganttRef.current.innerHTML = '';

    // Frappe Gantt インスタンスを生成
    const tasksForGantt = mapToGanttTasks();

    const options = {
      view_mode: mode === 'annual' ? 'Year' : 'Day',
      date_format: 'YYYY-MM-DD',
      custom_popup_html: (task) => {
        // Tooltip 表示内容をカスタマイズ
        return `
          <div class="gantt-popup">
            <strong>${task.name}</strong><br/>
            予定: ${task._start.format('YYYY-MM-DD')} ～ ${task._end.format('YYYY-MM-DD')}<br/>
            実績: ${task.actual_start || '-'} ～ ${task.actual_end || '-'}<br/>
            進捗: ${task.progress}%
          </div>
        `;
      },
    };

    // eslint-disable-next-line no-unused-vars
    const gantt = new Gantt(ganttRef.current, tasksForGantt, options);

    // 実績バーを描画するには小細工が必要（例：DOM を直接操作したり、二重レイヤー）
    // ここでは割愛。必要なら custom_class や CSS で擬似要素を使って重ねる方法を検討。

  }, [tasks, mode, year, month]);

  return (
    <div className="overflow-auto">
      <div
        ref={ganttRef}
        className="gantt-container"
        style={{ minHeight: '400px' }}
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
