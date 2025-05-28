package com.todo.todo_list_with_auth.controller;

import com.todo.todo_list_with_auth.model.Task;
import com.todo.todo_list_with_auth.model.User;
import com.todo.todo_list_with_auth.service.TaskService;
import com.todo.todo_list_with_auth.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Controller
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserService userService;

    @GetMapping
    public String listTasks(@AuthenticationPrincipal UserDetails currentUser, Model model) {
        User user = userService.findByUsername(currentUser.getUsername());
        List<Task> tasks = taskService.getTasksForUser(user);
        model.addAttribute("tasks", tasks);
        model.addAttribute("newTask", new Task());
        return "tasks";
    }

    @PostMapping
    public String addTask(@AuthenticationPrincipal UserDetails currentUser, @ModelAttribute Task newTask) {
        User user = userService.findByUsername(currentUser.getUsername());
        newTask.setUser(user);
        taskService.saveTask(newTask);
        return "redirect:/tasks";
    }

    @PostMapping("/complete/{id}")
    public String completeTask(@PathVariable Long id) {
        Task task = taskService.getTaskById(id);
        if (task != null) {
            task.setCompleted(true);
            taskService.saveTask(task);
        }
        return "redirect:/tasks";
    }

    @PostMapping("/delete/{id}")
    public String deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return "redirect:/tasks";
    }

    @PostMapping("/by-date")
    @ResponseBody
    public List<Task> getTasksByDate(@AuthenticationPrincipal UserDetails currentUser, @RequestParam String dueDate) {
        User user = userService.findByUsername(currentUser.getUsername());
        LocalDate date = LocalDate.parse(dueDate);
        return taskService.getTasksByUserAndDueDate(user, date);
    }

    @GetMapping("/all")
    @ResponseBody
    public List<Task> getAllTasks(@AuthenticationPrincipal UserDetails currentUser) {
        User user = userService.findByUsername(currentUser.getUsername());
        return taskService.getTasksForUser(user);
    }

    @GetMapping("/upcoming")
    @ResponseBody
    public List<Task> getUpcomingTasks(@AuthenticationPrincipal UserDetails currentUser) {
        User user = userService.findByUsername(currentUser.getUsername());
        LocalDate today = LocalDate.now();
        return taskService.getTasksByUserAndDueDateAfter(user, today);
    }
}