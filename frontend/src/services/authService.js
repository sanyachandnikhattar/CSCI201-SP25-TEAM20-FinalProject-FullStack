import api from "./api"


/**
 * [POST] User Login
 * @param {string} username
 * @param {string} password
 * TODO: endpoint is temporary. Update with the correct endpoint.
 */
export function login(email, password){
    const data = {
        "email":email,
        "password":password
    }
    return api.post("/LoginServlet");
}


/**
 * [POST] User Create Account
 * @param {string} username
 * @param {string} password
 * TODO: endpoint is temporary. Update with the correct endpoint.
 */
export function register(username,email, university, password){
    const data = {
        "username":username,
        "email":email,
        "university":university,
        "password":password
    }
    return api.post("/RegisterServlet", data);
}