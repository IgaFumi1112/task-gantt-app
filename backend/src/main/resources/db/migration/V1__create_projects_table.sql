-- V1__create_projects_table.sql
CREATE TABLE projects (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description CLOB,
  parent_project_id BIGINT,
  planned_start_date DATE,
  planned_end_date DATE,
  progress INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_parent_project
    FOREIGN KEY (parent_project_id)
    REFERENCES projects(id)
    ON DELETE SET NULL
);
