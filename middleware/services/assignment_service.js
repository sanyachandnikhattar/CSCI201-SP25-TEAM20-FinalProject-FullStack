/*
 * assignmentService.js - Assignment-related API functions
 * Handles fetching and submitting assignments
 */

/**
 * Fetches all assignments for a specific course
 * @param {number} courseId The ID of the course
 * @returns {Promise<Array>} Promise resolving to an array of assignment objects
 */
export function getAssignmentsForCourse(courseId) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }

    return fetch(`api/courses/${courseId}/assignments`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(assignments => {
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            return assignments;
        })
        .catch(error => {
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            console.error(`Error fetching assignments for course ID ${courseId}:`, error);
            throw error;
        });
}

/**
 * Fetches details of a specific assignment
 * @param {number} assignmentId The ID of the assignment
 * @returns {Promise<Object>} Promise resolving to the assignment object
 */
export function getAssignmentDetails(assignmentId) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }

    return fetch(`api/assignments/${assignmentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(assignment => {
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            return assignment;
        })
        .catch(error => {
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            console.error(`Error fetching assignment ID ${assignmentId}:`, error);
            throw error;
        });
}

/**
 * Submits an assignment
 * @param {number} assignmentId The ID of the assignment
 * @param {FormData} formData The submission data (file and comments)
 * @returns {Promise<boolean>} Promise resolving to true if submission successful
 */
export function submitAssignment(assignmentId, formData) {
    const userId = localStorage.getItem("user_id");
    
    if (!userId) {
        return Promise.reject(new Error("You must be logged in to submit an assignment"));
    }
    
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
    
    // Make sure userId is included in form data
    if (!formData.has('userId')) {
        formData.append('userId', userId);
    }
    
    return fetch(`api/assignments/${assignmentId}/submit`, {
        method: 'POST',
        body: formData // FormData handles content-type automatically
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        if (data.success) {
            return true;
        } else {
            throw new Error(data.message || "Failed to submit assignment");
        }
    })
    .catch(error => {
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        console.error(`Error submitting assignment ID ${assignmentId}:`, error);
        throw error;
    });
}

/**
 * Creates a new assignment for a course (instructor only)
 * @param {number} courseId The ID of the course
 * @param {Object} assignmentData The assignment data
 * @returns {Promise<Object>} Promise resolving to the created assignment
 */
export function createAssignment(courseId, assignmentData) {
    const userId = localStorage.getItem("user_id");
    
    if (!userId) {
        return Promise.reject(new Error("You must be logged in to create an assignment"));
    }
    
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
    
    return fetch(`api/courses/${courseId}/assignments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(assignmentData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(assignment => {
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        return assignment;
    })
    .catch(error => {
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        console.error(`Error creating assignment for course ID ${courseId}:`, error);
        throw error;
    });
}

/**
 * Gets all submitted assignments for a user
 * @returns {Promise<Array>} Promise resolving to an array of submission objects
 */
export function getUserSubmissions() {
    const userId = localStorage.getItem("user_id");
    
    if (!userId) {
        return Promise.reject(new Error("You must be logged in to view submissions"));
    }
    
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
    
    return fetch(`api/users/${userId}/submissions`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(submissions => {
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            return submissions;
        })
        .catch(error => {
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            console.error('Error fetching user submissions:', error);
            throw error;
        });
}