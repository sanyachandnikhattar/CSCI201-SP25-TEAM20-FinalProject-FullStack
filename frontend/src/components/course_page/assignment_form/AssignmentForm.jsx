import React, { useState, useEffect } from 'react';
import dayjs from "dayjs";
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
    const [errors, setErrors] = useState({
        dueDate: '',
        dueTime: ''
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
        const newErrors = {
            dueDate: formData.dueDate ? '' : 'Due date is required',
            dueTime: formData.dueTime ? '' : 'Due time is required'
        };

        setErrors(newErrors);

        if (!formData.dueDate || !formData.dueTime) return;

        const output = {
            ...formData,
            dueDate: dayjs(formData.dueDate).format("YYYY-MM-DD"),
            dueTime: formData.dueTime.toTimeString().split(' ')[0].slice(0, 5)
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
                    maxLength={100}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label>Due Date</label>
                <CustomDatePicker
                    value={formData.dueDate}
                    onChange={(newDate) => {
                        setFormData(prev => ({...prev, dueDate: newDate}));
                        setErrors(prev => ({...prev, dueDate: ''}));
                    }}
                    error={!!errors.dueDate}
                />
                {errors.dueDate && <div className={styles.inputError}>{errors.dueDate}</div>}
            </div>

            <div className={styles.formGroup}>
                <label>Due Time</label>
                <CustomTimePicker
                    value={formData.dueTime}
                    onChange={(newTime) => {
                        setFormData(prev => ({...prev, dueTime: newTime}));
                        setErrors(prev => ({...prev, dueTime: ''}));
                    }}
                    error={!!errors.dueTime}
                />
                {errors.dueTime && <div className={styles.inputError}>{errors.dueTime}</div>}
            </div>


            <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={100}
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
