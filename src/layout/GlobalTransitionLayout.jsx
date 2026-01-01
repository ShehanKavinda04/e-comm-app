import { AnimatePresence, motion } from "framer-motion";
import { useLocation, Outlet } from "react-router-dom";

const GlobalTransitionLayout = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full h-full"
            >
                <Outlet />
            </motion.div>
        </AnimatePresence>
    );
};

export default GlobalTransitionLayout;
