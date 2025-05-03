import api from "./api";

export function uploadCourse(payload) {
  return api.post("/CourseServlet?action=create", payload);
}


/**
 * [GET] Search a Course by Name
 * @param {string} username
 * @param {string} courseName
 * TODO: Not Implemented
 */
export function searchCourseByName(courseName) {
  return api.get(`/SearchServlet?query=${courseName}`);
}

export function joinCourse(courseID) {
  const userID = localStorage.getItem("user_id");
  return api.post("/UserCourseServlet?action=join",
      null,
      { params: { userID, courseID } });
}

export function leaveCourse(courseID) {
  const userID = localStorage.getItem("user_id");
  return api.post("/UserCourseServlet?action=leave",
      null,
      { params: { userID, courseID } });
}

/**
 * [GET] Get Course Info By courseID
 * @param {string} username
 * @param {int} courseID
 * TODO: Not Implemented
 */

export function getCourseInfoById(courseID){
    return api.get(`/CourseInfoServlet?courseID=${courseID}`);
}

export function isEnrolled(userID, courseID) {
  return api.get(`/CourseEnrolledServlet?userID=${userID}&courseID=${courseID}`);
}


/**
 * [Patch] Get all assignments of a course
 * @param {string} username
 * @param {string} courseID
 * TODO: Not Implemented
 */
export function getCourseAssignmentsById(courseID) {
  return api.get(`/AssignmentServlet?courseID=${courseID}`);
  // if(courseID === "1")
  // return {
  //   assignments: [
  //     {
  //       assignmentID: 101,
  //       name: "Lab 4",
  //       dueDate: "2025-05-2",
  //       dueTime: "11:59 PM",
  //       description: "Complete the multithreading exercise",
  //     },
  //     {
  //       assignmentID: 102,
  //       name: "Quiz",
  //       dueDate: "2025-05-2",
  //       dueTime: "10:00 AM",
  //       description: "Midterm quiz on Java concurrency",
  //     },
  //     {
  //       assignmentID: 101,
  //       name: "Lab 5",
  //       dueDate: "2025-05-12",
  //       dueTime: "11:59 PM",
  //       description: "Complete the multithreading exercise",
  //     },
  //     {
  //       assignmentID: 102,
  //       name: "Quiz2",
  //       dueDate: "2025-05-13",
  //       dueTime: "10:00 AM",
  //       description: "Midterm quiz on Java concurrency",
  //     },
  //   ],
  // }
  // else return {assignments:[]}
}

/**
 * [GET] Get all user's courses
 * @param {string} user_id
 * TODO: Not Implemented
 */
export function getAllCourses(user_id) {
  return api.get(`/CourseServlet?user_id=${user_id}`);
}
