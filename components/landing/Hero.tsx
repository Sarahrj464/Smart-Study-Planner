"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium border border-blue-100 dark:border-blue-800">
                        <Sparkles size={14} />
                        <span>New: AI-Powered Study Planner is here</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                        Your Daily Rhythm for <span className="text-blue-600">Smarter Studying.</span>
                    </h1>

                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                        The all-in-one productivity suite for students. Pomodoro timers, collaborative study rooms, and personalized analytics.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 max-w-md">
                            <input
                                type="email"
                                placeholder="Enter your university email"
                                className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                            />
                        </div>
                        <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group">
                            Start for Free
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <p className="text-sm text-slate-500">
                        No credit card required. Join 50,000+ students today.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                >
                    <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl opacity-50 rounded-[3rem]" />
                    <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden aspect-[4/3] flex items-center justify-center p-8">
                        {/* Dashboard Mockup Content placeholder */}
                        <div className="w-full h-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center space-y-4">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
                                <Sparkles size={32} />
                            </div>
                            <div className="space-y-2 text-center">
                                <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto" />
                                <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700/50 rounded-full mx-auto" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 w-full max-w-md px-8 pt-4">
                                <div className="h-20 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700" />
                                <div className="h-20 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
