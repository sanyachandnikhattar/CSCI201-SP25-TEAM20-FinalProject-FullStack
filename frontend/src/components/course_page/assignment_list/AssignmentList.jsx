import React from 'react';
import styles from './AssignmentList.module.css';
import { AssignmentItem } from '../assignmentItem/AssignmentItem';

export const AssignmentList = ({ assignments, onEditAssignment, onRemoveAssignment }) => {
  return (
    <div className={styles.assignments}>
      {assignments.map((assignment, index) => (
        <AssignmentItem
          key={index}
          name={assignment.name}
          dueDate={assignment.dueDate}
          dueTime={assignment.dueTime}
          description={assignment.description}
          onEdit={(data) => onEditAssignment(index, data)}
          onRemove={() => onRemoveAssignment(index)}
        />
      ))}
    </div>
  );
};