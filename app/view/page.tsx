'use client'
import { Suspense } from "react";
import { useSearchParams } from "next/navigation"

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

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px #0001", padding: 32, minWidth: 320 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Battery Information</h2>
        {error ? (
          <div style={{ color: "#e53e3e", fontWeight: 500 }}>{error}</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {Object.entries(batteryData).map(([key, value]) => (
                <tr key={key}>
                  <td style={{ fontWeight: 600, padding: "8px 12px", borderBottom: "1px solid #eee", textTransform: "capitalize" }}>{key.replace(/([A-Z])/g, ' $1')}</td>
                  <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>{String(value)}</td>
                </tr>
              ))}
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
