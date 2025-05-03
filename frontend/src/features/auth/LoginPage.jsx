// import {Link} from "react-router-dom";

// function LoginPage(){
//     return(
//         <div>
//             <h1>Login Page</h1>
//             <Link to="/">Back</Link>
//         </div>
//     )
// }

// export default LoginPage;

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {login, register} from "../../services/authService";

function LoginPage() {


  const navigate = useNavigate();

  // form values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // track which fields have been touched
  const [touched, setTouched] = useState({ email: false, password: false });

  // per-field error messages
  const [errors, setErrors] = useState({ email: '', password: '' });

  // simple validator
  const validateField = (name, value) => {
    if (!value) {
      return name === 'email' ? 'Email is required.' : 'Password is required.';
    }
    if (name === 'email' && !value.includes('@')) {
      return 'Must be a valid email.';
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
    name === 'email' ? setEmail(value) : setPassword(value);

    // if they’ve already touched this field, re-validate on each change
    if (touched[name]) {
      setErrors((errs) => ({ ...errs, [name]: validateField(name, value) }));
    }
  };

  // form is valid if no errors and no empty fields
  const isFormValid =
    email && password &&
    !errors.email &&
    !errors.password;

  const handleSubmit = async(e) => {
    e.preventDefault();

    // mark all touched to trigger errors
    setTouched({ email: true, password: true });
    const emailErr = validateField('email', email);
    const passErr = validateField('password', password);
    setErrors({ email: emailErr, password: passErr });

    if (emailErr || passErr) return;

    // TODO: call your authService.login(email, password)
    // on success:
    const response = await login(email, password);
    console.log(response["login_status"]);
    if(response.data["login_status"] === 1){
      localStorage.setItem("email", email);
      navigate('/');
    }else{
      alert("Incorrect Credentials")
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>

        {/* Email */}
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

        {/* Submit */}
        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Log In
        </button>

        <p className="mt-4 text-center text-sm">
          Don’t have an account?{' '}
          <Link to="/register" className="text-purple-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;


