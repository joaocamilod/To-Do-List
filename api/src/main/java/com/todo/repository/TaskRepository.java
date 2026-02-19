package com.todo.repository;

import com.todo.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserIdOrderByPositionAscCreatedAtDesc(Long userId);

    List<Task> findByUserIdAndListIdOrderByPositionAscCreatedAtDesc(Long userId, Long listId);

    List<Task> findByUserIdAndListIdIsNullOrderByPositionAscCreatedAtDesc(Long userId);

    List<Task> findByUserIdAndCompletedOrderByPositionAscCreatedAtDesc(Long userId, boolean completed);

    List<Task> findByUserIdAndMyDayTrueOrderByPositionAscCreatedAtDesc(Long userId);

    List<Task> findByUserIdAndDueDateIsNotNullAndDueDateAfterOrderByDueDateAsc(Long userId, LocalDateTime after);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND " +
           "(LOWER(t.title) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           " LOWER(t.description) LIKE LOWER(CONCAT('%', :q, '%')))")
    List<Task> searchByUserIdAndQuery(@Param("userId") Long userId, @Param("q") String query);

    Optional<Task> findByIdAndUserId(Long id, Long userId);

    boolean existsByIdAndUserId(Long id, Long userId);
}
