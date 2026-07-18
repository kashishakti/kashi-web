const BlogHero = () => {
  return (
    <div
      className="bh-wrap"
      style={{
        background: "linear-gradient(160deg,#2A1208 0%,#1C0F08 100%)",
        padding: "60px 40px 56px",
        marginTop: 72,
        textAlign: "center",
        position: "relative",
      }}
    >
      <style>{`
        @media(max-width:640px){
          .bh-wrap{padding:44px 20px 40px!important}
          .bh-stats{gap:14px!important;flex-wrap:wrap;justify-content:center}
          .bh-divider{display:none!important}
        }
      `}</style>
      {/* Background decorations */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.07,
            backgroundImage:
              "radial-gradient(circle at 15% 50%,#D97235 0%,transparent 45%)," +
              "radial-gradient(circle at 85% 20%,#E8A070 0%,transparent 40%)," +
              "radial-gradient(circle at 50% 90%,#8B3A1A 0%,transparent 50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
            width: 600,
            height: 600,
            opacity: 0.035,
          }}
        >
          <svg
            viewBox="0 0 200 200"
            fill="none"
            style={{ width: "100%", height: "100%" }}
          >
            <circle cx="100" cy="100" r="95" stroke="white" strokeWidth="0.4" />
            <circle cx="100" cy="100" r="78" stroke="white" strokeWidth="0.3" />
            <circle cx="100" cy="100" r="62" stroke="white" strokeWidth="0.3" />
            <circle cx="100" cy="100" r="45" stroke="white" strokeWidth="0.3" />
            <circle cx="100" cy="100" r="28" stroke="white" strokeWidth="0.3" />
            <line
              x1="5"
              y1="100"
              x2="195"
              y2="100"
              stroke="white"
              strokeWidth="0.2"
            />
            <line
              x1="100"
              y1="5"
              x2="100"
              y2="195"
              stroke="white"
              strokeWidth="0.2"
            />
            <line
              x1="29"
              y1="29"
              x2="171"
              y2="171"
              stroke="white"
              strokeWidth="0.2"
            />
            <line
              x1="171"
              y1="29"
              x2="29"
              y2="171"
              stroke="white"
              strokeWidth="0.2"
            />
            <polygon
              points="100,5 120,80 195,100 120,120 100,195 80,120 5,100 80,80"
              fill="none"
              stroke="white"
              strokeWidth="0.3"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 680,
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: "10.5px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#D97235",
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          Wisdom · Wellness · Growth
        </p>

        <h1
          style={{
            fontSize: "clamp(38px, 5vw, 58px)",
            fontWeight: 700,
            color: "#FAF7F2",
            lineHeight: 1.1,
            letterSpacing: "-0.5px",
            marginBottom: 18,
          }}
        >
          Stories that{" "}
          <em style={{ color: "#D97235", fontStyle: "italic" }}>Awaken</em>
          {" & Inspire"}
        </h1>

        <p
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 16,
            color: "rgba(250,247,242,0.6)",
            fontWeight: 300,
            lineHeight: 1.7,
            maxWidth: 460,
            margin: "0 auto 32px",
          }}
        >
          Explore mindfulness, spirituality, personal growth, and the ancient
          wisdom of living fully.
        </p>

        {/* Stats row */}
        <div
          className="bh-stats"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#FAF7F2",
                lineHeight: 1,
              }}
            >
              340+
            </p>
            <p
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 11,
                color: "rgba(250,247,242,0.45)",
                marginTop: 4,
                letterSpacing: "0.05em",
              }}
            >
              Articles
            </p>
          </div>

          <div
            className="bh-divider"
            style={{
              width: 1,
              height: 32,
              background: "rgba(250,247,242,0.15)",
            }}
          />

          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#FAF7F2",
                lineHeight: 1,
              }}
            >
              28
            </p>
            <p
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 11,
                color: "rgba(250,247,242,0.45)",
                marginTop: 4,
                letterSpacing: "0.05em",
              }}
            >
              Contributors
            </p>
          </div>

          <div
            className="bh-divider"
            style={{
              width: 1,
              height: 32,
              background: "rgba(250,247,242,0.15)",
            }}
          />

          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#FAF7F2",
                lineHeight: 1,
              }}
            >
              12k
            </p>
            <p
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 11,
                color: "rgba(250,247,242,0.45)",
                marginTop: 4,
                letterSpacing: "0.05em",
              }}
            >
              Weekly Readers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogHero;
