
import Link from "next/link";
import { getCategoryColors } from "./blogUtils";
import type { BlogItem } from "../types";


interface Props {
  initialBlogs: BlogItem[];
}

const CategoryArticles = ({ initialBlogs }: Props) => {


  if (initialBlogs.length === 0) {
    return (
      <div style={{ maxWidth: 1280, margin: "52px auto 0", padding: "0 40px", textAlign: "center" }}>
        <p style={{ fontSize: 16, color: "#9C8B7E", padding: "60px 0" }}>
          No articles found in this category yet. Check back soon!
        </p>
      </div>
    )
  }

  return (
    <div className="ca-outer" style={{ maxWidth: 1280, margin: "52px auto 0", padding: "0 40px" }}>
      <style>{`
        .ca-card:hover{transform:translateY(-5px);box-shadow:0 16px 40px rgba(28,15,8,0.12)!important}
        @media(max-width:900px){.ca-outer{padding:0 20px!important}.ca-grid{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:600px){.ca-outer{padding:0 16px!important}.ca-grid{grid-template-columns:1fr!important}}
      `}</style>
      <div
        className="ca-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
        }}
      >
        {initialBlogs.map((blog) => {
          const category = blog.category?.Title;
          const author = blog.Author?.authors?.[0]?.Title ?? "Kashi Shakti";
          const authorInitial = author.charAt(0).toUpperCase();
          const [c1, c2] = getCategoryColors(category);
          const date = blog.createdAt
            ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "";

          return (
            <Link
              key={blog.documentId}
              href={`/blogs/${blog.Slug}`}
              style={{ textDecoration: "none", color: "inherit", display: "block" }}
            >
            <article
              className="ca-card"
              style={{
                background: "#fff",
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid rgba(28,15,8,0.07)",
                cursor: "pointer",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
            >
              <div
                style={{
                  height: 188,
                  background: blog.FeaturedImage
                    ? `url(${blog.FeaturedImage.url}) center/cover no-repeat`
                    : `linear-gradient(135deg,${c1},${c2})`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "radial-gradient(ellipse at 30% 60%,rgba(217,114,53,0.3),transparent 60%)",
                  }}
                />
                {category && (
                  <span
                    style={{
                      position: "absolute",
                      top: 14,
                      left: 14,
                      background: "rgba(20,10,4,0.55)",
                      backdropFilter: "blur(4px)",
                      border: "1px solid rgba(250,247,242,0.15)",
                      color: "#FAF7F2",
                      padding: "4px 10px",
                      borderRadius: 100,
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {category}
                  </span>
                )}
              </div>

              <div style={{ padding: 20 }}>
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    color: "#1C0F08",
                    lineHeight: 1.35,
                    marginBottom: 9,
                  }}
                >
                  {blog.Title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontSize: "13.5px",
                    color: "#6B5A50",
                    lineHeight: 1.65,
                    marginBottom: 16,
                  }}
                >
                  {blog.ShortDescription}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 7 }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg,${c1},${c2})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                            fontSize: 11,
                        fontWeight: 700,
                        color: "#fff",
                      }}
                    >
                      {authorInitial}
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans), sans-serif",
                        fontSize: 12,
                        color: "#9C8B7E",
                      }}
                    >
                      {author}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontSize: 11,
                      color: "#C4BDB8",
                    }}
                  >
                    {blog.ReadTime} min{date ? ` · ${date}` : ""}
                  </span>
                </div>
              </div>
            </article>
            </Link>
          );
        })}
      </div>

    </div>
  );
};

export default CategoryArticles;
