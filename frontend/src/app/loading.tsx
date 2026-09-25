export default function Loading() {
    return (
        <>
            <style>{`
                @keyframes gobadi-spin-cw {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes gobadi-spin-ccw {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(-360deg); }
                }
                @keyframes gobadi-pulse-scale {
                    0%, 100% { transform: scale(1);   opacity: 1;    }
                    50%       { transform: scale(1.08); opacity: 0.75; }
                }
                @keyframes gobadi-dot-bounce {
                    0%, 80%, 100% { transform: translateY(0);    opacity: 0.35; }
                    40%           { transform: translateY(-10px); opacity: 1;    }
                }
                @keyframes gobadi-fade-up {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0);    }
                }
                @keyframes gobadi-shimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position:  200% center; }
                }

                .gobadi-ring-outer {
                    animation: gobadi-spin-cw 2.4s linear infinite;
                }
                .gobadi-ring-inner {
                    animation: gobadi-spin-ccw 1.6s linear infinite;
                }
                .gobadi-logo-pulse {
                    animation: gobadi-pulse-scale 2s ease-in-out infinite;
                }
                .gobadi-dot-1 { animation: gobadi-dot-bounce 1.4s ease-in-out infinite 0s;    }
                .gobadi-dot-2 { animation: gobadi-dot-bounce 1.4s ease-in-out infinite 0.18s; }
                .gobadi-dot-3 { animation: gobadi-dot-bounce 1.4s ease-in-out infinite 0.36s; }
                .gobadi-brand-text {
                    animation: gobadi-fade-up 0.8s ease-out forwards;
                }
                .gobadi-shimmer-text {
                    background: linear-gradient(
                        90deg,
                        #C1652F 0%,
                        #E8935A 40%,
                        #C1652F 60%,
                        #A34E1F 100%
                    );
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: gobadi-shimmer 2.8s linear infinite;
                }
            `}</style>

            <div
                role="status"
                aria-label="Loading Gobadi"
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 9999,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2rem",
                    backgroundColor: "#F7F4EE",
                    fontFamily: "var(--font-display, sans-serif)",
                }}
            >
                {/* ── Spinner + Logo ── */}
                <div style={{ position: "relative", width: 140, height: 140 }}>

                    {/* Outer ring */}
                    <svg
                        className="gobadi-ring-outer"
                        style={{ position: "absolute", inset: 0 }}
                        width="140"
                        height="140"
                        viewBox="0 0 140 140"
                        fill="none"
                        aria-hidden
                    >
                        <circle
                            cx="70" cy="70" r="64"
                            stroke="#E8DCC4"
                            strokeWidth="4"
                        />
                        <circle
                            cx="70" cy="70" r="64"
                            stroke="#C1652F"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray="100 302"
                            strokeDashoffset="0"
                        />
                    </svg>

                    {/* Inner ring */}
                    <svg
                        className="gobadi-ring-inner"
                        style={{ position: "absolute", inset: 12 }}
                        width="116"
                        height="116"
                        viewBox="0 0 116 116"
                        fill="none"
                        aria-hidden
                    >
                        <circle
                            cx="58" cy="58" r="52"
                            stroke="#FBE6DA"
                            strokeWidth="3"
                        />
                        <circle
                            cx="58" cy="58" r="52"
                            stroke="#C0612B"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray="60 267"
                            strokeDashoffset="0"
                            opacity="0.7"
                        />
                    </svg>

                    {/* Centre logo badge */}
                    <div
                        className="gobadi-logo-pulse"
                        style={{
                            position: "absolute",
                            inset: 24,
                            borderRadius: "50%",
                            background: "white",
                            boxShadow: "0 4px 24px rgba(193,101,47,0.22)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {/* Inline Gobadi "G" monogram */}
                        <svg
                            width="46"
                            height="46"
                            viewBox="0 0 46 46"
                            fill="none"
                            aria-hidden
                        >
                            <rect width="46" height="46" rx="23" fill="#FBE6DA" />
                            <text
                                x="23"
                                y="31"
                                textAnchor="middle"
                                fontSize="26"
                                fontWeight="800"
                                fill="#C1652F"
                                fontFamily="var(--font-display, sans-serif)"
                            >
                                গ
                            </text>
                        </svg>
                    </div>
                </div>

                {/* ── Brand name ── */}
                <div
                    className="gobadi-brand-text"
                    style={{ textAlign: "center", lineHeight: 1 }}
                >
                    <span
                        className="gobadi-shimmer-text"
                        style={{
                            fontSize: "2.4rem",
                            fontWeight: 800,
                            letterSpacing: "-0.02em",
                            display: "block",
                        }}
                    >
                        Gobadi
                    </span>
                    <span
                        style={{
                            display: "block",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            color: "#525252",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            marginTop: "0.3rem",
                        }}
                    >
                        Loading…
                    </span>
                </div>

                {/* ── Bounce dots ── */}
                <div style={{ display: "flex", gap: "0.55rem", alignItems: "center" }}>
                    {(["gobadi-dot-1", "gobadi-dot-2", "gobadi-dot-3"] as const).map((cls) => (
                        <span
                            key={cls}
                            className={cls}
                            style={{
                                display: "block",
                                width: 9,
                                height: 9,
                                borderRadius: "50%",
                                backgroundColor: "#C1652F",
                            }}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

