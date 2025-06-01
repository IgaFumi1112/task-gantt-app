package com.example.task_gantt_app_backend.repository;

import com.example.task_gantt_app_backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    // ここにカスタムクエリメソッドを追加することも可能
    // 例：List<Project> findByNameContaining(String keyword);
}
