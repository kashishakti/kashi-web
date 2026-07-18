'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  content: string
}

export default function RichTextRenderer({ content }: Props) {
  return (
    <div className="blog-rich-text">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
