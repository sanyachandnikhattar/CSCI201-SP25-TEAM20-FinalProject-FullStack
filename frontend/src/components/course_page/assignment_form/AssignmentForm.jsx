import React, { useState, useEffect } from 'react';
import styles from './assignmentForm.module.css';
import CustomTimePicker from "../../add_assignments/TimePicker";
import CustomDatePicker from "../../add_assignments/DatePicker";
export const AssignmentForm = ({ assignment, onSubmit, onCancel, isAddingNew = false }) => {
    const [formData, setFormData] = useState({
        name: '',
        dueDate: null,
        dueTime: null,
        description: ''
    });

    useEffect(() => {
        if (assignment) {
            setFormData({
                name: assignment.name || '',
                dueDate: assignment.dueDate ? new Date(assignment.dueDate) : null,
                dueTime: assignment.dueTime ? new Date(`1970-01-01T${assignment.dueTime}`) : null,
                description: assignment.description || ''
            });
        }
    }, [assignment]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const output = {
            ...formData,
            dueDate: formData.dueDate?.toISOString().split('T')[0], // format: YYYY-MM-DD
            dueTime: formData.dueTime?.toTimeString().split(' ')[0].slice(0, 5) // format: HH:mm
        };
        onSubmit(output);
    };

    return (
        <form className={styles.assignmentForm} onSubmit={handleSubmit}>
            <h2>{isAddingNew ? 'Add New Assignment' : 'Edit Assignment'}</h2>

            <div className={styles.formGroup}>
                <label htmlFor="name">Assignment Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label>Due Date</label>
                <CustomDatePicker
                    value={formData.dueDate}
                    onChange={(newDate) => setFormData(prev => ({ ...prev, dueDate: newDate }))}
                />
            </div>

            <div className={styles.formGroup}>
                <label>Due Time</label>
                <CustomTimePicker
                    value={formData.dueTime}
                    onChange={(newTime) => setFormData(prev => ({ ...prev, dueTime: newTime }))}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                />
            </div>

            <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                    {isAddingNew ? 'Add Assignment' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
};
