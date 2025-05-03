import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from "./features/home/home";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import CoursePage from "./features/course_page/CoursePage";
import UploadFile from "./features/upload_file/UploadFile";
import AddCourse from "./features/add_course/AddCourse";

function App() {
  return (
    <div>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />}/>
            <Route path="/login" element={<LoginPage />}/>
            <Route path="/register" element={<RegisterPage />}/>
            <Route path="/course/:courseId" element={<CoursePage/>} />
            <Route path="/upload-file" element={<UploadFile/>} />
              <Route path="/add-course" element={<AddCourse/>} />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
