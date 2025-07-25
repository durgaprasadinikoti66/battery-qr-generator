'use client'
import { Suspense } from "react";
import { useSearchParams } from "next/navigation"

function formatKey(key: string) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function isUrl(value: string) {
  return /^https?:\/\//.test(value);
}

function isPdfUrl(value: string) {
  return isUrl(value) && value.toLowerCase().endsWith('.pdf');
}

function BatteryQRViewInner() {
  const searchParams = useSearchParams()
  const dataParam = searchParams.get("data")
  let batteryData = null
  let error = null

  if (dataParam) {
    try {
      const json = decodeURIComponent(dataParam)
      batteryData = JSON.parse(json)
    } catch (e) {
      error = "Invalid QR data."
    }
  } else {
    error = "No data found in QR code."
  }

  const entries = batteryData ? Object.entries(batteryData) : [];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 16px 0 rgba(31, 38, 135, 0.12)", padding: 24, minWidth: 320, maxWidth: 400, width: '100%' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18, textAlign: 'center', color: '#2d3748', letterSpacing: 0.5 }}>Battery Information</h2>
        {error ? (
          <div style={{ color: "#e53e3e", fontWeight: 500, textAlign: 'center', fontSize: 14 }}>{error}</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, background: '#f9fafb', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px #0001' }}>
            <tbody>
              {entries.map(([key, value]) => {
                // For URLs, wrap in anchor, download if PDF
                if (isUrl(String(value))) {
                  return (
                    <tr key={key}>
                      <td style={{ fontWeight: 600, padding: "8px 10px", borderBottom: "1px solid #e2e8f0", whiteSpace: 'nowrap', color: '#374151', background: '#f3f4f6', fontSize: 13 }}>{formatKey(key)}</td>
                      <td style={{ padding: "8px 10px", borderBottom: "1px solid #e2e8f0", color: '#2d3748', fontSize: 13, wordBreak: 'break-all' }}>
                        <a href={String(value)} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline', fontSize: 13 }}
                          {...(isPdfUrl(String(value)) ? { download: '' } : {})}
                        >
                          {String(value)}
                        </a>
                      </td>
                    </tr>
                  );
                }
                // For long text (like URLs), allow wrapping
                return (
                  <tr key={key}>
                    <td style={{ fontWeight: 600, padding: "8px 10px", borderBottom: "1px solid #e2e8f0", whiteSpace: 'nowrap', color: '#374151', background: '#f3f4f6', fontSize: 13 }}>{formatKey(key)}</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #e2e8f0", color: '#2d3748', fontSize: 13, wordBreak: 'break-word', whiteSpace: 'pre-line' }}>{String(value)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default function BatteryQRView() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BatteryQRViewInner />
    </Suspense>
  )
}
