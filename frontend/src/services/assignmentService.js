import api from "./api"


/**
 * [POST] Create Assignment
 * @param {string} username
 * @param {object} assignmentData
 * TODO: Not Implemented
 */
export function createAssignment(username, assignmentData){
    return api.post("/api/assignments?action=create");
}


/**
 * [GET] Create Assignment
 * @param {string} username
 * @param {string} assignmentName
 * TODO: Not Implemented
 */
export function searchAssignmentByName(username, assignmentName){
    return api.get("/search-assignment");
}

/**
 * [PATCH] Mark Complete Assignment
 * @param {string} username
 * @param {string} assignmentID
 * TODO: Not Implemented
 */
export function markCompleteAssignment(username, assignmentID){
    return api.patch("/mark-complete-assignment");
}


/**
 * [Patch] Edit Assignment
 * @param {string} username
 * @param {string} assignmentID
 * @param {object} assignmentData
 * TODO: Not Implemented
 */
export function editAssignmentInfo(username, assignmentID, assignmentData){
    return api.post("/api/assignments?action=edit");
}

/**
 * [DELETE] Remove Assignment
 * @param {string} username
 * @param {string} assignmentID
 * TODO: Not Implemented
 */
export function removeAssignment(username, assignmentID){
    return api.delete("/remove-assignment");
}