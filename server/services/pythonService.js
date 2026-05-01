const axios = require("axios");
const FormData = require("form-data");

module.exports = async function processWithPython(buffer, filename) {
  const formData = new FormData();
  formData.append("file", buffer, filename);

  const res = await axios.post("http://localhost:8000/process", formData, {
    headers: formData.getHeaders()
  });

  return res.data;
};