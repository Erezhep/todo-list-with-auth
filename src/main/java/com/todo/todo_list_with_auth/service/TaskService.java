package com.todo.todo_list_with_auth.service;

import com.todo.todo_list_with_auth.model.Task;
import com.todo.todo_list_with_auth.model.User;
import com.todo.todo_list_with_auth.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public List<Task> getTasksForUser(User user) {
        return taskRepository.findByUser(user);
    }

    public List<Task> getTasksByUserAndDueDate(User user, LocalDate dueDate) {
        return taskRepository.findByUserAndDueDate(user, dueDate);
    }

    public List<Task> getTasksByUserAndDueDateAfter(User user, LocalDate dueDate) {
        return taskRepository.findByUserAndDueDateAfter(user, dueDate);
    }

    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }

    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElse(null);
    }
}