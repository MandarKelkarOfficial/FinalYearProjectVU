import React, { useState, useEffect } from "react";
import "./ProfileForm.css"; // Ensure the styles are consistent
import "../../Profile.css";
import axios from "axios";
import { useLocation } from "react-router-dom";


const HscDiplomaForm = () => {
  const [hcn, setHcn] = useState("");
  const [collage, setCollage] = useState("");
  const [course_hsc_diploma, setCourse_hsc_diploma] = useState("Diploma");
  //   const [course, setCourse] = useState("HSC"); // Default to HSC
  const [board, setBoard] = useState("");

  const [startDate, setStartDate] = useState("");
  const [year, setYear] = useState("select"); // Default option for year
  const [gap, setGap] = useState("No"); // Default option for year
  const [graduateDate, setGraduateDate] = useState("");
  const [percentage, setPercentage] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [obtainedMarks, setObtainedMarks] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [subDistrict, setSubDistrict] = useState("");

  const [transcriptFile, setTranscriptFile] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");


  // Boards for HSC
  const hscBoards = [
    "State Board of Higher Secondary Education",
    "CBSE (Central Board of Secondary Education)",
    "ICSE (Indian Certificate of Secondary Education)",
    "NIOS (National Institute of Open Schooling)",
    "RBSE (Rajasthan Board of Secondary Education)",
    "Maharashtra Board (Maharashtra State Board of Secondary and Higher Secondary Education)",
    "UP Board (Uttar Pradesh Board of High School and Intermediate Education)",
    "GSEB (Gujarat Secondary and Higher Secondary Education Board)",
    "PSEB (Punjab School Education Board)",
    "Bihar Board (Bihar School Examination Board)",
    "WBSE (West Bengal Council of Higher Secondary Education)",
    // Add other HSC boards as needed
  ];

  // Boards for Diploma
  const diplomaBoards = [
    "MSBTE (Maharashtra State Board of Technical Education)",
    "GTU (Gujarat Technological University)",
    "DTE Karnataka (Directorate of Technical Education, Karnataka)",
    "BTE Delhi (Board of Technical Education Delhi)",
    "UPBTE (Uttar Pradesh Board of Technical Education)",
    "TNDTE (Tamil Nadu Directorate of Technical Education)",
    "Rajasthan BTER (Board of Technical Education, Rajasthan)",
    "Haryana SBTE (State Board of Technical Education Haryana)",
    "WBSTE (West Bengal State Council of Technical Education)",
    "Kerala DTE (Directorate of Technical Education, Kerala)",
    // Add other Diploma boards as needed
  ];

  // Select boards based on course
  const boards = course_hsc_diploma === "HSC" ? hscBoards : diplomaBoards;

  const handleClear = () => {
    setHcn("");
    setCollage("");
    setCourse_hsc_diploma("");
    setStartDate("");
    setYear("select"); // Reset to default
    setGraduateDate("");
    setPercentage("");
    setObtainedMarks("");
    setTotalMarks("");
    setState("");
    setDistrict("");
    setSubDistrict("");
    setGap("");
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
    if (!hcn || !collage || !course_hsc_diploma || !gap || !board) {
      setError("Please fill in all required fields.");
      return;
    }

    // Create form data
    const formDataHsc = {
      username,
      hcn,
      collage,
      course_hsc_diploma: course_hsc_diploma,
      gap,
      board,
      startDate,
      graduateDate,
      totalMarks: totalMarks ? Number(totalMarks) : undefined, // Convert to number
      obtainedMarks: obtainedMarks ? Number(obtainedMarks) : undefined, // Convert to number
      percentage,
      state,
      district,
      subDistrict
    };

    try {
      // Post form data to backend
      const response = await axios.post("http://localhost:5000/api/hsc", formDataHsc);

      const data = response.data;

      if (data.success) {
        setMessage(" Form submitted successfully!");
        
        handleClear(); // Clear the form after successful submission

        await axios.put(`http://localhost:5000/api/visibility/${username}`, {
          hscSubmitted: true,
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

  return (
    <div className="profile-c">
      <h3 className="">HSC/Diploma Information</h3>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Hall Ticket Number</label>
            <input
              type="text"
              value={hcn}
              onChange={(e) => setHcn(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Institution Name</label>
            <input
              type="text"
              value={collage}
              onChange={(e) => setCollage(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Course</label>
            <select
              type="text"
              value={course_hsc_diploma}
              onChange={(e) => setCourse_hsc_diploma(e.target.value)}
            >
              <option value="Diploma">Diploma</option>
              <option value="HSC">HSC</option>
            </select>
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

          <div className="form-group">
            <label>Gap</label>
            <select
              type="text"
              value={gap}
              onChange={(e) => setGap(e.target.value)}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Starting Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Year</label>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="select">Select Year</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="complete">Complete</option>
            </select>
          </div>
          <div className="form-group">
            <label>Graduation Date </label>
            <input
              type="date"
              value={graduateDate}
              onChange={(e) => setGraduateDate(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
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
          <label>Final Year Mark sheet (Original Pdf)</label>
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

export default HscDiplomaForm;
