import React from 'react';

export const ReportTemplate = ({ data, projection, metadata }) => {
    if (!data || !projection) return null;

    const sectionStyle = { marginBottom: '35px' };
    const headingStyle = { 
        fontSize: '14px', 
        color: '#059669', 
        borderBottom: '1px solid #f1f5f9', 
        paddingBottom: '8px', 
        marginBottom: '15px',
        fontWeight: '700',
        textTransform: 'uppercase'
    };

    return (
        <div id="pdf-report-template" style={{
            width: '794px',
            padding: '60px',
            backgroundColor: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            color: '#334155',
            boxSizing: 'border-box'
        }}>
            {/* 1. Academic Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '3px solid #064e3b', paddingBottom: '15px', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', color: '#064e3b', margin: '0' }}>Digital Carbon Quantification Report</h1>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0' }}>Case Study: {metadata.videoTitle || "Multimedia Stream"}</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '11px', color: '#94a3b8' }}>
                    <p>ID: #UNIMAS-{new Date().getTime().toString().slice(-6)}</p>
                    <p>Date: {new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* 2. Executive Summary */}
            <div style={sectionStyle}>
                <h3 style={headingStyle}>1. Executive Summary</h3>
                <p style={{ fontSize: '13px', lineHeight: '1.6', margin: '0' }}>
                    This analysis quantifies the environmental impact of a streaming session located in <strong>{metadata.region}</strong> using a {metadata.device}. 
                    The total annual footprint is projected to be <strong>{projection.yearly} kg CO2e</strong>, requiring significant environmental offsets to maintain carbon neutrality.
                </p>
            </div>

            {/* 3. Three-Layer Technical Breakdown */}
            <div style={sectionStyle}>
                <h3 style={headingStyle}>2. System Layer Quantification</h3>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '15px' }}>
                    Emissions are calculated across the three fundamental pillars of ICT energy consumption:
                </p>
                <div style={{ display: 'flex', gap: '15px' }}>
                    {[
                        { label: 'Data Center', val: data.breakdown.dc, desc: 'Server-side processing and storage energy.' },
                        { label: 'Network', val: data.breakdown.net, desc: 'Data transmission through regional infrastructure.' },
                        { label: 'End-User', val: data.breakdown.device, desc: 'Local device power consumption.' }
                    ].map((item, i) => (
                        <div key={i} style={{ flex: 1, padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                            <p style={{ margin: '0', fontSize: '11px', fontWeight: 'bold', color: '#059669' }}>{item.label}</p>
                            <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: '800' }}>{item.val.toFixed(2)}g</p>
                            <p style={{ margin: '0', fontSize: '10px', color: '#94a3b8' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Environmental & Social Impact */}
            <div style={sectionStyle}>
                <h3 style={headingStyle}>3. Sustainability Forecast</h3>
                <div style={{ backgroundColor: '#064e3b', color: '#ffffff', padding: '30px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                        <div>
                            <p style={{ fontSize: '11px', opacity: '0.8', margin: '0' }}>DRIVING EQUIVALENCY</p>
                            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>{projection.km} KM</p>
                        </div>
                        <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
                        <div>
                            <p style={{ fontSize: '11px', opacity: '0.8', margin: '0' }}>CARBON OFFSET</p>
                            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>{projection.trees} TREES</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Sustainability Recommendation (New Content) */}
            <div style={sectionStyle}>
                <h3 style={headingStyle}>4. Strategic Recommendations</h3>
                <div style={{ padding: '15px', border: '1px solid #dcfce7', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                    <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '12px', color: '#166534', lineHeight: '1.8' }}>
                        <li><strong>Resolution Optimization:</strong> Switching from 4K to 1080p can reduce network energy by up to 50%.</li>
                        <li><strong>Infrastructure Awareness:</strong> Grid factors in <strong>{metadata.region}</strong> significantly influence total CO2e output.</li>
                        <li><strong>Hardware Efficiency:</strong> Utilizing mid-specification devices or mobile platforms minimizes end-user energy demand.</li>
                    </ul>
                </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: 'auto', textAlign: 'center', fontSize: '10px', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                <p style={{ fontWeight: 'bold' }}>UNIMAS | Faculty of Computer Science and Information Technology</p>
                <p>This study is part of an undergraduate research project supervised by Dr. Cynthia Kon Mui Lian.</p>
            </div>
        </div>
    );
};