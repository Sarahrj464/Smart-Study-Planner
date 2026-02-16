"use client";

import { motion } from "framer-motion";

const ScrollReveal = ({
    children,
    direction = "up",
    delay = 0,
    duration = 0.6,
    distance = 40,
    className = ""
}) => {
    const variants = {
        hidden: {
            opacity: 0,
            x: direction === "left" ? -distance : direction === "right" ? distance : 0,
            y: direction === "up" ? distance : direction === "down" ? -distance : 0,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                duration: duration,
                delay: delay,
                ease: [0.21, 0.47, 0.32, 0.98], // Custom cubic bezier for a more premium feel
            },
        },
    };

    return (
        <motion.div
            className={className}
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-100px" }}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
