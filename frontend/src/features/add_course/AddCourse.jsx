import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadCourse } from "../../services/courseService";
import CustomTimePicker from "../../components/add_assignments/TimePicker";


export default function AddCourse() {
    const navigate = useNavigate();

    /* form state */
    const [courseName,   setCourseName]   = useState("");
    const [meetingDay,   setMeetingDay]   = useState("");
    const [meetingTime,  setMeetingTime]  = useState("");
    const [description,  setDescription]  = useState("");
    const [errors,       setErrors]       = useState({});

    /* helpers */
    const onChange = (setter, key) => e => {
        setter(e.target.value);
        setErrors(prev => ({ ...prev, [key]: "" }));
    };

    const validate = () => {
        const e = {};
        if (!courseName.trim())  e.courseName  = "Required";
        if (!meetingDay.trim())  e.meetingDay  = "Required";
        if (!meetingTime.trim()) e.meetingTime = "Required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    /* submit */
    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            await uploadCourse({
                courseName,
                meetingDay,
                meetingTime,
                description
            });
            navigate("/");                 // go back to dashboard
        } catch (err) {
            console.error(err);
            alert("Could not add course — try again.");
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-12 bg-white shadow rounded-lg p-8">
            <h1 className="text‑2xl font-bold mb-6">Add Course</h1>

            {/* Course Name */}
            <label className="block mb-3">
                <span className="font-medium">Course Name</span>
                <input
                    type="text"
                    value={courseName}
                    onChange={onChange(setCourseName, "courseName")}
                    className="w-full mt-1 px-3 py-2 border rounded"
                    placeholder="CSCI 201"
                />
                {errors.courseName && (
                    <p className="text-red-600 text-sm mt-1">{errors.courseName}</p>
                )}
            </label>

            {/* Meeting Day */}
            <label className="block mb-3">
                <span className="font-medium">Meeting Day(s)</span>
                <input
                    type="text"
                    value={meetingDay}
                    onChange={onChange(setMeetingDay, "meetingDay")}
                    className="w-full mt-1 px-3 py-2 border rounded"
                    placeholder="Monday / Wednesday"
                />
                {errors.meetingDay && (
                    <p className="text-red-600 text-sm mt-1">{errors.meetingDay}</p>
                )}
            </label>

            {/* Meeting Time */}
            <label className="block mb-3">
                <span className="font-medium">Meeting Time</span>
                <div className="mt-1">
                    <CustomTimePicker
                        label=""
                        value={meetingTime}
                        onChange={(newValue) => setMeetingTime(newValue)}
                        error={Boolean(errors.meetingTime)}
                        fullWidth={true}
                    />
                </div>
                {errors.meetingTime && (
                    <p className="text-red-600 text-sm mt-1">{errors.meetingTime}</p>
                )}
            </label>


            {/* Actions */}
            <div className="flex justify-end gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 rounded border"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 rounded bg-purple-600 text-white"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}
