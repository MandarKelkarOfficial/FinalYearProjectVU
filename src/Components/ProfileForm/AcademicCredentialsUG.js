import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./ProfileForm.css";
import "../../Profile.css";

const ProfileForm = () => {
  const [srn, setSrn] = useState("");
  const [prn, setPrn] = useState("");
  const [university, setUniversity] = useState("");
  const [universityUrl, setUniversityUrl] = useState("");
  const [course, setCourse] = useState("");
  const [startDate, setStartDate] = useState("");
  const [graduateDate, setGraduteDate] = useState(""); 
  const [cgp, setCgp] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [year, setYear] = useState("select"); 
  const [transcriptFile, setTranscriptFile] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");








  // Clear the form
  const handleClear = () => {
    setSrn("");
    setPrn("");
    setUniversity("");
    setUniversityUrl("");
    setCourse("");
    setStartDate("");
    setGraduteDate("");
    setCgp("");
    setState("");
    setDistrict("");
    setSubDistrict("");
    setYear("select");
    setTranscriptFile(null);
    setError("");
    setMessage("");
  };

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Check file size (2MB limit)
    if (file && file.size > 2 * 1024 * 1024) {
      setError("File size should not exceed 2MB.");
      setTranscriptFile(null);
    } else {
      setError("");
      setTranscriptFile(file); 
    }
  };

  const location = useLocation();
  const username = location.state?.userName || "User";



  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (!university || !universityUrl || !course) {
        setError("Please fill in all required fields.");
        return;
    }

    // Create form data
    const formDataUg = {
        username,
        srn,
        prn,
        universityUrl,
        university,
        course,
        startDate,
        graduateDate,
        cgp,
        state,
        district
    };

    try {
        // Post form data to backend
        const response = await axios.post("http://localhost:5000/api/ug", formDataUg);

        const data = response.data;

        if (data.success) {
            setMessage("Form submitted successfully!");
            handleClear(); // Clear the form after successful submission
            await axios.put(`http://localhost:5000/api/visibility/${username}`, {
              ugSubmitted: true,
            });

        } else {
            setError(data.message || "Failed to submit the form.");
        }
    } catch (error) {
        setError("Error submitting the form. Please try again.");
        console.error("Submission error:", error);
    }
};

  return (
    <div className="profile-c">
      <h3 className="text-center">Academic Information</h3>
      <hr />
      <h4>UG(Under Graduate)</h4>
      <form onSubmit={handleSubmit} >
        <div className="form-row">
          <div className="form-group">
            <label>SRN</label>
            <input type="text" value={srn} onChange={(e) => setSrn(e.target.value)} />
          </div>
          <div className="form-group">
            <label>PRN</label>
            <input type="text" value={prn} onChange={(e) => setPrn(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>University Name</label>
            <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} />
          </div>
          <div className="form-group">
            <label>University Url</label>
            <input type="text" value={universityUrl} onChange={(e) => setUniversityUrl(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Course</label>
            <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Starting Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Year</label>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="select">Select Year</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
              <option value="complete">Complete</option>
            </select>
          </div>
          <div className="form-group">
            <label>Graduation Date (expected)</label>
            <input type="date" value={graduateDate} onChange={(e) => setGraduteDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>CGP (Latest)</label>
            <input type="text" value={cgp} onChange={(e) => setCgp(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>State</label>
            <input type="text" value={state} onChange={(e) => setState(e.target.value)} />
          </div>
          <div className="form-group">
            <label>District</label>
            <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Sub-District</label>
            <input type="text" value={subDistrict} onChange={(e) => setSubDistrict(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label>Transcript</label>
          <input type="file" accept=".pdf" onChange={handleFileChange} />
          {error && <div className="text-danger">{error}</div>}
        </div>
        <div className="profile-buttons centerbtn">
          <button className="connect-button b" type="submit">
            Submit
          </button>
          <button className="message-button c" type="button" onClick={handleClear}>
            Clear
          </button>
        </div>
        {message && <div className="text-success">{message}</div>}
      </form>
    </div>
  );
};

export default ProfileForm;
