import React ,{ useEffect, useState } from "react";
import axios from "axios";

export default function EventModal() {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:3000/events");
      setEvents(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="space-y-4">
      {events.length === 0 ? (
        <p className="text-gray-500">No events found.</p>
      ) : (
        events.map((event) => (
          <div key={event.id} className="p-4 border rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold">{event.summary}</h3>
            <p>{event.start?.dateTime} - {event.end?.dateTime}</p>
          </div>
        ))
      )}
    </div>
  );
}