package com.example.task_gantt_app_backend.repository;

import com.example.task_gantt_app_backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // 特定のプロジェクトに紐づくタスク一覧を取得するメソッドを定義
    List<Task> findByProjectId(Long projectId);
}
