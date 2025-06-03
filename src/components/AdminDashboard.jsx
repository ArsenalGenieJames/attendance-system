import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [displayEventForm, setDisplayEventForm] = useState(false);
  const [eventList, setEventList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [filterText, setFilterText] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from("events").select("*");
      if (error) console.error(error);
      else setEventList(data);
    };

    const fetchStudents = async () => {
      const { data, error } = await supabase.from("students").select("*");
      if (error) console.error(error);
      else setStudentList(data);
    };

    fetchEvents();
    fetchStudents();
  }, []);

  const handleCreateEvent = async (event) => {
    event.preventDefault();
    const { eventName, eventDate, location, eventStart, eventEnd } = event.target;
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    const adminId = user?.id;

    const { error } = await supabase.from("events").insert([
      {
        event_name: eventName.value,
        date: eventDate.value,
        location: location.value,
        admin_id: adminId,
        event_start: eventStart.value,
        event_end: eventEnd.value,
        status: "active", // Assuming a default status for new events
      },
    ]);

    if (error) console.error(error);
    else {
      eventName.value = "";
      eventDate.value = "";
      location.value = "";
      eventStart.value = "";
      eventEnd.value = "";
      setDisplayEventForm(false); // Close the form after submission
    }
  };

  const handleActivateEvent = async (eventId) => {
    const { error } = await supabase.from("events").update({ status: "active" }).eq("event_id", eventId);
    if (error) console.error(error);
    else {
      // Optionally, refresh the event list to reflect the status change
      const { data, error: refreshError } = await supabase.from("events").select("*");
      if (error) console.error(refreshError);
      else setEventList(data);
    }
  };

  const handleTimeoutEvent = async (eventId) => {
    const { error } = await supabase.from("events").update({ status: "timeout" }).eq("event_id", eventId);
    if (error) console.error(error);
    else {
      // Optionally, refresh the event list to reflect the status change
      const { data, error: refreshError } = await supabase.from("events").select("*");
      if (error) console.error(refreshError);
      else setEventList(data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="hidden lg:flex space-x-4">
            <button className="hover:text-gray-400" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Section Navigation */}
      <div className="container mx-auto mt-10">
        <div className="bg-green-500 uppercase p-3 rounded-md shadow-md">
          <div className="flex space-x-4">
            <button className="cursor-pointer hover:underline">Student List</button>
            <button
              className="cursor-pointer hover:underline"
              onClick={() => setDisplayEventForm(!displayEventForm)}
            >
              Event
            </button>
          </div>
        </div>
      </div>

      {/* Student List (Always Displayed) */}
      <div className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-semibold">Student List</h2>
          <input
            type="text"
            placeholder="Search Student..."
            className="ml-4 w-96 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Course (Year)</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Phone Number</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Present</th>
              <th className="text-left p-4">Time In</th>
              <th className="text-left p-4">Time Out</th>
              <th className="text-left p-4">Present Out</th>
            </tr>
          </thead>
          <tbody>
            {studentList.filter(student => 
              student.name.toLowerCase().includes(filterText.toLowerCase()) ||
              student.course.toLowerCase().includes(filterText.toLowerCase()) ||
              student.email.toLowerCase().includes(filterText.toLowerCase()) ||
              student.phone_number.toLowerCase().includes(filterText.toLowerCase())
            ).map((student) => (
              <tr key={student.id} className="bg-gray-200">
                <td className="p-4">{student.name}</td>
                <td className="p-4">{student.course} ({student.year} year)</td>
                <td className="p-4">{student.email}</td>
                <td className="p-4">{student.phone_number}</td>
                <td className="p-4">{student.date ? new Date(student.date).toLocaleDateString() : 'N/A'}</td>
                <td className="p-4">{student.present || 'N/A'}</td>
                <td className="p-4">{student.time_in ? new Date(student.time_in).toLocaleTimeString() : 'N/A'}</td>
                <td className="p-4">{student.time_out ? new Date(student.time_out).toLocaleTimeString() : 'N/A'}</td>
                <td className="p-4">{student.present_out || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Event Section (Displays when clicking "Event") */}
      {displayEventForm && (
        <div className="container mx-auto mt-10 mb-10 p-6 bg-white shadow-md rounded-md">
          {/* Event Form */}
          <h2 className="text-lg font-semibold mb-4">Create Event</h2>
          <form onSubmit={handleCreateEvent} className="space-y-4 flex flex-wrap justify-between">
            <div className="w-1/2 pr-4">
              <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">Event Name</label>
              <input type="text" name="eventName" id="eventName" className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div className="w-1/2 pl-4">
              <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">Event Date</label>
              <input type="date" name="eventDate" id="eventDate" className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div className="w-1/2 pr-4">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" name="location" id="location" className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div className="w-1/2 pl-4">
              <label htmlFor="eventStart" className="block text-sm font-medium text-gray-700">Event Start Time</label>
              <input type="datetime-local" name="eventStart" id="eventStart" className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div className="w-1/2 pr-4">
              <label htmlFor="eventEnd" className="block text-sm font-medium text-gray-700">Event End Time</label>
              <input type="datetime-local" name="eventEnd" id="eventEnd" className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div className="w-full">
              <button type="submit" className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500">
                Create Event
              </button>
            </div>
          </form>

          {/* Event Grid */}
          <h2 className="text-lg font-semibold mt-6">Event List</h2>
          <div className="mt-4">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-4 text-left">Event Name</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Location</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Start Time</th>
                  <th className="p-4 text-left">End Time</th>
                  <th className="p-4 text-left">Activate</th>
                  <th className="p-4 text-left">Timeout</th>
                </tr>
              </thead>
              <tbody>
                {eventList.map((event) => (
                  <tr key={event.event_id} className="bg-blue-200">
                    <td className="p-4 font-medium">{event.event_name}</td>
                    <td className="p-4">{event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}</td>
                    <td className="p-4">{event.location}</td>
                    <td className="p-4">{event.status || "N/A"}</td>
                    <td className="p-4">{event.event_start ? new Date(event.event_start).toLocaleTimeString() : 'N/A'}</td>
                    <td className="p-4">{event.event_end ? new Date(event.event_end).toLocaleTimeString() : 'N/A'}</td>
                    <td className="p-4">
                      <button onClick={() => handleActivateEvent(event.event_id)} className="bg-green-500 text-white py-2 px-4 rounded-md">
                        {event.status === 'active' ? 'Event Starting' : 'Activate'}
                      </button>
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleTimeoutEvent(event.event_id)} className="bg-red-500 text-white py-2 px-4 rounded-md">
                        Timeout
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        
      )}
    </div>
  );
}

export default AdminDashboard;
