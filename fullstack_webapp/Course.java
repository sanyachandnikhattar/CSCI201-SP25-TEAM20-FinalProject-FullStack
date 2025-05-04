package backend;

import java.util.List;

public class Course {
	private int courseID;
    private String courseName;
    private String courseDates;
    private String courseTime;
    private List<Assignment> assignments;

    public Course(int courseID, String courseName, String courseDates, String courseTime, List<Assignment> assignments) {
        this.courseID = courseID;
    	this.courseName = courseName;
        this.courseDates = courseDates;
        this.courseTime = courseTime;
        this.assignments = assignments;
    }
}
