import { useState } from "react";
import TaskBoard from "./components/TaskBoard";
import Navbar from "./components/Navbar";
import NewTaskForm from "./components/NewTaskForm";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTaskCreated = () => {
    setShowForm(false);
    // Trigger refresh by updating the refreshTrigger value
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />
      <div className="container mx-auto p-4">
        {/* Pass refreshTrigger to TaskBoard */}
        <TaskBoard refreshTrigger={refreshTrigger} />
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setShowForm(true)}
        title="Create New Task"
      >
        <PencilSquareIcon className="h-7 w-7" />
      </button>

      {/* Modal Overlay for New Task Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              aria-label="Close"
            >
              ×
            </button>
            <NewTaskForm onTaskCreated={handleTaskCreated} />
          </div>
        </div>
      )}
    </div>
  );
}
