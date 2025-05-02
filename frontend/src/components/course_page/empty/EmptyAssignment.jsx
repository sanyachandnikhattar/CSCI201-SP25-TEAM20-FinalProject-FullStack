import React from 'react';
import noData from "../../../assets/no-data.svg";
import emptyImage from "../../../assets/empty-image.svg"
import styles from "./EmptyAssignment.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBook,
    faEdit, faTrash, faXmark, faXmarkCircle, faBookmark, faClock, faMagnifyingGlass
} from "@fortawesome/free-solid-svg-icons";


export const EmptyAssignment = ({ period }) => {
    if(period === "today"){
        return (
            <div className={styles.emptyAssignment}>
                No Assignments due Today!
                <img src={noData}/>
            </div>
        );
    }else if(period === "upcoming"){
        return (
            <div className={styles.emptyAssignment}>
                No Upcoming Dues
                <img src={emptyImage}/>
            </div>
        )
    }

};