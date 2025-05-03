// import {Link} from "react-router-dom";

// function RegisterPage(){
//     return(
//         <div>
//             <h1>Register Page</h1>
//             <Link to="/">Back</Link>
//         </div>
//     )
// }

// export default RegisterPage;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {login, register} from "../../services/authService";

function RegisterPage() {
  const navigate = useNavigate();

  // form values
  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [touched, setTouched] = useState({
    fullName: false,
    university: false,
    email: false,
    password: false
  });

  const [errors, setErrors] = useState({
    fullName: '',
    university: '',
    email: '',
    password: ''
  });

  const validateField = (name, value) => {
    if (!value) {
      const labels = {
        fullName: 'Full name',
        university: 'University',
        email: 'Email',
        password: 'Password'
      };
      return `${labels[name]} is required.`;
    }
    if (name === 'email' && !value.includes('@')) {
      return 'Must be a valid email.';
    }
    if (name === 'password' && value.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    return '';
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((errs) => ({ ...errs, [name]: validateField(name, value) }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'fullName': setFullName(value); break;
      case 'university': setUniversity(value); break;
      case 'email': setEmail(value); break;
      case 'password': setPassword(value); break;
    }
    if (touched[name]) {
      setErrors((errs) => ({ ...errs, [name]: validateField(name, value) }));
    }
  };

  const isFormValid =
    fullName &&
    university &&
    email &&
    password &&
    !errors.fullName &&
    !errors.university &&
    !errors.email &&
    !errors.password;

  const handleSubmit = async(e) => {
    e.preventDefault();

    // mark all touched
    setTouched({
      fullName: true,
      university: true,
      email: true,
      password: true
    });

    // run final validation
    const newErrs = {
      fullName: validateField('fullName', fullName),
      university: validateField('university', university),
      email: validateField('email', email),
      password: validateField('password', password)
    };
    setErrors(newErrs);
    if (Object.values(newErrs).some((err) => err)) return;

    // TODO: call your authService.register({ fullName, university, email, password })
    // on success, maybe auto-login or redirect to login:
    const response = await register(fullName, email, university, password);
    if(response.data["register_status"] === 1){
      localStorage.setItem("username", fullName);
      localStorage.setItem("email", email);
      navigate('/');
    }else{
      alert("Registration Failed")
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {/* Full Name */}
        <div className="mb-4">
          <label htmlFor="fullName" className="block font-medium mb-1">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            className={`w-full p-2 border rounded ${
              errors.fullName && touched.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            value={fullName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.fullName && touched.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* University */}
        <div className="mb-4">
          <label htmlFor="university" className="block font-medium mb-1">
            University
          </label>
          <input
            id="university"
            name="university"
            type="text"
            className={`w-full p-2 border rounded ${
              errors.university && touched.university ? 'border-red-500' : 'border-gray-300'
            }`}
            value={university}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.university && touched.university && (
            <p className="text-red-500 text-sm mt-1">{errors.university}</p>
          )}
        </div>

        {/* University Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`w-full p-2 border rounded ${
              errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
            }`}
            value={email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && touched.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label htmlFor="password" className="block font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className={`w-full p-2 border rounded ${
              errors.password && touched.password ? 'border-red-500' : 'border-gray-300'
            }`}
            value={password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.password && touched.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Register
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
