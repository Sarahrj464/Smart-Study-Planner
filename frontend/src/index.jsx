import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';
import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <Provider store={store}>
                <App />
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        className: 'dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-lg',
                        style: {
                            borderRadius: '12px',
                            background: '#333',
                            color: '#fff',
                        },
                        success: {
                            iconTheme: {
                                primary: '#22c55e',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </Provider>
        </ErrorBoundary>
    </React.StrictMode>
);
