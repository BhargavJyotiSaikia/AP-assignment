import { useState } from "react";
import './styles.css';  

function CourseEnrollmentDashboard() {
  const [studentsMap, setStudentsMap] = useState(new Map());
  const [name, setName] = useState("");
  const [gpa, setGpa] = useState("");
  const [coursesInput, setCoursesInput] = useState("");
  const [filterCourse, setFilterCourse] = useState("");

  const addStudent = () => {
    if (!name || !gpa) return;

    const newId = Date.now();

    const enrolledCourses = new Set(
      coursesInput
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c.length > 0)
    );

    const newStudent = {
      id: newId,
      name,
      enrolledCourses,
      gpa: parseFloat(gpa),
    };

    const updatedMap = new Map(studentsMap);
    updatedMap.set(newId, newStudent);
    setStudentsMap(updatedMap);

    setName("");
    setGpa("");
    setCoursesInput("");
  };

  const removeStudent = (id) => {
    const updatedMap = new Map(studentsMap);
    updatedMap.delete(id);
    setStudentsMap(updatedMap);
  };

  const studentsArray = Array.from(studentsMap.values());

  const sortedStudents = [...studentsArray].sort(
    (a, b) => b.gpa - a.gpa
  );

  const filteredStudents = filterCourse
    ? sortedStudents.filter((student) =>
        student.enrolledCourses.has(filterCourse)
      )
    : sortedStudents;

  const n = studentsArray.length;
  const filteringTimeComplexity = `O(n) where n = ${n}`;

  const uniqueCourses = studentsArray.reduce((acc, student) => {
    student.enrolledCourses.forEach((course) => acc.add(course));
    return acc;
  }, new Set());

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Course Enrollment Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <input
          className="border p-2 rounded"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="GPA"
          type="number"
          step="0.01"
          value={gpa}
          onChange={(e) => setGpa(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Courses (comma separated)"
          value={coursesInput}
          onChange={(e) => setCoursesInput(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white rounded p-2"
          onClick={addStudent}
        >
          Add Student
        </button>
      </div>

      <div className="mb-4">
        <input
          className="border p-2 rounded"
          placeholder="Filter by Course"
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Students (Sorted by GPA)
        </h2>

        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="border rounded p-3 mb-2 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{student.name}</p>
              <p>GPA: {student.gpa}</p>
              <p>
                Courses:{" "}
                {Array.from(student.enrolledCourses).join(", ")}
              </p>
            </div>

            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => removeStudent(student.id)}
            >
              Remove
            </button>
          </div>
        ))}

        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p className="font-semibold">
            Filtering Time Complexity:
          </p>
          <p>{filteringTimeComplexity}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">
          All Unique Courses
        </h2>

        <ul className="list-disc pl-6">
          {Array.from(uniqueCourses).map((course, index) => (
            <li key={index}>{course}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CourseEnrollmentDashboard;