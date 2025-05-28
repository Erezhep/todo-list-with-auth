package com.todo.todo_list_with_auth.repository;

import com.todo.todo_list_with_auth.model.Task;
import com.todo.todo_list_with_auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);
    List<Task> findByUserAndDueDate(User user, LocalDate dueDate);
    @Query("SELECT t FROM Task t WHERE t.user = :user AND t.dueDate > :dueDate")
    List<Task> findByUserAndDueDateAfter(@Param("user") User user, @Param("dueDate") LocalDate dueDate);
}