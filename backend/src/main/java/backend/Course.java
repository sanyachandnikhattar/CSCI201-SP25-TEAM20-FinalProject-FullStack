package backend;

import java.util.List;

public class Course {
	private int courseID;
    private String courseName;
    private String meetingDay;
    private String meetingTime;
    private List<Assignment> assignments;

    public Course(int courseID, String courseName, String meetingDay, String meetingTime, List<Assignment> assignments) {
        this.courseID = courseID;
    	this.courseName = courseName;
        this.meetingDay = meetingDay;
        this.meetingTime = meetingTime;
        this.assignments = assignments;
    }
}
