/*
 * assignmentUI.js - Assignment UI functionality
 * Handles displaying assignment-related UI elements
 */

/**
 * Displays a list of assignments in the UI
 * param {Array} assignments Array of assignment objects
 * param {boolean} isLoggedIn Whether the user is currently logged in
 */
export function displayAssignments(assignments, isLoggedIn) 
{
    const assignmentList = document.getElementById('assignmentList');
    if (!assignmentList) return;
    
    //clear existing content
    assignmentList.innerHTML = '';
    
    if (assignments.length === 0) 
	{
        assignmentList.innerHTML = '<div class="no-assignments">No assignments found for this course.</div>';
        return;
    }
    
    assignments.forEach(assignment => {
        // Create assignment item
        const item = document.createElement('div');
        item.className = 'assignment-item';
        item.dataset.assignmentId = assignment.id;
        
        // Assignment title
        const title = document.createElement('h4');
        title.className = 'assignment-title';
        title.textContent = assignment.title;
        
        // Due date
        const dueDate = document.createElement('div');
        dueDate.className = 'assignment-due-date';
        
        // Format the date
        const date = new Date(assignment.dueDate);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        dueDate.textContent = `Due: ${formattedDate}`;
        
        // View details button
        const viewBtn = document.createElement('button');
        viewBtn.className = 'view-assignment-button';
        viewBtn.textContent = 'View Details';
        viewBtn.addEventListener('click', function() {
            window.location.href = `assignment.html?id=${assignment.id}`;
        });
        
        // Add elements to item
        item.appendChild(title);
        item.appendChild(dueDate);
        item.appendChild(viewBtn);
        
        // Add submission status if applicable
        if (isLoggedIn && assignment.submitted) {
            const status = document.createElement('div');
            status.className = 'submission-status submitted';
            status.innerHTML = '<span class="status-icon">✓</span> Submitted';
            item.appendChild(status);
        } else if (isLoggedIn && !assignment.submitted && isPassedDue(assignment.dueDate)) {
            const status = document.createElement('div');
            status.className = 'submission-status overdue';
            status.innerHTML = '<span class="status-icon">!</span> Overdue';
            item.appendChild(status);
        }
        
        // Add item to assignment list
        assignmentList.appendChild(item);
    });
}

/**
 * Checks if a due date has passed
 * param {string} dueDateStr Due date string
 * returns {boolean} True if the due date has passed
 */
function isPassedDue(dueDateStr) //to show whether assignment overdue or not
{
    const dueDate = new Date(dueDateStr);
    const now = new Date();
    return now > dueDate;
}

/**
 * Displays assignment details in the UI
 * param {Object} assignment The assignment object
 * param {boolean} isLoggedIn Whether the user is currently logged in
 */
export function displayAssignmentDetails(assignment, isLoggedIn) //(kind of like) assignment metadata
{
    const assignmentDetails = document.getElementById('assignmentDetails');
    if (!assignmentDetails) return;
    
    //clear existing content
    assignmentDetails.innerHTML = '';
    
    //create details container
    const container = document.createElement('div');
    container.className = 'assignment-details-container';
    
    //assignment header
    const header = document.createElement('div');
    header.className = 'assignment-header';
    
    const title = document.createElement('h2');
    title.textContent = assignment.title;
    header.appendChild(title);
    
    //due date
    const dueDate = document.createElement('div');
    dueDate.className = 'assignment-due-date';
    
    //format the date
    const date = new Date(assignment.dueDate);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    dueDate.textContent = `Due: ${formattedDate}`;
    header.appendChild(dueDate);
    
    //assignment description
    const description = document.createElement('div');
    description.className = 'assignment-description';
    description.innerHTML = assignment.description; // Using innerHTML to support formatted text
    
    // Add container to assignment details
    assignmentDetails.appendChild(container);
}