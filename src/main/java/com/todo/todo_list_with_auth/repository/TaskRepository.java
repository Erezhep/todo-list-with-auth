package com.todo.todo_list_with_auth.repository;

import com.todo.todo_list_with_auth.model.Task;
import com.todo.todo_list_with_auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);
}
