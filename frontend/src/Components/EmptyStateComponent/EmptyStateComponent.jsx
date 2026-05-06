import { motion } from "framer-motion";
import { FolderPlus, Layers3 } from "lucide-react";

export default function EmptyState({type = "projects"}) {
  const config = {
    projects: {
      title: "No Projects Yet",
      description: "Start by creating new project.",
      icon: <Layers3 size={64} className="text-blue-600" />,
    },
    features: {
      title: "No Features Yet",
      description: "Start by creating a new feature for this project.",
      icon: <FolderPlus size={64} className="text-blue-600" />,
    },
  };
  const { title, description, icon } = config[type];

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-10">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="mb-6"
      >
        {icon}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl font-semibold"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-gray-500 mt-2"
      >
        {description}
      </motion.p>
    </div>
  );
}