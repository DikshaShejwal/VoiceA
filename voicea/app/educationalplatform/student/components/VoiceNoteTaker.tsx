"use client";
import React, { useState, useRef, useEffect } from "react";

interface VoiceNote {
  id: number;
  text: string;
  timestamp: string;
}

interface Reminder {
  id: number;
  text: string;
  time: string;
}

const VoiceNoteTaker = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<VoiceNote[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [reminderText, setReminderText] = useState("");

  const recognitionRef = useRef<any>(null); // <-- Ensure this is inside your component

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("voiceNotes") || "[]");
    setNotes(savedNotes);

    const savedReminders = JSON.parse(localStorage.getItem("reminders") || "[]");
    setReminders(savedReminders);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition API not supported in this browser.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setNoteText(prev => prev + transcript + " ");
        } else {
          interimTranscript += transcript;
        }
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error", event);
      setIsRecording(false);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
    };
  }, []);

  const startRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const saveNote = () => {
    if (!noteText.trim()) return;

    const newNote: VoiceNote = {
      id: Date.now(),
      text: noteText.trim(),
      timestamp: new Date().toLocaleString(),
    };
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem("voiceNotes", JSON.stringify(updatedNotes));
    setNoteText("");
  };

  const setReminder = () => {
    if (!reminderText.trim()) return;

    const newReminder: Reminder = {
      id: Date.now(),
      text: reminderText.trim(),
      time: new Date().toLocaleTimeString(),
    };
    const updatedReminders = [newReminder, ...reminders];
    setReminders(updatedReminders);
    localStorage.setItem("reminders", JSON.stringify(updatedReminders));
    setReminderText("");
  };

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white rounded-xl shadow">
      <h1 className="text-xl font-bold mb-4">Voice Note Taker</h1>

      <div className="mb-4">
        <textarea
          className="w-full p-2 border rounded"
          rows={4}
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          placeholder="Your voice note will appear here..."
        ></textarea>
      </div>

      <div className="flex space-x-2 mb-4">
        <button
          onClick={startRecording}
          disabled={isRecording}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Start Recording
        </button>
        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Stop
        </button>
        <button
          onClick={saveNote}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save Note
        </button>
      </div>

      <h2 className="text-lg font-semibold mt-6 mb-2">Reminders</h2>
      <div className="flex mb-4">
        <input
          type="text"
          className="w-full p-2 border rounded-l"
          value={reminderText}
          onChange={e => setReminderText(e.target.value)}
          placeholder="Set a reminder..."
        />
        <button
          onClick={setReminder}
          className="bg-purple-500 text-white px-4 py-2 rounded-r"
        >
          Add
        </button>
      </div>

      <ul className="list-disc pl-5 space-y-1">
        {reminders.map(reminder => (
          <li key={reminder.id}>
            {reminder.text} <span className="text-gray-500 text-sm">({reminder.time})</span>
          </li>
        ))}
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2">Saved Notes</h2>
      <ul className="list-disc pl-5 space-y-2">
        {notes.map(note => (
          <li key={note.id}>
            <strong>{note.timestamp}:</strong> {note.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VoiceNoteTaker;
