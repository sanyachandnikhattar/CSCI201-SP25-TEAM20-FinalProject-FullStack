import React from 'react';
import styles from './AssignmentBoard.module.css';
import { AssignmentCard } from '../assignmentItem/AssignmentCard';

export const AssignmentBoard = ({ assignments, onEditAssignment, onRemoveAssignment }) => {
    return (
        <div className={styles.assignments}>
            {assignments.map((assignment, index) => (
                <AssignmentCard
                    key={index}
                    number={index}
                    name={assignment.assignmentName}
                    dueDate={assignment.dueDate}
                    dueTime={assignment.dueTime}
                    description={assignment.desc}
                    onEdit={(data) => onEditAssignment(index, data)}
                    onRemove={() => onRemoveAssignment(assignment)}
                />
            ))}
        </div>
    );
};