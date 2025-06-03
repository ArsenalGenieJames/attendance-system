import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AttendanceForm = () => {
  const [studentId, setStudentId] = useState('');
  const [course, setCourse] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [year, setYear] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [eventStatus, setEventStatus] = useState(null);

  const courses = [
    { id: 'bsit', name: 'Bachelor of Science in Information Technology' },
    { id: 'bscs', name: 'Bachelor of Science in Computer Science' },
    { id: 'bscpe', name: 'Bachelor of Science in Computer Engineering' },
    { id: 'bsee', name: 'Bachelor of Science in Electrical Engineering' },
    { id: 'bscivil', name: 'Bachelor of Science in Civil Engineering' },
    { id: 'bsme', name: 'Bachelor of Science in Mechanical Engineering' },
    { id: 'bsie', name: 'Bachelor of Science in Industrial Engineering' },
    { id: 'bsce', name: 'Bachelor of Science in Chemical Engineering' },
    { id: 'bsarch', name: 'Bachelor of Science in Architecture' },
    { id: 'bsa', name: 'Bachelor of Science in Accountancy' },
    { id: 'bsba', name: 'Bachelor of Science in Business Administration' },
    { id: 'bsn', name: 'Bachelor of Science in Nursing' },
    { id: 'bspharm', name: 'Bachelor of Science in Pharmacy' },
    { id: 'bsmedtech', name: 'Bachelor of Science in Medical Technology' },
    { id: 'bspt', name: 'Bachelor of Science in Physical Therapy' },
    { id: 'bsot', name: 'Bachelor of Science in Occupational Therapy' },
    { id: 'bspsych', name: 'Bachelor of Science in Psychology' },
    { id: 'bsbio', name: 'Bachelor of Science in Biology' },
    { id: 'bschem', name: 'Bachelor of Science in Chemistry' },
    { id: 'bsmath', name: 'Bachelor of Science in Mathematics' },
    { id: 'bsstat', name: 'Bachelor of Science in Statistics' },
    { id: 'bsphysics', name: 'Bachelor of Science in Physics' }
  ];

  useEffect(() => {
    checkEventStatus();
  }, []);

  const checkEventStatus = async () => {
    try {
      const { data: events, error: eventError } = await supabase
        .from('events')
        .select('status')
        .eq('status', 'active');

      if (eventError) throw eventError;

      // If there's at least one active event
      if (events && events.length > 0) {
        setEventStatus('active');
      } else {
        setEventStatus('inactive');
      }
    } catch (error) {
      console.error('Error checking event status:', error);
      setError('Error checking event status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (eventStatus !== 'active') {
      setError('Event is not active. Please try again later.');
      setLoading(false);
      return;
    }

    try {
      // Check if student has already marked attendance today
      const today = new Date().toISOString().split('T')[0];
      const { data: existingAttendance, error: checkError } = await supabase
        .from('students')
        .select('*')
        .eq('student_id', studentId)
        .eq('date', today);

      if (checkError) throw checkError;

      if (existingAttendance && existingAttendance.length > 0) {
        setError('You have already marked your attendance for today!');
        setLoading(false);
        return;
      }

      // Check if the phone number is already in use
      const { data: existingPhoneNumber, error: phoneError } = await supabase
        .from('students')
        .select('phone_number')
        .eq('phone_number', phoneNumber);

      if (phoneError) throw phoneError;

      if (existingPhoneNumber && existingPhoneNumber.length > 0) {
        setError('This phone number is already in use. Please use a different phone number.');
        setLoading(false);
        return;
      }

      // If no attendance marked for today and phone number is not in use, proceed with marking attendance
      const { error } = await supabase
        .from('students')
        .insert([
          {
            student_id: studentId,
            name: name,
            phone_number: phoneNumber,
            email: email,
            course: course,
            year: year,
            date: today,
            time_in: new Date().toISOString(),
            status: 'present'
          }
        ]);

      if (error) throw error;
      setSuccess(true);
      setStudentId('');
      setCourse('');
      setPhoneNumber('');
      setEmail('');
      setYear('');
      setName('');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">CSS Attendance</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Attendance marked successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="studentId" className="block text-gray-700 text-sm font-bold mb-2">
            Student ID
          </label>
          <input
            type="text"
            id="studentId"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="year" className="block text-gray-700 text-sm font-bold mb-2">
            Year
          </label>
          <select
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a year</option>
            <option value="1">First Year</option>
            <option value="2">Second Year</option>
            <option value="3">Third Year</option>
            <option value="4">Fourth Year</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="course" className="block text-gray-700 text-sm font-bold mb-2">
            Course
          </label>
          <select
            id="course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || eventStatus !== 'active'}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        >
          {loading ? 'Marking Attendance...' : 'Present'}
        </button>
      </form>
    </div>
  );
};

export default AttendanceForm;