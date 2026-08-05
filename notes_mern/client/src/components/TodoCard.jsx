import React from "react";
import { Calendar, ArrowUpRight, FileText, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const TodoCard = ({ todo, onClick, onEdit, onDelete, index }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: Math.min(index * 0.05, 0.5),
      },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="group flex flex-col justify-between h-[210px] p-5 bg-app-card border border-app-border rounded-2xl shadow-xs hover:shadow-xl hover:shadow-indigo-500/5 hover:border-app-accent/40 transition-all duration-300 cursor-pointer overflow-hidden relative"
    >
      {/* Background soft glow decoration on hover */}
      <div className="absolute inset-0 bg-radial-gradient from-app-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex-1 min-w-0">
        {/* Note header: Title & Actions */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-base font-bold text-app-text group-hover:text-app-accent transition-colors duration-200 truncate pr-2">
            {todo.title || "Untitled"}
          </h4>
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Edit Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(todo);
              }}
              className="p-1 rounded-lg hover:bg-app-bg-secondary text-app-text-secondary hover:text-app-accent transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
              title="Edit Note"
            >
              <Pencil size={13} />
            </button>
            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(todo);
              }}
              className="p-1 rounded-lg hover:bg-app-danger/10 text-app-text-secondary hover:text-app-danger transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
              title="Delete Note"
            >
              <Trash2 size={13} />
            </button>
            {/* View Arrow icon */}
            <span className="text-app-accent opacity-60 group-hover:opacity-100 transition-opacity duration-200">
              <ArrowUpRight size={15} />
            </span>
          </div>
        </div>

        {/* Note body excerpt */}
        <p className="text-xs text-app-text-secondary leading-relaxed line-clamp-5 break-words">
          {todo.content || "No details provided."}
        </p>
      </div>

      {/* Note footer */}
      <div className="flex items-center justify-between pt-3 mt-4 border-t border-app-border text-[10px] font-semibold text-app-text-secondary">
        <span className="flex items-center gap-1">
          <Calendar size={11} className="opacity-60" />
          {formatDate(todo.createdAt || todo.updatedAt)}
        </span>
        <span className="flex items-center gap-1 text-app-accent opacity-60 group-hover:opacity-100 transition-opacity">
          <FileText size={10} />
          Read full
        </span>
      </div>
    </motion.div>
  );
};

export default TodoCard;
