import React from 'react';
import styles from './AssignmentCard.module.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBook,
    faEdit, faTrash, faXmark, faXmarkCircle, faBookmark, faClock
} from "@fortawesome/free-solid-svg-icons";

export const AssignmentCard = ({ number, name, dueDate, dueTime,description, onEdit, onRemove }) => {
    return (
        <div className={styles.assignment}>
            {/*<input type="checkbox" className={styles.assignmentCheckbox} />*/}
            <div className={styles.cardHeader}>
                <div className={styles.number}>
                    {number+1}
                </div>
                <div className={styles.buttons}>
                    <button
                        className={styles.editButton}
                        onClick={() => onEdit({name, dueDate, description})}
                    >
                        <FontAwesomeIcon className={styles.editButton} icon={faEdit}/>
                    </button>
                    <button
                        className={styles.removeButton}
                        onClick={() => onRemove({name})}
                    >
                        <FontAwesomeIcon className={styles.deleteButton} icon={faXmark}/>

                    </button>
                </div>
            </div>
            <div className={styles.assignmentName}>
                {name}
            </div>
            <div className={description}>
                {description}
            </div>
            <div className={styles.dueTime}>
                <div className={styles.timeInfo}>
                    {"Due"}
                    <FontAwesomeIcon className={styles.clock} icon={faClock}/>
                    {dueTime}
                </div>
            </div>
        </div>
    );
};