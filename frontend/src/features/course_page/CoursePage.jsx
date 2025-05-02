import {Link} from "react-router-dom";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { markCompleteAssignment, editAssignmentInfo, removeAssignment} from "../../services/assignmentService";
import { getCourseAssignments, getCourseInfoById} from "../../services/courseService";
import { CourseHeader } from '../../components/CourseHeader';
import { AssignmentList } from '../../components/AssignmentList';
import { Modal } from '../../components/Modal';
import { AssignmentForm } from '../../components/AssignmentForm';
// import { addAssignmentButton } from '../../components/AddAssignmentButton';
/*
* IMPORTANT! Use this .module.css file so that the styles are contained for the current module instead of interfering with other files
* To set styles for an element of a class, do <tag className={styles.class}></tag>, e.g. <div className={styles.inputWrapper}></div>
* */
import styles from "./CoursePage.module.css";


function CoursePage(){
  //unique user identifier
  //TODO: This is temporary. Update to align with the real login implementation.
  const username = localStorage.getItem("username");

  //Unique identifier for current course page. Extracted from the URL.
  const { courseId } = useParams();
  const courseIdInt = parseInt(courseId);

  //Basic Info for the course
  const [courseInfo, setCourseInfo] = useState(null);

  //Assignments for the course
  const [assignments, setAssignments] = useState(null);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State to track which assignment is being edited
  const [editingIndex, setEditingIndex] = useState(null);

  // State to store the current assignment being edited
  const [currentAssignment, setCurrentAssignment] = useState(null);

  const [isAddingAssignment, setIsAddingAssignment] = useState(false);

  //Load course assignments when the page is initiated
  useEffect(() => {
    getCourseInfo();
    console.log(courseInfo);
    getCourseAssignments();
  }, [])

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
  const handleRemoveAssignment = async (assignmentID) => {
    try {
      const response = await removeAssignment(username, assignmentID);
      setAssignments(preAssignments => preAssignments.filter(assignment => assignment.assignmentID !== assignmentID))
    } catch (e) {

    }
  }


  const getCourseAssignments = async () => {
    try {
      const response = await getCourseAssignments(username, courseId);
      setAssignments(response);
    } catch (e) {

    }
  }

  const getCourseInfo = async () =>{
    try {
      const response = await getCourseInfoById("", courseIdInt);
      setCourseInfo(response);
    }catch (e){

    }
  }

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
  const handleFormSubmit = (updatedData) => {
    if (isAddingAssignment) {
      // Add new assignment
      const newAssignments = [...assignments, updatedData];
      setAssignments(newAssignments);
    } else if (editingIndex !== null && assignments) {
      // Edit existing assignment
      const newAssignments = [...assignments];
      newAssignments[editingIndex] = {
        ...newAssignments[editingIndex],
        ...updatedData
      };
      setAssignments(newAssignments);
    }
    handleCloseModal();
  };

  // Function to handle removing an assignment


  const handleAddAssignmentClick = () => {
    setIsAddingAssignment(true);
    setCurrentAssignment({
      name: "",
      dueDate: "",
      description: ""
    });
    setIsModalOpen(true);
  };

  if(!courseInfo){
    return(
        <div>
          <h1>Loading</h1>
        </div>
    )
  }

  return(
      <div className={styles.courseDetailPage}>
        <div className={styles.rectangle}></div>
        <div className={styles.content}>
          <CourseHeader
              courseID={courseInfo.courseName}
              days={courseInfo.days}
              time={courseInfo.time}
          />
          <div className={styles.dashedLine}></div>
          <div className={styles.assignmentTitle}>Assignments</div>
          {/*  <AssignmentList */}
          {/*    assignments={assignments}*/}
          {/*    onEditAssignment={handleOpenEditModal}*/}
          {/*    onRemoveAssignment={handleRemoveAssignment}*/}
          {/*  />*/}
          {/*  <div className={styles.addButtonContainer}>*/}
          {/*    <button */}
          {/*      className={styles.addButton}*/}
          {/*      onClick={handleAddAssignmentClick}*/}
          {/*    >*/}
          {/*      + Add Assignment*/}
          {/*    </button>*/}
          {/*  </div>*/}
        </div>

        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <AssignmentForm
              assignment={currentAssignment}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseModal}
          />
        </Modal>
      </div>
  )
}

export default CoursePage;
