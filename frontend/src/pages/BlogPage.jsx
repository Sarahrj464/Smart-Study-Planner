import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { blogService } from '../redux/api/blogService';
import { BookOpen, User as UserIcon, Calendar, ArrowRight, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const BlogPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await blogService.getBlogs();
            setBlogs(res.data);
        } catch (err) {
            toast.error('Failed to load blogs');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        toast.promise(
            new Promise((resolve) => resolve()),
            {
                loading: 'Preparing your guide...',
                success: 'StudyPulse Productivity Guide Downloaded! 📚',
                error: 'Download failed',
            }
        );
    };

    const handleCreatePost = () => {
        toast.success('Opening blogger studio... (Experimental Feature)');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                        Community <span className="text-blue-600">Blog</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-lg font-bold">
                        Learn from the experiences of fellow students and share your own productivity secrets.
                    </p>
                </div>
                {user && (
                    <button
                        onClick={handleCreatePost}
                        className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95"
                    >
                        <Plus size={20} />
                        Post Something
                    </button>
                )}
            </header>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.length > 0 ? (
                        blogs.map((blog) => (
                            <BlogCard key={blog._id} blog={blog} />
                        ))
                    ) : (
                        <div className="col-span-full py-32 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center space-y-6 shadow-sm">
                            <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-3xl text-blue-600">
                                <BookOpen size={64} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white">No posts found</h3>
                                <p className="text-slate-500 font-bold max-w-xs">Be the first to share a story with the community!</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Recommended Reading */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-8 md:p-16 text-white overflow-hidden relative shadow-2xl shadow-blue-500/20">
                <div className="relative z-10 space-y-6 max-w-2xl">
                    <h3 className="text-4xl font-black tracking-tight leading-tight">StudyPulse Productivity Guide</h3>
                    <p className="text-blue-100 leading-relaxed font-bold text-lg">
                        Download our curated guide on how to balance academics, life, and mental well-being effectively.
                    </p>
                    <button
                        onClick={handleDownload}
                        className="px-10 py-4 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl shadow-black/10 hover:scale-105 active:scale-95"
                    >
                        Download Guide
                    </button>
                </div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10 rotate-12">
                    <BookOpen size={400} />
                </div>
            </div>
        </div>
    );
};

const BlogCard = ({ blog }) => (
    <article className="group bg-white dark:bg-slate-900 rounded-4xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-900/30 transition-all duration-500 flex flex-col h-full">
        {blog.image && (
            <div className="h-56 overflow-hidden">
                <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </div>
        )}
        <div className="p-8 flex-1 flex flex-col space-y-6">
            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                        <UserIcon size={12} />
                    </div>
                    {blog.author?.name || 'Anonymous'}
                </div>
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-blue-500" />
                    {new Date(blog.createdAt).toLocaleDateString()}
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors tracking-tight leading-tight">
                    {blog.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed font-medium">
                    {blog.content}
                </p>
            </div>

            <div className="pt-4 mt-auto">
                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-3 group-hover:gap-5 transition-all">
                    Read Full Post <ArrowRight size={16} />
                </button>
            </div>
        </div>
    </article>
);

export default BlogPage;
