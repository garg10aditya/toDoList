import { useState, useRef, useEffect } from "react";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import ReactDOM from "react-dom";
import { format } from "date-fns";

const getBorderColor = (status) => {
  switch (status) {
    case "To Do":
      return "border-b-8 border-green-500";
    case "In Progress":
      return "border-b-8 border-yellow-400";
    case "Done":
      return "border-b-8 border-red-500";
    default:
      return "border-b-8 border-gray-300";
  }
};

const typeOptions = ["To Do", "In Progress", "Done"];

export default function TaskCard({ task, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...task });
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [color, setColor] = useState(task.bgColor || "#ffffff");
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuButtonRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuButtonRef.current && !menuButtonRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleColorChange = async (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    try {
      await onEdit(task._id, { ...task, bgColor: newColor });
      setEditedData((prev) => ({ ...prev, bgColor: newColor }));
    } catch (err) {
      setError("Failed to update color");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onEdit(task._id, editedData);
      setIsEditing(false);
      setMenuOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    setMenuOpen(false);
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await onDelete(task._id);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleTypeChange = async (newType) => {
    setMenuOpen(false);
    try {
      await onEdit(task._id, { ...task, status: newType });
    } catch (err) {
      setError("Failed to update type");
    }
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY + 8,
    });
    setMenuOpen(true);
  };

  const borderColorClass = getBorderColor(task.status);
  const cardBg = color || "#ffffff";

  const ExpandedModal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={() => setExpanded(false)}
      />
      <div
        className={`relative rounded-xl shadow-2xl p-8 w-11/12 max-w-2xl ${borderColorClass}`}
        style={{ background: cardBg, zIndex: 60 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-700"
          onClick={() => setExpanded(false)}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">{task.title}</h2>
          <div className="flex items-center space-x-4 text-sm">
            <span className="px-3 py-1 font-medium text-gray-700 bg-gray-100 rounded-full">
              {task.status}
            </span>
            <span className="text-gray-500">
              Created:{" "}
              {task.createdAt
                ? format(new Date(task.createdAt), "MMMM do yyyy, h:mm a")
                : "N/A"}
            </span>
          </div>
          {task.description && (
            <div className="prose max-w-none">
              <p className="text-gray-700">{task.description}</p>
            </div>
          )}
          <div className="pt-6 mt-6 border-t border-gray-200">
            <label className="block mb-4 text-sm font-medium text-gray-700">
              Card Background Color
            </label>
            <input
              type="color"
              value={color}
              onChange={handleColorChange}
              className="w-16 h-10 p-1 bg-white border-2 border-gray-300 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const MenuDropdown = () => (
    <div
      className="fixed w-48 bg-white rounded-lg shadow-xl border z-50"
      style={{
        left: menuPosition.x,
        top: menuPosition.y,
      }}
      ref={menuButtonRef}
    >
      <div className="p-2">
        <button
          onClick={() => {
            setIsEditing(true);
            setMenuOpen(false);
          }}
          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
        >
          <PencilIcon className="w-4 h-4 mr-2" />
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md"
        >
          <TrashIcon className="w-4 h-4 mr-2" />
          Delete
        </button>
      </div>
      <div className="border-t p-2">
        <div className="px-3 py-2 text-xs font-medium text-gray-500">
          Change Status
        </div>
        {typeOptions.map((type) => (
          <button
            key={type}
            onClick={() => handleTypeChange(type)}
            className={`flex w-full items-center px-4 py-2 text-sm rounded-md ${
              task.status === type
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <CheckCircleIcon
              className={`w-4 h-4 mr-2 ${
                task.status === type ? "text-blue-500" : "opacity-0"
              }`}
            />
            {type}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div
        className={`relative mb-4 rounded-xl shadow-lg transition-all cursor-pointer ${borderColorClass}`}
        style={{
          background: cardBg,
          minWidth: "300px",
          minHeight: "180px",
        }}
      >
        {error && (
          <div className="px-4 py-2 text-sm text-red-600 bg-red-50 rounded-t-xl">
            ⚠️ {error}
          </div>
        )}

        <div className="absolute top-3 right-3 z-10 flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(true);
            }}
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
            title="View Details"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          <button
            ref={menuButtonRef}
            onClick={handleMenuClick}
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
            title="Options"
          >
            <EllipsisVerticalIcon className="w-6 h-6" />
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="p-4">
            <input
              type="text"
              value={editedData.title}
              onChange={(e) =>
                setEditedData({ ...editedData, title: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Task title"
              required
            />
            <textarea
              value={editedData.description}
              onChange={(e) =>
                setEditedData({ ...editedData, description: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Description"
              rows="3"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditedData({ ...task });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="h-full flex flex-col p-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-gray-600 line-clamp-3 mb-4">
                {task.description}
              </p>
            )}
            <div className="mt-auto">
              <div className="flex items-center justify-between text-sm">
                <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                  {task.status}
                </span>
                <span className="text-gray-500">
                  {task.createdAt &&
                    format(new Date(task.createdAt), "MMM dd, HH:mm")}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {menuOpen && ReactDOM.createPortal(<MenuDropdown />, document.body)}

      {expanded &&
        ReactDOM.createPortal(
          ExpandedModal,
          document.getElementById("modal-root") || document.body
        )}
    </>
  );
}
