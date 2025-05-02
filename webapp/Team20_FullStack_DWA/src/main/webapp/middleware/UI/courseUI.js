/*
 * courseUI.js - Course UI functionality
 * Handles displaying course-related UI elements
 */

import { joinCourse } from '../../services/course_service.js';

/**
 * Displays a list of courses in the UI
 * param {Array} courses Array of course objects
 * param {boolean} isLoggedIn Whether the user is currently logged in
 */
export function displayCourses(courses, isLoggedIn) {
    const courseList = document.getElementById('courseList');
    if (!courseList) return;
    
    // Clear existing content
    courseList.innerHTML = '';
    
    if (courses.length === 0) {
        courseList.innerHTML = '<div class="no-results">No courses found.</div>';
        return;
    }
    
    courses.forEach(course => {
        // Create course card
        const card = document.createElement('div');
        card.className = 'course-card';
        card.dataset.courseId = course.id;
        
        // Course name
        const name = document.createElement('h3');
        name.className = 'course-name';
        name.textContent = course.name;
        
        // Course description (truncated)
        const desc = document.createElement('p');
        desc.className = 'course-description';
        desc.textContent = course.description.length > 100 
            ? course.description.substring(0, 100) + '...' 
            : course.description;
        
        // Button container
        const btnContainer = document.createElement('div');
        btnContainer.className = 'course-buttons';
        
        // Details button
        const detailsBtn = document.createElement('button');
        detailsBtn.className = 'details-button';
        detailsBtn.textContent = 'View Details';
        detailsBtn.addEventListener('click', function() {
            window.location.href = `course.html?id=${course.id}`;
        });
        
        // Join button (only if user is logged in)
        if (isLoggedIn) {
            const joinBtn = document.createElement('button');
            joinBtn.className = 'join-button';
            joinBtn.textContent = 'Join Course';
            joinBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent card click
                handleJoinCourse(course.id);
            });
            btnContainer.appendChild(joinBtn);
        }
        
        // Add elements to card
        btnContainer.appendChild(detailsBtn);
        card.appendChild(name);
        card.appendChild(desc);
        card.appendChild(btnContainer);
        
        // Add card to course list
        courseList.appendChild(card);
    });
}

/**
 * Handler for joining a course
 * param {number} courseId The ID of the course to join
 */
function handleJoinCourse(courseId) {
    joinCourse(courseId)
        .then(success => {
            if (success) {
                alert("Successfully joined the course!");
                // Redirect to course details page
                window.location.href = `course.html?id=${courseId}`;
            }
        })
        .catch(error => {
            alert(error.message || "Failed to join course. Please try again.");
        });
}

/**
 * Displays course details in the UI
 * param {Object} course The course object
 * param {boolean} isLoggedIn Whether the user is currently logged in
 */
export function displayCourseDetails(course, isLoggedIn) {
    const courseDetails = document.getElementById('courseDetails');
    if (!courseDetails) return;
    
    //clear / flush existing content
    courseDetails.innerHTML = '';
    
    //create details container
    const container = document.createElement('div');
    container.className = 'course-details-container';
    
    //course header
    const header = document.createElement('div');
    header.className = 'course-header';
    
    const title = document.createElement('h2');
    title.textContent = course.name;
    header.appendChild(title);
    
    //course info
    const info = document.createElement('div');
    info.className = 'course-info';
    
    const description = document.createElement('p');
    description.className = 'course-description';
    description.textContent = course.description;
    info.appendChild(description);
    
    //check if user is enrolled
    if (isLoggedIn) 
	{
        const enrollmentStatus = document.createElement('div');
        enrollmentStatus.className = 'enrollment-status';
        
        if (course.enrolled) {
            enrollmentStatus.innerHTML = '<span class="enrolled">✓ Enrolled</span>';
        } else {
            const joinBtn = document.createElement('button');
            joinBtn.className = 'join-button';
            joinBtn.textContent = 'Join Course';
            joinBtn.addEventListener('click', function() {
                handleJoinCourse(course.id);
            });
            enrollmentStatus.appendChild(joinBtn);
        }
        
        info.appendChild(enrollmentStatus);
    }
    
    //add elements to container
    container.appendChild(header);
    container.appendChild(info);
    
    //assignments section (will be populated separately)
    const assignmentsSection = document.createElement('div');
    assignmentsSection.className = 'assignments-section';
    assignmentsSection.innerHTML = '<h3>Assignments</h3>';
    
    //create assignments list container
    const assignmentsList = document.createElement('div');
    assignmentsList.id = 'assignmentList';
    assignmentsList.className = 'assignments-list';
    assignmentsSection.appendChild(assignmentsList);
    
    container.appendChild(assignmentsSection);
    
    //add container to course details
    courseDetails.appendChild(container);
}

/**
 * Updates UI elements based on authentication state
 * @param {boolean} isLoggedIn Whether the user is currently logged in
 * @param {string} userEmail Email of the logged-in user (if any)
 */
export function updateUIForAuthState(isLoggedIn, userEmail) {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const dashboardBtn = document.getElementById('dashboardBtn');
    const welcomeMessage = document.getElementById('welcomeMessage');
    
    if (isLoggedIn) 
	{
        //hide login/register buttons
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        
        //show logout and dashboard buttons
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (dashboardBtn) dashboardBtn.style.display = 'block';
        
        //update welcome message if it exists
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome, ${userEmail}!`;
            welcomeMessage.style.display = 'block';
        }
        
        //add user-specific classes to body
        document.body.classList.add('logged-in');
        document.body.classList.remove('logged-out');
    } 
	
	else 
	{
        //show login/register buttons
        if (loginBtn) loginBtn.style.display = 'block';
        if (registerBtn) registerBtn.style.display = 'block';
        
        //hide logout and dashboard buttons
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (dashboardBtn) dashboardBtn.style.display = 'none';
        
        //hide welcome message
        if (welcomeMessage) {
            welcomeMessage.style.display = 'none';
        }
        
        //add logged-out class to body
        document.body.classList.add('logged-out');
        document.body.classList.remove('logged-in');
    }
    
    //update any UI elements that should be visible/hidden based on login status
    const loggedInOnlyElements = document.querySelectorAll('.logged-in-only');
    const loggedOutOnlyElements = document.querySelectorAll('.logged-out-only');
    
    loggedInOnlyElements.forEach(elem => {
        elem.style.display = isLoggedIn ? '' : 'none';
    });
    
    loggedOutOnlyElements.forEach(elem => {
        elem.style.display = isLoggedIn ? 'none' : '';
    });
}