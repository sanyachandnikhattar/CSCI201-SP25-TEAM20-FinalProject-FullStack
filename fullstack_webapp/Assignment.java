package backend;
import java.util.List;

public class Assignment 
{
	private int courseID;
	private int assignmentID;
	private String assignmentName;
	private String dueDate;
	private String dueTime;
	private String desc; //description
	
	
	//default constructor
	public Assignment()
	{
		this.courseID = 0;
		this.assignmentName = "";
		this.dueDate = "";
		this.dueTime = "";
		this.desc = "";
		this.assignmentID = 0;
	}
	
	
	public Assignment(int cID, int aID, String aName, String dDate, String dTime,  String descr)
	{
        this.courseID = cID;
        this.assignmentID = aID;
        this.assignmentName = aName;
        this.dueDate = dDate;
        this.dueTime = dTime;
        this.desc = descr;
       
	}
	

    
    // Getter methods as shown in the diagram
    
    /**
     * Get the due date of the assignment
     */
    public String getDueDate() {
        return dueDate;
    }
    
    public String getDueTime() {
        return dueTime;
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
    
    public int getCourseID() {
        return courseID;
    }
    

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
    
 
    public void setCourseID(int id) {
        this.courseID = id;
    }

    
    

    /**
     * Convert to string representation
     * @return a string representation of the assignment
     */
    @Override
    public String toString() {
        return "Assignment [ID=" + assignmentID + 
               ", Name=" + assignmentName + 
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
