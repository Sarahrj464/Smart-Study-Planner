import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, initTheme } from '../../redux/slices/themeSlice';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    const theme = useSelector((state) => state.theme);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initTheme());
    }, [dispatch]);

    return (
        <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            aria-label="Toggle Theme"
        >
            {theme.darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
};

export default ThemeToggle;
