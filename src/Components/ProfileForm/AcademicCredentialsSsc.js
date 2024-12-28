import React, { useState,useEffect } from "react";
import "./ProfileForm.css"; // Ensure the styles are consistent
import "../../Profile.css";
import { useLocation } from "react-router-dom";
import axios from "axios";



const SscForm = () => {
  const [esn, setesn] = useState("");
  const [institution, setInstitution] = useState("");
  const [course, setCourse] = useState("SSC");
  const [yearOfPassing, setYearOfPassing] = useState("");
  const [percentage, setPercentage] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [obtainedMarks, setObtainedMarks] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [board, setBoard] = useState("");
  const [message, setMessage] = useState("");

  
  const [transcriptFile, setTranscriptFile] = useState(null);
  const [error, setError] = useState("");

  const handleClear = () => {
    setesn("");
    setInstitution("");
    setCourse("SSC");
    setYearOfPassing("");
    setPercentage("");
    setTotalMarks(""); // Reset total marks
    setObtainedMarks(""); // Reset obtained marks
    setState("");
    setDistrict("");
    setSubDistrict("");
    setBoard("")
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Check file size (2MB = 2 * 1024 * 1024 bytes)
    if (file && file.size > 2 * 1024 * 1024) {
      setError("File size should not exceed 2MB.");
      setTranscriptFile(null); // Reset file
    } else {
      setError("");
      setTranscriptFile(file); // Set selected file
    }
  };

  const location = useLocation();
  const username = location.state?.userName || "User";

const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (!esn || !institution || !course || !board) {
      setError("Please fill in all required fields.");
      return;
    }

    // Create form data
    const formDataSsc = {
      username,
      esn,
      institution,
      board,
      course,
      yearOfPassing,
      totalMarks: totalMarks ? Number(totalMarks) : undefined, // Convert to number
      obtainedMarks: obtainedMarks ? Number(obtainedMarks) : undefined, // Convert to number
      percentage,
      state,
      district,
      subDistrict
    };

    try {
      // Post form data to backend
      const response = await axios.post("http://localhost:5000/api/ssc", formDataSsc);

      const data = response.data;

      if (data.success) {
        setMessage(" Form submitted successfully!");
        handleClear(); // Clear the form after successful submission
        await axios.put(`http://localhost:5000/api/visibility/${username}`, {
            sscSubmitted: true,
          });
      } else {
        setError(data.message || "Failed to submit the form.");
      }
    } catch (error) {
      setError("Error submitting the form. Please try again.");
      console.error("Submission error:", error);
    }
  };



 // Function to calculate percentage
 const calculatePercentage = () => {
    if (totalMarks > 0) {
      const calculatedPercentage = (obtainedMarks / totalMarks) * 100;
      setPercentage(calculatedPercentage.toFixed(2)); // Set percentage to 2 decimal places
    } else {
      setPercentage(""); // Reset if total marks is zero
    }
  };

  // Effect to calculate percentage whenever obtained or total marks change
  useEffect(() => {
    calculatePercentage();
  }, [totalMarks, obtainedMarks]);


  const boards = [
    "State Board of Secondary Education",
    "CBSE (Central Board of Secondary Education)",
    "ICSE (Indian Certificate of Secondary Education)",
    "IB (International Baccalaureate)",
    "NIOS (National Institute of Open Schooling)",
    "RBSE (Rajasthan Board of Secondary Education)",
    "UP Board (Uttar Pradesh Board of High School and Intermediate Education)",
    "Maharashtra Board (Maharashtra State Board of Secondary and Higher Secondary Education)",
    "GSEB (Gujarat Secondary and Higher Secondary Education Board)",
    "KSEEB (Karnataka Secondary Education Examination Board)",
    "PSEB (Punjab School Education Board)",
    "Bihar Board (Bihar School Examination Board)",
    "Odisha Board (Board of Secondary Education, Odisha)",
    "WBSE (West Bengal Board of Secondary Education)",
    "Telangana Board (Telangana State Board of Intermediate Education)",
    "Andhra Pradesh Board (Board of Secondary Education, Andhra Pradesh)",
    "Assam Board (Board of Secondary Education, Assam)",
    "Himachal Pradesh Board (Himachal Pradesh Board of School Education)",
    "JKBOSE (Jammu and Kashmir State Board of School Education)",
    "Goa Board (Goa Board of Secondary and Higher Secondary Education)",
    // Add more boards as necessary
  ];

  return (
    <div className="profile-c">
      <h3 className="">SSC (10th Std) Information</h3>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Exam Seat Number</label>
            <input
              type="text"
              value={esn}
              onChange={(e) => setesn(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Institution Name</label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Course</label>
            <input
              type="text"
              value={course}
              readOnly // Read-only since it's SSC
            />
          </div>
          <div className="form-group">
            <label>Board</label>
            <select value={board} onChange={(e) => setBoard(e.target.value)}>
              <option value="">Select Board</option>
              {boards.map((b, index) => (
                <option key={index} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Year of Passing</label>
            <input
              type="date"
              value={yearOfPassing}
              onChange={(e) => setYearOfPassing(e.target.value)}
            />
          </div>


          <div className="form-group">
            <label>Total Marks</label>
            <input
              type="number"
              value={totalMarks}
              onChange={(e) => setTotalMarks(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Obtained Marks</label>
            <input
              type="number"
              value={obtainedMarks}
              onChange={(e) => setObtainedMarks(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Percentage</label>
            <input
              type="text"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              readOnly
            />
          </div>


        </div>

        <div className="form-row">
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>District</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Sub-District</label>
            <input
              type="text"
              value={subDistrict}
              onChange={(e) => setSubDistrict(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Final Year Mark sheet</label>
          <input
            type="file"
            accept=".pdf" // Acceptable file formats
            onChange={handleFileChange}
          />
          {error && <div className="text-danger">{error}</div>}
        </div>
        {message && <div className="text-success">{message}</div>}

        <div className="profile-buttons centerbtn">
          <button className="connect-button b" type="submit">
            Submit
          </button>
          <button
            className="message-button c"
            type="button"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default SscForm;
