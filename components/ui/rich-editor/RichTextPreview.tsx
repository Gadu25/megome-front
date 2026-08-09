export default function RichTextPreview({ html }: { html: string }) {
  return (
    <div
      className="prose prose-sm max-w-none text-base-content/80 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-semibold [&_p]:text-sm [&_ul]:text-sm [&_ol]:text-sm [&_blockquote]:text-sm [&_blockquote]:border-l-2 [&_blockquote]:border-base-300 [&_blockquote]:pl-3 [&_blockquote]:italic [&_code]:text-xs [&_code]:bg-base-200 [&_code]:px-1 [&_code]:rounded [&_pre]:bg-base-200 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:text-xs [&_pre]:overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
