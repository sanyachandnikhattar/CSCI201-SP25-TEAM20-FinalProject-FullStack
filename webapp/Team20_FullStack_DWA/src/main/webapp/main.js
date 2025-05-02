/*
 * main.js - Entry point for CSCI 201 Team20 Final Project
 * Initializes the app and handles page-specific functionality
 */

// Import modules
import { validateLoginState, login, register, logout } from './auth.js';
import { getAllCourses, getCourseById, searchCourses, joinCourse } from './api/courseService.js';
import { getAssignmentsForCourse, getAssignmentDetails, submitAssignment } from './api/assignmentService.js';
import { displayCourses, displayCourseDetails, updateUIForAuthState } from './ui/courseUI.js';
import { displayAssignments, displayAssignmentDetails } from './ui/assignmentUI.js';

document.addEventListener('DOMContentLoaded', function() {
    // Event listeners for navigation buttons
    const navButtons = document.querySelectorAll('nav button');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            if (target) {
                window.location.href = target + '.html';
            }
        });
    });

    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem("logged-in") === "true" && validateLoginState();
    const userId = isLoggedIn ? localStorage.getItem("user_id") : null;
    const userEmail = isLoggedIn ? localStorage.getItem("user_email") : null;

    // Update UI based on login state
    updateUIForAuthState(isLoggedIn, userEmail);

    // Element references
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    // Add event listeners for search
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function() {
            performSearch();
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Search function
    function performSearch() {
        const query = searchInput.value.trim();
        
        if (!query) {
            alert("Please enter a search term");
            return;
        }
        
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'block';
        }
        
        // Clear previous results
        const courseList = document.getElementById('courseList');
        if (courseList) {
            courseList.innerHTML = '';
        }
        
        // Call search API and update UI
        searchCourses(query)
            .then(courses => {
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                }
                displayCourses(courses, isLoggedIn);
            })
            .catch(error => {
                console.error('Error searching courses:', error);
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                }
                if (courseList) {
                    courseList.innerHTML = '<div class="error-message">Search failed. Please try again.</div>';
                }
            });
    }

    // ========== Form Event Listeners ==========
    
    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            login(email, password)
                .then(success => {
                    if (success) {
                        window.location.href = 'index.html';
                    }
                })
                .catch(error => {
                    console.error('Login error:', error);
                    const errorElement = document.getElementById('loginError');
                    if (errorElement) {
                        errorElement.textContent = error.message || "Login failed. Please try again.";
                        errorElement.style.display = 'block';
                    } else {
                        alert("Login failed. Please try again.");
                    }
                });
        });
    }
    
    // Register form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userData = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                name: document.getElementById('name').value
            };
            
            // Check password confirmation if it exists
            const confirmPassword = document.getElementById('confirmPassword');
            if (confirmPassword && confirmPassword.value !== userData.password) {
                alert("Passwords do not match");
                return;
            }
            
            register(userData)
                .then(success => {
                    if (success) {
                        alert("Registration successful! Please log in.");
                        window.location.href = 'login.html';
                    }
                })
                .catch(error => {
                    console.error('Registration error:', error);
                    const errorElement = document.getElementById('registerError');
                    if (errorElement) {
                        errorElement.textContent = error.message || "Registration failed. Please try again.";
                        errorElement.style.display = 'block';
                    } else {
                        alert("Registration failed. Please try again.");
                    }
                });
        });
    }
    
    // Logout button handler
    const logoutButton = document.getElementById('logoutBtn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            logout();
            window.location.href = 'index.html';
        });
    }

    // Assignment submission form handler
    const assignmentForm = document.getElementById('assignmentSubmissionForm');
    if (assignmentForm) {
        assignmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fileInput = document.getElementById('assignmentFile');
            const file = fileInput.files[0];
            if (!file) {
                alert('Please select a file to upload');
                return;
            }
            
            const urlParams = new URLSearchParams(window.location.search);
            const assignmentId = urlParams.get('id');
            if (!assignmentId) {
                alert('Invalid assignment ID');
                return;
            }
            
            const commentInput = document.getElementById('submissionComment');
            const formData = new FormData();
            formData.append('file', file);
            formData.append('comment', commentInput ? commentInput.value : '');
            formData.append('userId', userId);
            
            submitAssignment(assignmentId, formData)
                .then(success => {
                    if (success) {
                        alert("Assignment submitted successfully!");
                        getAssignmentDetails(assignmentId)
                            .then(assignment => {
                                displayAssignmentDetails(assignment, isLoggedIn);
                            });
                    }
                })
                .catch(error => {
                    console.error('Error submitting assignment:', error);
                    alert("Failed to submit assignment. Please try again.");
                });
        });
    }

    // ========== Page-specific Initialization ==========
    
    // Check current page to determine which data to load
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage === 'index.html' || currentPage === '') {
        // Home page - load courses
        getAllCourses()
            .then(courses => {
                displayCourses(courses, isLoggedIn);
            })
            .catch(error => {
                console.error('Error loading courses:', error);
                const courseList = document.getElementById('courseList');
                if (courseList) {
                    courseList.innerHTML = '<div class="error-message">Failed to load courses. Please try again.</div>';
                }
            });
    } else if (currentPage === 'course.html') {
        // Course details page - load course by ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get('id');
        
        if (courseId) {
            getCourseById(courseId)
                .then(course => {
                    displayCourseDetails(course, isLoggedIn);
                    
                    // Also fetch assignments for this course
                    return getAssignmentsForCourse(courseId);
                })
                .then(assignments => {
                    displayAssignments(assignments, isLoggedIn);
                })
                .catch(error => {
                    console.error('Error loading course details:', error);
                    const courseDetails = document.getElementById('courseDetails');
                    if (courseDetails) {
                        courseDetails.innerHTML = '<div class="error-message">Failed to load course details. Please try again.</div>';
                    }
                });
        } else {
            // No course ID provided, redirect to home
            window.location.href = 'index.html';
        }
    } else if (currentPage === 'assignment.html') {
        // Assignment details page - load assignment by ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const assignmentId = urlParams.get('id');
        
        if (assignmentId) {
            getAssignmentDetails(assignmentId)
                .then(assignment => {
                    displayAssignmentDetails(assignment, isLoggedIn);
                })
                .catch(error => {
                    console.error('Error loading assignment details:', error);
                    const assignmentDetails = document.getElementById('assignmentDetails');
                    if (assignmentDetails) {
                        assignmentDetails.innerHTML = '<div class="error-message">Failed to load assignment details. Please try again.</div>';
                    }
                });
        } else {
            // No assignment ID provided, redirect to home
            window.location.href = 'index.html';
        }
    }
});