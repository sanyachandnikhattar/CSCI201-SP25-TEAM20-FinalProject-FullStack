import api from "./api"


/**
 * [POST] Upload File
 * @param {string} username
 * TODO: Not Implemented
 */
export function uploadFile(fd) {
    // ⚠️ DO NOT set Content‑Type – Axios adds it with boundary
    return api.post("/FileUploadServlet", fd);
}


/**
 * [POST] Upload File
 * @param {string} username
 *  @param {FormData} formData
 * TODO: Not Implemented
 */
export function uploadManualInput(formData){
    return api.post("/ManualInputServlet", formData);
}
