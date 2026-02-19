package com.todo.repository;

import com.todo.model.Subtask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubtaskRepository extends JpaRepository<Subtask, Long> {
    List<Subtask> findByTaskIdOrderByCreatedAtAsc(Long taskId);
    Optional<Subtask> findByIdAndTaskId(Long id, Long taskId);
    void deleteByTaskId(Long taskId);
}
