import {Link} from "react-router-dom";
import {EmptyAssignment} from "../../components/course_page/empty/EmptyAssignment";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createAssignment, markCompleteAssignment, editAssignmentInfo, removeAssignment} from "../../services/assignmentService";
import { getCourseAssignmentsById, getCourseInfoById, isEnrolled, joinCourse, leaveCourse } from "../../services/courseService";
import { AssignmentList } from '../../components/course_page/assignment_list/AssignmentList';
import {AssignmentBoard} from "../../components/course_page/assignmen_board/AssignmentBoard";
import { Modal } from '../../components/course_page/modal/Modal';
import { AssignmentForm } from '../../components/course_page/assignment_form/AssignmentForm';
// import { addAssignmentButton } from '../../components/AddAssignmentButton';
/*
* IMPORTANT! Use this .module.css file so that the styles are contained for the current module instead of interfering with other files
* To set styles for an element of a class, do <tag className={styles.class}></tag>, e.g. <div className={styles.inputWrapper}></div>
* */
import styles from "./CoursePage.module.css";
import dayjs from "dayjs";


function CoursePage(){
  //unique user identifier
  //TODO: This is temporary. Update to align with the real login implementation.
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  //Unique identifier for current course page. Extracted from the URL.
  const { courseId } = useParams();
  const courseIdInt = parseInt(courseId);

  //Basic Info for the course
  const [courseInfo, setCourseInfo] = useState(null);

  //Assignments for the course
  const [assignments, setAssignments] = useState(null);
  const [todayAssignments, setTodayAssignments] = useState([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);


  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State to track which assignment is being edited
  const [editingIndex, setEditingIndex] = useState(null);

  // State to store the current assignment being edited
  const [currentAssignment, setCurrentAssignment] = useState(null);

  const [isAddingAssignment, setIsAddingAssignment] = useState(false);
  const [enrolled,    setEnrolled]   = useState(false);


  //Load course assignments when the page is initiated
  useEffect(() => {
    getCourseInfo();
    getCourseAssignments();

  }, [])

  useEffect(() => {
    setTodayUpcoming();
  }, [assignments]);

  console.log(todayAssignments);


  const setTodayUpcoming = () =>{
    if(!assignments){
      return;
    }
    const today = dayjs().format('YYYY-MM-DD');

    const todayList = [];
    const upcomingList = [];

    for (const a of assignments) {
      const due = dayjs(a.dueDate).format('YYYY-MM-DD');
      if (due === today) {
        todayList.push(a);
      } else {
        upcomingList.push(a);
      }
    }

    setTodayAssignments(todayList);
    setUpcomingAssignments(upcomingList);
  }

  /*
  * Add an assignment for the course
  * Redirects to the `UploadFile.jsx` Page
  * TODO: Might need another form so that users can only add assignments to the course of the current page
  * */
  const navigate = useNavigate();
  const handleAddAssignment = () => {
    navigate('/upload-file');
  }

  /*
  * Mark an assignment as complete
  * @param {string} assignmentID
  * */
  const handleMarkCompleteAssignment = async (assignmentID) => {
    try {
      const response = await markCompleteAssignment(username, assignmentID);
    } catch (e) {

    }

  }

  /*
  * Mark an assignment as complete
  * @param {string} assignmentID
  * */
  const handleEditAssignment = async (assignmentID) => {
    try {
      const response = await editAssignmentInfo(username, assignmentID);
    } catch (e) {

    }
  }

  /*
  * Remove an assignment
  * @param {string} assignmentID
  * */
  const handleRemoveAssignment = async (assignment) => {
    try {
      const response = await removeAssignment(assignment.assignmentID);
      const assignmentID = assignment.assignmentID;
      setAssignments(preAssignments => preAssignments.filter(assignment => assignment.assignmentID !== assignmentID))
    } catch (e) {

    }
  }

  const formatDisplayTime = (timeStr) => {
    try {
      const date = new Date(timeStr);
      if (isNaN(date.getTime())) throw new Error("Invalid date");
      return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    } catch(e) {
      console.error(e);
      return timeStr;
    }
  };


  const getCourseAssignments = async () => {
    try {
      const response = await getCourseAssignmentsById(courseId);
      console.log(response);
      setAssignments(response.data);
    } catch (e) {

    }
  }

  const getCourseInfo = async () => {
    try {
      const { data } = await getCourseInfoById(courseIdInt);
      setCourseInfo(data);

      const uid = Number(localStorage.getItem("user_id"));
      const res  = await isEnrolled(uid, courseIdInt);
      setEnrolled(Boolean(res.data.enrolled));
    } catch (err) {
      console.error(err);
    }
  };



  const handleOpenEditModal = (index, assignmentData) => {
    setEditingIndex(index);
    setCurrentAssignment(assignmentData);
    setIsModalOpen(true);
    setIsAddingAssignment(false);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setCurrentAssignment(null);
    setIsAddingAssignment(false);
  };

  // Function to handle form submission
  const handleFormSubmit = async (updatedData) => {
    if (isAddingAssignment) {
      try {
        const payload = {
          assignmentName: updatedData.name,
          desc: updatedData.description,
          dueDate: updatedData.dueDate,
          dueTime: updatedData.dueTime,
          courseID: courseIdInt
        };

        console.log(payload);
        const response = await createAssignment(payload); // <-- Wait for the request
        const newAssignment = {
          ...payload,
          assignmentID: response.data.assignmentID // or however your backend returns it
        };

        const newAssignments = [...assignments, newAssignment];
        setAssignments(newAssignments);
        setTodayUpcoming();
      } catch (e) {
        console.error("Failed to create assignment:", e);
      }
    } else if (editingIndex !== null && assignments) {
      try {
        const payload = {
          assignmentID:assignments[editingIndex].assignmentID,
          assignmentName: updatedData.name,
          desc: updatedData.description,
          dueDate: updatedData.dueDate,
          dueTime: updatedData.dueTime,
          courseID: courseIdInt
        };
        const response = await editAssignmentInfo(payload);
        const newAssignments = [...assignments];
        newAssignments[editingIndex] = {
          ...newAssignments[editingIndex],
          assignmentName: updatedData.name,
          desc: updatedData.description,
          dueDate: updatedData.dueDate,
          dueTime: updatedData.dueTime
        };

        setAssignments(newAssignments);
        setTodayUpcoming();
      } catch (e) {
        console.error("Failed to edit assignment:", e);
      }
    }

    handleCloseModal();
  };


  const handleAddAssignmentClick = () => {
    setIsAddingAssignment(true);
    setCurrentAssignment({
      name: "",
      dueDate: "",
      description: ""
    });
    setIsModalOpen(true);
  };

  // TODO: Loading content is required
  if(!courseInfo || !assignments){
    console.log(courseInfo);
    console.log(assignments);
    return(
        <div>
          <h1>Loading</h1>
        </div>
    )
  }

  return(
      <div className={styles.courseDetailPage}>
        <header className="flex items-center justify-between max-w-7xl mx-auto mt-4 mb-8">
          <h1 className="text-3xl font-bold" onClick={()=>{navigate("/")}}>Back</h1>
          {email && (
              <button
                  onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Logout
              </button>
          )}
        </header>
        <div className={styles.content}>
          <div className={styles.courseHeader}>
            <div className={styles.courseInfo}>
              <div className={styles.courseTitle}>{courseInfo.courseName}</div>
              <div className={styles.otherInfo}>
                {courseInfo.meetingDay} &nbsp; {formatDisplayTime(courseInfo.meetingTime)}
              </div>
            </div>

            {email && (
                <div className={styles.actionBox}>
                  <button
                      onClick={async () => {
                        if (enrolled) await leaveCourse(courseIdInt);
                        else await joinCourse(courseIdInt);

                        const {data} =
                            await isEnrolled(Number(localStorage.getItem("user_id")), courseIdInt);
                        setEnrolled(Boolean(data.enrolled));
                      }}
                      className={`${enrolled ? styles.leaveBtn : styles.joinBtn}`}
                  >
                    {enrolled ? "Leave Course" : "Join Course"}
                  </button>

                  {enrolled && (
                      <button
                          onClick={handleAddAssignmentClick}
                          className={styles.addBtn}
                      >
                        Add Assignment
                      </button>
                  )}
                </div>
            )}
          </div>


          <div className={styles.mainContent}>
            <div className={styles.todaySection}>
              <div className={styles.sectionTitle}>Due Today</div>
              {todayAssignments.length === 0 && <EmptyAssignment period={"today"}></EmptyAssignment>}
              <AssignmentBoard
                  assignments={todayAssignments}
                  onEditAssignment={handleOpenEditModal}
                  onRemoveAssignment={handleRemoveAssignment}
              />
            </div>
            <div className={styles.upcomingSection}>
              <div className={styles.sectionTitle}>Upcoming</div>
              {upcomingAssignments.length === 0 && <EmptyAssignment period={"upcoming"}></EmptyAssignment>}

              <AssignmentList
                  assignments={upcomingAssignments}
                  onEditAssignment={handleOpenEditModal}
                  onRemoveAssignment={handleRemoveAssignment}
              />
            </div>
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <AssignmentForm
              assignment={currentAssignment}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseModal}
              isAddingNew={isAddingAssignment}
          />
        </Modal>
      </div>
  )
}

export default CoursePage;
