package backend;
import java.util.List;

public class Assignment 
{
	private String courseName;
	private String courseID;
	private String assignmentName;
	private String dueDate;
	private String desc; //description
	private List<Scheduler> assignmentScheduler;
	private int assignmentID;
	
	//default constructor
	public Assignment()
	{
		this.courseID = "";
		this.courseName = "";
		this.assignmentName = "";
		this.dueDate = "";
		this.desc = "";
		this.assignmentID = 0;
	}
	
	
	public Assignment(String cName, String cID, String aName, String dDate, String descr, int aID)
	{
		this.courseName = cName;
        this.courseID = cID;
        this.assignmentName = aName;
        this.dueDate = dDate;
        this.desc = descr;
        this.assignmentID = aID;
	}
	
	/**
     * Constructor without assignment ID (for new assignments)
     * @param courseName The name of the course
     * @param courseID The ID of the course
     * @param assignmentName The name of the assignment
     * @param dueDate The due date of the assignment
     * @param description The description of the assignment
     */
    public Assignment(String courseName, String courseID, String assignmentName, 
                     String dueDate, String description) {
        this(courseName, courseID, assignmentName, dueDate, description, 0);
    }
    
    // Getter methods as shown in the diagram
    
    /**
     * Get the due date of the assignment
     */
    public String getDueDate() {
        return dueDate;
    }
    
    public String getAssignmentName() 
    {
        return assignmentName;
    }
    
    public String getDescription() 
    {
        return desc;
    }
    
    public int getAssignmentID() {
        return assignmentID;
    }
    
    public String getCourseID() {
        return courseID;
    }
    
    public String getCourseName() {
        return courseName;
    }
    
    ////setter functions
    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }
    

    public void setAssignmentName(String name) {
        this.assignmentName = name;
    }
    

    public void setDescription(String desc) 
    {
        this.desc = desc;
    }
    

    public void setAssignmentID(int id) {
        this.assignmentID = id;
    }
    
 
    public void setCourseID(String id) {
        this.courseID = id;
    }
    
    public void setCourseName(String name) {
        this.courseName = name;
    }
    
    
    public void setAssignmentScheduler(List<Scheduler> scheduler) 
    {
        this.assignmentScheduler = scheduler;
    }
    
    /*
     * mark assignment as complete
    */
    public void assignmentComplete() {
        // Implementation would depend on how you track completion
        // For example, you might update a database or notify the scheduler
        if (assignmentScheduler != null) {
            // Notify the scheduler that the assignment is complete
            // assignmentScheduler.markComplete(this);
        }
    }
    
    /**
     * Convert to string representation
     * @return a string representation of the assignment
     */
    @Override
    public String toString() {
        return "Assignment [ID=" + assignmentID + 
               ", Name=" + assignmentName + 
               ", Course=" + courseName + 
               ", Due=" + dueDate + "]";
    }
    
    /**
     * Equals method to compare assignments
     * @param obj the object to compare with
     * @return true if the objects are equal, false otherwise
     */
    @Override
    public boolean equals(Object obj) 
    {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        
        Assignment other = (Assignment) obj;
        return assignmentID == other.assignmentID;
    }
}
