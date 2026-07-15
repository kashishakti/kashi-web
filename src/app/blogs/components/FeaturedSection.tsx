import { getCategoryColors } from "./blogUtils";
import type { BlogItem } from "../types";

interface Props {
  featured: BlogItem | null;
  editorsPicks: BlogItem[];
}

const FeaturedSection = ({ featured, editorsPicks }: Props) => {
  if (!featured) return null;

  const category = featured.categories?.[0]?.Title;
  const author = featured.Author?.authors?.[0]?.Title ?? "Kashi Shakti";
  const [c1] = getCategoryColors(category);
  const initial = author.charAt(0).toUpperCase();
  const date = featured.createdAt
    ? new Date(featured.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="fs-outer" style={{ maxWidth: 1280, margin: "28px auto 0", padding: "0 40px" }}>
      <style>{`
        @media (max-width: 900px) {
          .fs-outer { padding: 0 20px !important; }
          .fs-grid { grid-template-columns: 1fr !important; }
          .fs-featured-inner { min-height: 280px !important; padding: 32px 24px !important; }
          .fs-picks { border-left: none !important; border-top: 1px solid rgba(28,15,8,0.08); }
          .fs-footer { flex-wrap: wrap; gap: 12px !important; }
          .fs-read-btn { margin-left: 0 !important; }
        }
        @media (max-width: 640px) {
          .fs-outer { padding: 0 16px !important; }
        }
      `}</style>
      <div
        className="fs-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 400px",
          borderRadius: 20,
          overflow: "hidden",
          background: "#2A1208",
          minHeight: 400,
        }}
      >
        {/* Left: featured article */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: featured.FeaturedImage
                ? `url(${featured.FeaturedImage.url}) center/cover no-repeat`
                : `linear-gradient(135deg,${c1} 0%,#4A2010 30%,#2A1208 70%)`,
              pointerEvents: "none",
            }}
          >
            {/* Dark overlay so text stays readable over images */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right, rgba(28,10,4,0.82) 0%, rgba(28,10,4,0.5) 60%, rgba(28,10,4,0.2) 100%)",
              }}
            />
          </div>

          <div
            className="fs-featured-inner"
            style={{
              position: "relative",
              zIndex: 1,
              padding: "48px 48px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 400,
            }}
          >
            <div>
              {category && (
                <span
                  style={{
                    display: "inline-block",
                    background: "rgba(217,114,53,0.22)",
                    border: "1px solid rgba(217,114,53,0.4)",
                    color: "#E8935C",
                    padding: "4px 12px",
                    borderRadius: 100,
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontSize: "10.5px",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 18,
                    width: "fit-content",
                  }}
                >
                  ✦ Featured · {category}
                </span>
              )}

              <h2
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontSize: "clamp(24px, 2.8vw, 34px)",
                  fontWeight: 700,
                  color: "#FAF7F2",
                  lineHeight: 1.2,
                  letterSpacing: "-0.3px",
                  marginBottom: 14,
                  maxWidth: 520,
                }}
              >
                {featured.Title}
              </h2>

              <p
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: 15,
                  color: "rgba(250,247,242,0.6)",
                  lineHeight: 1.7,
                  maxWidth: 460,
                  marginBottom: 28,
                }}
              >
                {featured.ShortDescription}
              </p>
            </div>

            <div className="fs-footer" style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#D97235,#8B3A1A)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-playfair), serif",
                    fontWeight: 700,
                    color: "#FAF7F2",
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {initial}
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#FAF7F2",
                    }}
                  >
                    {author}
                  </p>
                  {date && (
                    <p
                      style={{
                        fontFamily: "var(--font-dm-sans), sans-serif",
                        fontSize: 11,
                        color: "rgba(250,247,242,0.5)",
                        marginTop: 2,
                      }}
                    >
                      {date}
                    </p>
                  )}
                </div>
              </div>

              {featured.ReadTime && (
                <>
                  <span style={{ color: "rgba(250,247,242,0.25)" }}>·</span>
                  <span
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontSize: 12,
                      color: "rgba(250,247,242,0.45)",
                    }}
                  >
                    {featured.ReadTime} min read
                  </span>
                </>
              )}

              <a
                href={`/blogs/${featured.Slug}`}
                className="fs-read-btn"
                style={{
                  marginLeft: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#D97235",
                  color: "#fff",
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  padding: "11px 22px",
                  borderRadius: 100,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Read Article
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Right: editor's picks */}
        <div
          className="fs-picks"
          style={{
            background: "#F5F0E8",
            display: "flex",
            flexDirection: "column",
            borderLeft: "1px solid rgba(28,15,8,0.08)",
          }}
        >
          <div
            style={{
              padding: "18px 22px",
              borderBottom: "1px solid rgba(28,15,8,0.07)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: "10.5px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#9C8B7E",
              }}
            >
              Editor&apos;s Picks
            </p>
          </div>

          {editorsPicks.map((blog, i) => {
            const cat = blog.categories?.[0]?.Title;
            const isLast = i === editorsPicks.length - 1;
            return (
              <div
                key={blog.documentId}
                style={{
                  padding: "20px 22px",
                  borderBottom: isLast
                    ? "none"
                    : "1px solid rgba(28,15,8,0.07)",
                  cursor: "pointer",
                  flex: editorsPicks.length <= 3 ? 1 : undefined,
                }}
              >
                {cat && (
                  <span
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#C4521A",
                      marginBottom: 8,
                      display: "block",
                    }}
                  >
                    {cat}
                  </span>
                )}
                <h3
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    fontSize: "15.5px",
                    fontWeight: 600,
                    color: "#1C0F08",
                    lineHeight: 1.35,
                    marginBottom: 8,
                  }}
                >
                  {blog.Title}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontSize: 12,
                      color: "#9C8B7E",
                    }}
                  >
                    {blog.Author?.authors?.[0]?.Title ?? "Kashi Shakti"}
                  </span>
                  {blog.ReadTime && (
                    <>
                      <span style={{ color: "#E2D8D0" }}>·</span>
                      <span
                        style={{
                          fontFamily: "var(--font-dm-sans), sans-serif",
                          fontSize: 12,
                          color: "#9C8B7E",
                        }}
                      >
                        {blog.ReadTime} min read
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturedSection;
