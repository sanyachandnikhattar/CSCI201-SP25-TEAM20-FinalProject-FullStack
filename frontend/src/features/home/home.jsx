import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCourses, searchCourseByName, joinCourse, leaveCourse } from "../../services/courseService";

/** CourseDashboard
 *  – Logged‑in: private course dashboard **plus** global course search
 *  – Guest: only search + public course results
 */
export default function CourseDashboard() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("email"));

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);


  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    const uid = localStorage.getItem("user_id");
    (async () => {
      try {
        const { data } = await getAllCourses(uid);
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [isLoggedIn]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const { data } = await searchCourseByName(q);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
          <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-purple-500 animate-spin" />
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-100 p-6">
        <header className="flex items-center justify-between max-w-7xl mx-auto mb-8">
          <h1 className="text-3xl font-bold">Course Dashboard</h1>
          {isLoggedIn && (
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

        <section className="max-w-4xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex shadow rounded-lg overflow-hidden">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses by name…"
                className="flex-grow px-4 py-3 outline-none"
            />
            <button type="submit" className="bg-purple-600 text-white px-6">
              Search
            </button>
          </form>
          {searching && <p className="text-sm text-gray-500 mt-2">Searching…</p>}
          {query && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">Search Results</h2>
                {results.length === 0 ? (
                    <p className="text-gray-500">No courses found.</p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {results.map((c) => {
                        const enrolled = courses.some(k => k.courseID === c.courseID);
                        return (
                            <div key={c.courseID} className="bg-white rounded-lg shadow p-4">
                              <h3 className="font-semibold text-lg mb-1">{c.courseName}</h3>
                              <p className="text-sm text-gray-600 mb-2">
                                Meets: {c.courseDates} at {c.courseTime}
                              </p>

                              <button
                                  onClick={() => navigate(`/course/${c.courseID}`)}
                                  className="text-purple-600 hover:text-purple-800 text-sm mr-4"
                              >
                                View Details →
                              </button>

                              {isLoggedIn && (
                                  <button
                                      onClick={async () => {
                                        const enrolled = courses.some(k => k.courseID === c.courseID);
                                        if (enrolled) {
                                          await leaveCourse(c.courseID);
                                          setCourses(prev => prev.filter(k => k.courseID !== c.courseID));
                                        } else {
                                          await joinCourse(c.courseID);
                                          setCourses(prev => [...prev, c]);
                                        }
                                      }}
                                      className={`mt-3 px-3 py-1 rounded text-sm
        ${courses.some(k => k.courseID === c.courseID)
                                          ? "bg-red-600 text-white"
                                          : "bg-green-600 text-white"}`}
                                  >
                                    {courses.some(k => k.courseID === c.courseID) ? "Leave" : "Join"}
                                  </button>
                              )}
                            </div>

                        );
                      })}
                    </div>
                )}
              </div>
          )}
        </section>

        {isLoggedIn && (
            <>
              {/* Course list */}
              <section className="max-w-7xl mx-auto mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Your Courses</h2>
                  <button
                      onClick={() => navigate("/add-course")}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
                  >
                    <span className="text-lg">＋</span> Add Course
                  </button>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course) => (
                      <div
                          key={course.courseID}
                          className="bg-white rounded-lg shadow hover:shadow-lg cursor-pointer transition"
                          onClick={() => navigate(`/course/${course.courseID}`)}
                      >
                        <div className="bg-purple-600 text-white p-4 rounded-t-lg">
                          <h3 className="text-lg font-bold">{course.courseName}</h3>
                          <p className="text-sm opacity-90">
                            Meets: {course.courseDates} at {course.courseTime}
                          </p>
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium mb-2">Upcoming Assignments</h4>
                          {course.assignments?.length ? (
                              <ul className="space-y-2">
                                {course.assignments.slice(0, 3).map((a) => (
                                    <li
                                        key={a.assignmentID}
                                        className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded"
                                    >
                                      <span>{a.assignmentName}</span>
                                      <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                              Due: {new Date(a.dueDate).toLocaleDateString()}
                            </span>
                                    </li>
                                ))}
                              </ul>
                          ) : (
                              <p className="text-gray-500 italic text-sm">No upcoming assignments</p>
                          )}
                          <div className="pt-3 border-t mt-4 text-right">
                            <button
                                onClick={() => navigate(`/course/${course.courseID}`)}
                                className="text-purple-600 text-sm hover:text-purple-800"
                            >
                              View Details →
                            </button>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </section>

              <section className="max-w-7xl mx-auto mt-12 bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">To Do</h2>
                <div className="space-y-4">
                  {courses
                      .flatMap((c) => c.assignments.map((a) => ({ ...a, courseName: c.courseName })))
                      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                      .map((a) => (
                          <div key={a.assignmentID} className="flex items-center p-3 bg-gray-50 rounded">
                            <input type="checkbox" className="h-5 w-5 text-purple-600 rounded" />
                            <div className="ml-4 flex-grow">
                              <h4 className="font-medium">{a.assignmentName}</h4>
                              <p className="text-sm text-gray-600">{a.courseName}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-green-600">
                                Due: {new Date(a.dueDate).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500">{a.dueTime}</div>
                            </div>
                          </div>
                      ))}
                </div>
                <button
                    onClick={() => navigate("/upload-file")}
                    className="mt-6 flex items-center text-purple-600 hover:text-purple-800 font-medium"
                >
                  <span className="text-2xl mr-2">＋</span> Add Assignment
                </button>
              </section>
            </>
        )}
      </div>
  );
}
