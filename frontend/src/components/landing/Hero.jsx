import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import heroImage from '../../assets/hero.png';
import blackHeroImage from '../../assets/black-hero.png';

const Hero = ({ onOpenAuth }) => {
    const { darkMode } = useSelector((state) => state.theme);
    const [emailInput, setEmailInput] = useState('');
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const imageVariants = {
        hidden: { opacity: 0, x: 50, scale: 0.95 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut", delay: 0 }
        }
    };

    return (
        <section ref={sectionRef} className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-[#EDF5FF] via-[#F8FBFF] to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
            {/* Soft Ambient Glows for Calm Feel */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-100/50 dark:bg-blue-900/20 blur-[120px] rounded-full -z-10 mix-blend-multiply dark:mix-blend-screen transition-colors" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-indigo-100/50 dark:bg-indigo-900/20 blur-[100px] rounded-full -z-10 mix-blend-multiply dark:mix-blend-screen transition-colors" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-12 pt-8"
                    >
                        <div className="space-y-8">
                            <motion.h1
                                variants={itemVariants}
                                className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-[1.05]"
                            >
                                Master your rhythm. <br />
                                <span className="text-[#2563EB] dark:text-blue-400">Ace your life.</span>
                            </motion.h1>

                            <motion.p
                                variants={itemVariants}
                                className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium max-w-xl"
                            >
                                StudyPulse combines intelligent scheduling, focus tracking, and peer accountability into one seamless platform. Built for the modern student.
                            </motion.p>
                        </div>

                        {/* Integrated Search/Email Bar */}
                        <motion.div
                            variants={itemVariants}
                            className="relative w-full max-w-2xl group"
                        >
                            <div className="absolute -inset-1 bg-blue-600/15 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
                            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-300 dark:border-slate-700 shadow-2xl shadow-blue-500/10 gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your student email"
                                    className="flex-1 h-12 sm:h-14 px-6 bg-transparent outline-none text-slate-900 dark:text-white font-medium placeholder:text-slate-400 text-base sm:text-lg"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                />
                                <button
                                    onClick={() => onOpenAuth('signup', emailInput)}
                                    className="h-12 sm:h-14 px-6 sm:px-8 bg-[#2563EB] text-white font-black rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs sm:text-sm whitespace-nowrap shadow-lg shadow-blue-500/25 active:scale-95"
                                >
                                    Start for Free
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </motion.div>

                        {/* Download App Links */}
                        <motion.div
                            variants={itemVariants}
                            className="space-y-6 pt-8"
                        >
                            <p className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Available Everywhere</p>
                            <div className="flex flex-wrap gap-6">
                                <a href="https://apps.apple.com/app/studypulse" target="_blank" rel="noopener noreferrer" className="group/app flex items-center gap-4 px-8 py-4 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-900/20 active:scale-95">
                                    <div className="w-6 h-6 flex items-center justify-center transition-transform group-hover/app:scale-110">
                                        <svg viewBox="0 0 384 512" width="22" height="22" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-39-19.9-54.7-46-54.7-83.9z" /></svg>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] leading-none opacity-50 uppercase tracking-tighter font-bold">Download on</p>
                                        <p className="font-extrabold leading-none text-base mt-1">Apple Store</p>
                                    </div>
                                </a>
                                <a href="https://play.google.com/store/apps/details?id=com.studypulse" target="_blank" rel="noopener noreferrer" className="group/app flex items-center gap-4 px-8 py-4 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-900/20 active:scale-95">
                                    <div className="w-6 h-6 flex items-center justify-center transition-transform group-hover/app:scale-110">
                                        <svg viewBox="0 0 512 512" width="22" height="22" fill="currentColor"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" /></svg>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] leading-none opacity-50 uppercase tracking-tighter font-bold">GET IT ON</p>
                                        <p className="font-extrabold leading-none text-base mt-1">Google Play</p>
                                    </div>
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Hero Image */}
                    <motion.div
                        variants={imageVariants}
                        initial="hidden"
                        animate="visible"
                        className="relative lg:block hidden -mt-20"
                    >
                        <div className="relative">
                            {/* Main image with pure opacity blending */}
                            <motion.img
                                key={darkMode ? 'dark' : 'light'}
                                src={darkMode ? blackHeroImage : heroImage}
                                alt="StudyPulse App - Students using timer and task management"
                                className="relative w-full h-auto opacity-95"
                                style={{
                                    filter: 'brightness(1.02) saturate(1.05)',
                                    willChange: 'transform, opacity'
                                }}
                                whileHover={{ scale: 1.02, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            />
                            {/* Hidden preloader for the other theme image */}
                            <img
                                src={darkMode ? heroImage : blackHeroImage}
                                alt=""
                                className="hidden"
                                aria-hidden="true"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
