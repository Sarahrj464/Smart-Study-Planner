import React, { useState } from 'react';

const API_URL = 'http://localhost:5003/api/v1';

const SyllabusUpload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [dragOver, setDragOver] = useState(false);

    const handleFile = (selectedFile) => {
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError('');
        } else {
            setError('Only PDF files are allowed!');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a PDF file first!');
            return;
        }
        setLoading(true);
        setResult(null);
        setError('');

        try {
            const formData = new FormData();
            formData.append('syllabus', file);

            const token = localStorage.getItem('token');

            // ✅ Direct fetch to port 5003 — no apiClient
            const response = await fetch(`${API_URL}/syllabus/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                    // ✅ Content-Type set nahi karo — FormData khud set karta hai
                },
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setResult(data);
            } else {
                setError(data.message || 'Upload failed. Please try again.');
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError('Connection error. Make sure backend is running on port 5003.');
        }
        setLoading(false);
    };

    const priorityColor = (p) => {
        if (!p) return '#868e96';
        const lower = p.toLowerCase();
        if (lower === 'high') return '#c92a2a';
        if (lower === 'medium') return '#e67700';
        return '#2f9e44';
    };

    return (
        <div style={{ maxWidth: 700, margin: '0 auto', fontFamily: "'Nunito', sans-serif" }}>

            {/* Upload Card */}
            <div style={{
                background: '#fff',
                borderRadius: 20,
                padding: 28,
                boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
                marginBottom: 24
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <span style={{ fontSize: 28 }}>📄</span>
                    <div>
                        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1a1a2e' }}>Upload Syllabus</h2>
                        <p style={{ margin: 0, fontSize: 13, color: '#888' }}>AI will generate a personalized study plan</p>
                    </div>
                </div>

                {/* Drop Zone */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                    onClick={() => document.getElementById('pdf-input').click()}
                    style={{
                        border: `2px dashed ${dragOver ? '#3b5bdb' : file ? '#2f9e44' : '#dee2e6'}`,
                        borderRadius: 14,
                        padding: '36px 20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: dragOver ? '#f0f4ff' : file ? '#f8fff9' : '#fafbfc',
                        transition: 'all 0.2s',
                        marginBottom: 16
                    }}
                >
                    <input
                        id="pdf-input"
                        type="file"
                        accept=".pdf"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFile(e.target.files[0])}
                    />
                    <div style={{ fontSize: 40, marginBottom: 8 }}>
                        {file ? '✅' : '📁'}
                    </div>
                    {file ? (
                        <>
                            <div style={{ fontWeight: 700, color: '#2f9e44', fontSize: 15 }}>{file.name}</div>
                            <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>
                                {(file.size / 1024).toFixed(1)} KB — Click to change
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ fontWeight: 700, color: '#555', fontSize: 15 }}>Drag & Drop your PDF here</div>
                            <div style={{ color: '#aaa', fontSize: 12, marginTop: 4 }}>or click to browse</div>
                        </>
                    )}
                </div>

                {error && (
                    <div style={{ background: '#ffe3e3', color: '#c92a2a', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, fontWeight: 600 }}>
                        ❌ {error}
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    disabled={loading || !file}
                    style={{
                        width: '100%',
                        padding: '13px',
                        background: loading || !file ? '#adb5bd' : '#3b5bdb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 12,
                        fontWeight: 800,
                        fontSize: 15,
                        cursor: loading || !file ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s'
                    }}
                >
                    {loading ? '🤖 AI is generating your study plan...' : '🚀 Generate Study Plan'}
                </button>
            </div>

            {/* Results */}
            {result && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* Summary */}
                    <div style={{ background: '#fff', borderRadius: 16, padding: 22, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                        <h3 style={{ margin: '0 0 10px', color: '#1a1a2e', fontSize: 16, fontWeight: 800 }}>📋 Summary</h3>
                        <p style={{ margin: 0, color: '#555', lineHeight: 1.6, fontSize: 14 }}>
                            {result.studyPlan.summary || 'Study plan generated successfully!'}
                        </p>
                        <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
                            <div style={{ background: '#e7f5ff', borderRadius: 10, padding: '8px 16px', textAlign: 'center' }}>
                                <div style={{ fontSize: 20, fontWeight: 800, color: '#1971c2' }}>{result.studyPlan.totalTopics || '—'}</div>
                                <div style={{ fontSize: 11, color: '#888' }}>Total Topics</div>
                            </div>
                            <div style={{ background: '#f3f0ff', borderRadius: 10, padding: '8px 16px', textAlign: 'center' }}>
                                <div style={{ fontSize: 20, fontWeight: 800, color: '#7048e8' }}>{result.studyPlan.estimatedWeeks || '—'}</div>
                                <div style={{ fontSize: 11, color: '#888' }}>Weeks</div>
                            </div>
                        </div>
                    </div>

                    {/* Weekly Plan */}
                    {result.studyPlan.studyPlan?.length > 0 && (
                        <div style={{ background: '#fff', borderRadius: 16, padding: 22, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                            <h3 style={{ margin: '0 0 14px', color: '#1a1a2e', fontSize: 16, fontWeight: 800 }}>📅 Weekly Study Plan</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {result.studyPlan.studyPlan.map((week, i) => (
                                    <div key={i} style={{ border: '1.5px solid #e8ecfa', borderRadius: 12, padding: '12px 16px', background: '#f8f9ff' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                            <span style={{ fontWeight: 800, color: '#3b5bdb', fontSize: 14 }}>Week {week.week}</span>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <span style={{ fontSize: 11, background: '#e7f5ff', color: '#1971c2', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>
                                                    {week.dailyHours}h/day
                                                </span>
                                                <span style={{ fontSize: 11, background: '#fff', color: priorityColor(week.priority), padding: '2px 8px', borderRadius: 20, fontWeight: 700, border: `1px solid ${priorityColor(week.priority)}` }}>
                                                    {week.priority}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                            {week.topics?.map((topic, j) => (
                                                <span key={j} style={{ fontSize: 12, background: '#fff', border: '1px solid #e0e4ef', borderRadius: 8, padding: '3px 10px', color: '#444' }}>
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tips */}
                    {result.studyPlan.tips?.length > 0 && (
                        <div style={{ background: '#fff', borderRadius: 16, padding: 22, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                            <h3 style={{ margin: '0 0 12px', color: '#1a1a2e', fontSize: 16, fontWeight: 800 }}>💡 Study Tips</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {result.studyPlan.tips.map((tip, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                        <span style={{ color: '#3b5bdb', fontWeight: 800, minWidth: 20 }}>{i + 1}.</span>
                                        <span style={{ color: '#555', fontSize: 14, lineHeight: 1.5 }}>{tip}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Important Dates */}
                    {result.studyPlan.importantDates?.length > 0 && (
                        <div style={{ background: '#fff3bf', borderRadius: 16, padding: 22 }}>
                            <h3 style={{ margin: '0 0 12px', color: '#e67700', fontSize: 16, fontWeight: 800 }}>📌 Important Dates</h3>
                            {result.studyPlan.importantDates.map((date, i) => (
                                <div key={i} style={{ color: '#555', fontSize: 14, marginBottom: 4 }}>📅 {date}</div>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={() => { setResult(null); setFile(null); }}
                        style={{ padding: '12px', background: '#f1f3f9', color: '#555', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                    >
                        📄 Upload Another Syllabus
                    </button>
                </div>
            )}
        </div>
    );
};

export default SyllabusUpload;