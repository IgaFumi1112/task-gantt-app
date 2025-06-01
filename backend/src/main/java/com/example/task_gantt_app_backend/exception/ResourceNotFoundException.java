package com.example.task_gantt_app_backend.exception;

/**
 * リソース（Project や Task）が見つからない場合にスローするカスタム例外
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
