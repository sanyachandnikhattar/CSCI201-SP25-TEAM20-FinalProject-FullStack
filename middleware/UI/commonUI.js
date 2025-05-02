/*
 * commonUI.js - common UI features for each page
 * Shared UI functions used across the application
 */

/**
 * Shows a loading spinner
 */
export function showLoading(containerId = null) {
    // If a specific container is provided, show loading there
    if (containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            // Create loading element if it doesn't exist
            let loadingElement = container.querySelector('.loading-spinner');
            if (!loadingElement) {
                loadingElement = document.createElement('div');
                loadingElement.className = 'loading-spinner';
                loadingElement.innerHTML = '<div class="spinner"></div>';
                container.appendChild(loadingElement);
            }
            loadingElement.style.display = 'flex';
        }
    } else {
        // Use global loading element
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'block';
        }
    }
}

/**
 * Hides the loading spinner
 */
export function hideLoading(containerId = null) 
{
    // If a specific container is provided, hide loading there
    if (containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            const loadingElement = container.querySelector('.loading-spinner');
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
        }
    } else {
        // Hide global loading element
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
}

/**
 * Shows a notification message
 */
export function showNotification(message, type = 'info', duration = 3000) 
{
    //get or create notifications container
    let notificationsContainer = document.getElementById('notifications');
    if (!notificationsContainer) {
        notificationsContainer = document.createElement('div');
        notificationsContainer.id = 'notifications';
        notificationsContainer.className = 'notifications-container';
        document.body.appendChild(notificationsContainer);
    }
  
    //create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    //add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', function() {
        notification.classList.add('hiding');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
    
    //add message
    const messageElement = document.createElement('div');
    messageElement.className = 'notification-message';
    messageElement.textContent = message;
    
    //add elements to notification
    notification.appendChild(closeBtn);
    notification.appendChild(messageElement);
    
    //add notification to container
    notificationsContainer.appendChild(notification);
    
    //add animation class after a small delay (for animation to work)
    setTimeout(() => {
        notification.classList.add('visible');
    }, 10);
    
    //auto-hide if duration is provided
    if (duration > 0) 
	{
        setTimeout(() => 
			{
            notification.classList.add('hiding');
            setTimeout(() => 
			{
                if (notification.parentNode) 
				{
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
    
    return notification;
}

/**
 * Shows a confirmation dialog
 * @param {string} message Message to display
 * @param {Function} onConfirm Callback function when confirmed
 * @param {Function} onCancel Callback function when canceled (optional)
 */
export function showConfirmation(message, onConfirm, onCancel = null) 
{
    // create overlay
    const overlay = document.createElement('div');
}