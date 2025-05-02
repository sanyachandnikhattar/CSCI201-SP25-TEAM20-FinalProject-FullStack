/*
 * auth.js - Authentication functionality
 * Handles login, registration, and session management
 */

/**
 * validates the current login state
 * returns True if the user is logged in with a valid session
 */
export function validateLoginState() 
{
    const loginTimestamp = localStorage.getItem("login-timestamp");
    if (!loginTimestamp) 
		{
        //no timestamp, clear login state
        localStorage.removeItem("logged-in");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_email");
        return false;
    }
    
    //check if login has expired (e.g., after 24 hours)
    const now = new Date().getTime();
    const loginTime = parseInt(loginTimestamp);
    const DAY_IN_MS = 24 * 60 * 60 * 1000; // 24 hours
    
    if (now - loginTime > DAY_IN_MS) 
	{
        //login expired, clear state
        localStorage.removeItem("logged-in");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_email");
        localStorage.removeItem("login-timestamp");
        return false;
    }
    
    return true;
}

/**
 * performs user login
 * param {string} email User email
 * param {string} password User password
 * returns {Promise<boolean>} Promise resolving to true if login successful
 */
export function login(email, password) 
{
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
    
    return fetch('api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
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
            // Store login info in localStorage
            localStorage.setItem("logged-in", "true");
            localStorage.setItem("user_id", data.userId);
            localStorage.setItem("user_email", email);
            localStorage.setItem("login-timestamp", new Date().getTime());
            
            return true;
        } else {
            throw new Error(data.message || "Login failed");
        }
    })
    .catch(error => {
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        console.error('Error during login:', error);
        throw error;
    });
}

/**
 * Registers a new user
 * param {Object} userData User data object containing email, password, and name
 * returns {Promise<boolean>} Promise resolving to true if registration successful
 */
export function register(userData) 
{
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
    
    return fetch('api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
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
            throw new Error(data.message || "Registration failed");
        }
    })
    .catch(error => {
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        console.error('Error during registration:', error);
        throw error;
    });
}

/**
 * logs out the current user
 */
export function logout()
{
	//clear local storage
    localStorage.removeItem("logged-in");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
    localStorage.removeItem("login-timestamp");
    
    //optionally call a logout endpoint on the server
    fetch('api/auth/logout',
	{
        method: 'POST'
    }).catch(error => console.error('Error during logout:', error));
    
    return true;
}

/**
 * checks the current authentication status with the server
 * returns {Promise<Object>} Promise resolving to the user data
 */
export function checkAuthStatus() 
{
    return fetch('services/auth/status')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.authenticated) {
                return {
                    isLoggedIn: true,
                    userId: data.userId,
                    userEmail: data.email
                };
            } else {
                // Update local storage to match server state
                logout();
                return {
                    isLoggedIn: false
                };
            }
        })
        .catch(error => {
            console.error('Error checking auth status:', error);
            return {
                isLoggedIn: validateLoginState()
            };
        });
}