import api from "./api";

/**
 * [POST] Create a Course
 * @param {string} username
 * TODO: Not Implemented
 */
export function createCourse(username) {
  return api.post("/create-course");
}

/**
 * [GET] Search a Course by Name
 * @param {string} username
 * @param {string} courseName
 * TODO: Not Implemented
 */
export function searchCourseByName(username, courseName) {
  return api.get("/search-course");
}

/**
 * [PATCH] Join a Course
 * @param {string} username
 * @param {string} courseID
 * TODO: Not Implemented
 */
export function joinCourse(username, courseID) {
  return api.patch("/join-course");
}

/**
 * [Patch] Leave a Course
 * @param {string} username
 * @param {string} courseID
 * TODO: Not Implemented
 */
export function leaveCourse(username, courseID) {
  return api.patch("/leave-course");
}

/**
 * [GET] Get Course Info By courseID
 * @param {string} username
 * @param {int} courseID
 * TODO: Not Implemented
 */

export function getCourseInfoById(username, courseID){
  if(courseID === 1){
    return{
      courseID: 1,
      courseName: "CSCI 201",
      days: "T/Th",
      time: "12:30 PM",
    }
  }else if(courseID === 2){
    return{
      courseID: 2,
      courseName: "CSCI 270",
      days: "M/W",
      time: "10:00 AM",
    }
  }
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
