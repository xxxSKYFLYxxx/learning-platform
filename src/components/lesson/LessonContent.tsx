"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface Props {
  content: string;
}

export function LessonContent({ content }: Props) {
  return (
    <article
      className="lesson-content"
      style={{
        background: "var(--c-s1)",
        border: "1px solid var(--c-border)",
        padding: "32px clamp(20px, 4vw, 48px)",
        color: "var(--c-t2)",
        fontFamily: "var(--font-sans)",
        fontSize: 16,
        lineHeight: 1.75,
        maxWidth: "100%",
        overflowWrap: "break-word",
        wordBreak: "break-word",
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => (
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 900, color: "var(--c-t1)", marginTop: 8, marginBottom: 20, lineHeight: 1.2 }}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900, color: "var(--c-t1)", marginTop: 36, marginBottom: 14, lineHeight: 1.25 }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--c-t1)", marginTop: 28, marginBottom: 10 }}>
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p style={{ marginBottom: 16 }}>{children}</p>
          ),
          ul: ({ children }) => (
            <ul style={{ paddingLeft: 22, marginBottom: 16 }}>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol style={{ paddingLeft: 22, marginBottom: 16 }}>{children}</ol>
          ),
          li: ({ children }) => (
            <li style={{ marginBottom: 6 }}>{children}</li>
          ),
          strong: ({ children }) => (
            <strong style={{ color: "var(--c-t1)", fontWeight: 700 }}>{children}</strong>
          ),
          em: ({ children }) => (
            <em style={{ color: "var(--c-red)", fontStyle: "normal", fontWeight: 600 }}>{children}</em>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--c-red)", textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote
              style={{
                borderLeft: "3px solid var(--c-red)",
                paddingLeft: 18,
                marginLeft: 0,
                marginBottom: 18,
                color: "var(--c-t3)",
                fontStyle: "italic",
                background: "rgba(208,57,42,0.04)",
                padding: "12px 18px",
              }}
            >
              {children}
            </blockquote>
          ),
          code: ({ className, children }) => {
            // Inline code (no language class)
            if (!className) {
              return (
                <code
                  style={{
                    background: "var(--c-s2)",
                    border: "1px solid var(--c-border)",
                    padding: "2px 6px",
                    fontSize: "0.92em",
                    fontFamily: "var(--font-mono)",
                    color: "var(--c-red)",
                  }}
                >
                  {children}
                </code>
              );
            }
            return <code className={className}>{children}</code>;
          },
          pre: ({ children }) => (
            <pre
              style={{
                background: "#0d1117",
                border: "1px solid var(--c-border)",
                padding: 20,
                overflowX: "auto",
                fontSize: 14,
                fontFamily: "var(--font-mono)",
                lineHeight: 1.55,
                marginBottom: 20,
              }}
            >
              {children}
            </pre>
          ),
          img: ({ src, alt }) =>
            typeof src === "string" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={alt ?? ""}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  border: "1px solid var(--c-border)",
                  marginTop: 12,
                  marginBottom: 12,
                }}
              />
            ) : null,
          hr: () => (
            <hr style={{ border: "none", borderTop: "1px solid var(--c-border)", margin: "32px 0" }} />
          ),
          table: ({ children }) => (
            <div style={{ overflowX: "auto", marginBottom: 18 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th style={{ textAlign: "left", padding: "10px 14px", background: "var(--c-s2)", border: "1px solid var(--c-border)", color: "var(--c-t1)", fontWeight: 700 }}>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td style={{ padding: "10px 14px", border: "1px solid var(--c-border)" }}>
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
