import React, { useState, useEffect } from "react";
import { X, Save, Terminal, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateTodo } from "../utils/api";
import toast from "react-hot-toast";

const TodoEditModal = ({ isOpen, onClose, todo, onUpdateSuccess }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");

  // Pre-fill form fields when the note to edit changes
  useEffect(() => {
    if (todo) {
      setTitle(todo.title || "");
      setContent(todo.content || "");
      setTitleError("");
      setContentError("");
    }
  }, [todo]);

  if (!isOpen || !todo) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTitleError("");
    setContentError("");

    let hasError = false;
    if (!title.trim()) {
      setTitleError("A title is required");
      hasError = true;
    } else if (title.length > 50) {
      setTitleError("Title cannot exceed 50 characters");
      hasError = true;
    }

    if (!content.trim()) {
      setContentError("Details/content is required");
      hasError = true;
    } else if (content.length > 2000) {
      setContentError("Content cannot exceed 2000 characters");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    const loadId = toast.loading("Updating note...");

    try {
      const data = await updateTodo(todo._id, title.trim(), content.trim());
      // The backend returns: { "msg": "Todo edited Successfully...!", editedTodo }
      if (data.editedTodo) {
        onUpdateSuccess(data.editedTodo);
        toast.success("Note updated successfully!", { id: loadId });
        onClose();
      } else {
        toast.error("Failed to parse updated note from server.", { id: loadId });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Failed to update note. Try again.", { id: loadId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs"
        />

        {/* Modal container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: "spring", duration: 0.35 }}
          className="relative w-full max-w-2xl bg-app-card border border-app-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-app-border bg-app-bg-secondary/20">
            <h3 className="text-lg font-bold text-app-text">
              Edit Note
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border border-app-border text-app-text-secondary hover:text-app-text hover:bg-app-bg-secondary transition-colors cursor-pointer"
              aria-label="Close modal"
              disabled={loading}
            >
              <X size={16} />
            </button>
          </div>

          {/* Form wrapper */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto flex-grow space-y-4">
              <div>
                <label
                  className="block text-[10px] font-bold uppercase tracking-wider text-app-text-secondary mb-1.5"
                  htmlFor="edit-title"
                >
                  Title
                </label>
                <div className="relative flex items-center">
                  <Terminal
                    size={15}
                    className="absolute left-3.5 text-app-text-secondary pointer-events-none"
                  />
                  <input
                    id="edit-title"
                    type="text"
                    required
                    maxLength={50}
                    className={`custom-input ${
                      titleError ? "border-app-danger/50 focus:ring-app-danger/10" : ""
                    }`}
                    placeholder="Note heading..."
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (titleError) setTitleError("");
                    }}
                    disabled={loading}
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  {titleError ? (
                    <span className="text-[11px] text-app-danger font-medium">{titleError}</span>
                  ) : (
                    <span />
                  )}
                  <span className="text-[10px] text-app-text-secondary font-medium">
                    {title.length}/50
                  </span>
                </div>
              </div>

              <div>
                <label
                  className="block text-[10px] font-bold uppercase tracking-wider text-app-text-secondary mb-1.5"
                  htmlFor="edit-content"
                >
                  Details
                </label>
                <textarea
                  id="edit-content"
                  required
                  maxLength={2000}
                  className={`custom-textarea ${
                    contentError ? "border-app-danger/50 focus:ring-app-danger/10" : ""
                  }`}
                  placeholder="Write details of your note..."
                  rows={8}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (contentError) setContentError("");
                  }}
                  disabled={loading}
                />
                <div className="flex justify-between items-center mt-1">
                  {contentError ? (
                    <span className="text-[11px] text-app-danger font-medium">{contentError}</span>
                  ) : (
                    <span />
                  )}
                  <span className="text-[10px] text-app-text-secondary font-medium">
                    {content.length}/2000
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-app-border bg-app-bg-secondary/10 flex items-center justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold border border-app-border text-app-text-secondary hover:text-app-text hover:bg-app-bg-secondary rounded-xl transition-all cursor-pointer"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold bg-app-accent hover:opacity-90 text-white rounded-xl shadow-md flex items-center gap-1.5 active:scale-98 transition-all cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    <Save size={14} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TodoEditModal;
