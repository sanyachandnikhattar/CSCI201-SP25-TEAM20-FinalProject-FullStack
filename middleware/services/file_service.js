/*
 * fileService.js - File upload/download API functions
 * Handles file-related operations
 */

/**
 * Uploads a file to the server
 * param {File} file The file to upload
 * param {Object} metadata Additional metadata to include with the file
 * returns {Promise<Object>} Promise resolving to the uploaded file info
 */
export function uploadFile(file) 
{
    const userId = localStorage.getItem("user_id");
    
    if (!userId) {
        return Promise.reject(new Error("You must be logged in to upload files"));
    }
    
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
    
    // Create form data for file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    
    
    return fetch('api/files/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(fileInfo => {
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        return fileInfo;
    })
    .catch(error => {
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        console.error('Error uploading file:', error);
        throw error;
    });
}

/**
 * Downloads a file from the server
 * param {number} fileId The ID of the file to download
 */
export function downloadFile(fileId) 
{
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
    
    //create a direct download link for the file
    const downloadUrl = `api/files/${fileId}`;
    
    //use a hidden iframe to trigger the download without navigating away
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = downloadUrl;
    document.body.appendChild(iframe);
    
    //clean up after a short delay (2000 ms)
    setTimeout(() => 
		{
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        document.body.removeChild(iframe);
    }, 2000);
}

/**
 * Gets metadata for a file
 * param {number} fileId The ID of the file
 * returns {Promise<Object>} Promise resolving to the file metadata
 */
/*export function getFileMetadata(fileId) 
{
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
    
    return fetch(`api/files/${fileId}/metadata`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(metadata => {
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            return metadata;
        })
        .catch(error => {
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            console.error(`Error fetching metadata for file ID ${fileId}:`, error);
            throw error;
        });
}*/

/**
 * Gets all files for a course
 * param {number} courseId The ID of the course
 * returns {Promise<Array>} Promise resolving to an array of file objects
 */
export function getCourseFiles(courseId) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
    
    return fetch(`api/courses/${courseId}/files`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(files => {
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            return files;
        })
        .catch(error => {
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            console.error(`Error fetching files for course ID ${courseId}:`, error);
            throw error;
        });
}

/**
 * Gets all files for an assignment
 * param {number} assignmentId The ID of the assignment
 * returns {Promise<Array>} Promise resolving to an array of file objects
 */
export function getAssignmentFiles(assignmentId) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
    
    return fetch(`api/assignments/${assignmentId}/files`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(files => {
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            return files;
        })
        .catch(error => {
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            console.error(`Error fetching files for assignment ID ${assignmentId}:`, error);
            throw error;
        });
}