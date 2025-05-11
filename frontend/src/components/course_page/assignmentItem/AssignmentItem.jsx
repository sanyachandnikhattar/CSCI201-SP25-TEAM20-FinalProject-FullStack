import React from 'react';
import styles from './AssignmenItem.module.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBook,
  faEdit, faTrash, faXmark, faXmarkCircle, faBookmark, faClock
} from "@fortawesome/free-solid-svg-icons";

export const AssignmentItem = ({ name, dueDate, dueTime, description, onEdit, onRemove }) => {
  const isLoggedIn = Boolean(localStorage.getItem("email"));

  return (
    <div className={styles.assignment}>
        {/*<input type="checkbox" className={styles.assignmentCheckbox} />*/}


      <div className={styles.assignmentInfo}>
        <FontAwesomeIcon className={styles.bookmark} icon={faBookmark}/>
        <div className={styles.assignmentHeader}>
          <div className={styles.assignmentName}>
            {name}
          </div>
          <div className={styles.dueDate}>

            Due {dueDate}
            <div className={styles.dueTime}>
              <FontAwesomeIcon className={styles.clock} icon={faClock}/>
              {dueTime}
            </div>
          </div>
        </div>

        <div className={styles.description}>
          {description}
        </div>
      </div>
      {isLoggedIn && (
      <div className={styles.assignmentActions}>
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

      </div>)}
    </div>
  );
};