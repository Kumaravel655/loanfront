import React, { useState } from "react";

const BulkReminderTool = ({ onSend }) => {
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState(null); // { type: 'sms'|'email', ok: true|false, message }

  const send = async (type) => {
    // type === 'sms' or 'email'
    if (loading) return;
    setLoading(true);
    setLastResult(null);

    try {
      // If parent provided onSend, call it and await result
      if (onSend && typeof onSend === "function") {
        const res = await onSend(type); // parent should return { ok: true, message: '...' } or throw on error
        setLastResult({ type, ok: !!res.ok, message: res.message || "Sent" });
      } else {
        // Fallback: simulate network call
        await new Promise((r) => setTimeout(r, 1000));
        setLastResult({ type, ok: true, message: `${type.toUpperCase()} reminders queued.` });
      }
    } catch (err) {
      setLastResult({ type, ok: false, message: err?.message || "Failed to send" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-secondary text-white text-center fw-semibold">
        Bulk Reminder Tool
      </div>
      <div className="card-body text-center">
        <div className="d-grid gap-2" style={{ maxWidth: 320, margin: "0 auto" }}>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => send("sms")}
            disabled={loading}
            aria-disabled={loading}
            aria-label="Send SMS reminders"
          >
            {loading ? "Sending..." : "Send SMS Reminder"}
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => send("email")}
            disabled={loading}
            aria-disabled={loading}
            aria-label="Send Email reminders"
          >
            {loading ? "Sending..." : "Send Email Reminder"}
          </button>
        </div>

        {lastResult && (
          <div
            className={`mt-3 alert ${lastResult.ok ? "alert-success" : "alert-danger"} py-2`}
            role="status"
          >
            <small>
              {lastResult.ok ? "Success:" : "Error:"} {lastResult.message}
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkReminderTool;
