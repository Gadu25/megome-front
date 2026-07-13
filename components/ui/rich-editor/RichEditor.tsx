"use client"

import { useEffect, useRef } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

type Props = {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

type ToolbarButtonProps = {
  onClick: () => void
  isActive?: boolean
  label: string
  shortcut?: string
}

function ToolbarButton({ onClick, isActive, label, shortcut }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={shortcut ? `${label} (${shortcut})` : label}
      className={`px-2.5 py-1 text-sm font-medium rounded-md transition-colors cursor-pointer ${
        isActive
          ? "bg-primary/20 text-primary"
          : "text-base-content/60 hover:text-base-content hover:bg-base-300/50"
      }`}
    >
      {label}
    </button>
  )
}

export default function RichEditor({ content, onChange }: Props) {
  const isProgrammatic = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      if (!isProgrammatic.current) {
        onChange(editor.getHTML())
      }
    },
    editorProps: {
      attributes: {
        class:
          "p-3 min-h-[120px] focus:outline-none text-base",
      },
    },
  })

  useEffect(() => {
    if (!editor || !content) return
    if (content === editor.getHTML()) return
    isProgrammatic.current = true
    editor.commands.setContent(content)
    isProgrammatic.current = false
  }, [content, editor])

  if (!editor) return null

  return (
    <div className="border border-base-content/20 rounded-box overflow-hidden bg-base-100">
      <div className="flex flex-wrap gap-1 p-2 bg-base-200/50 border-b border-base-content/10">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          label="B"
          shortcut="Ctrl+B"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          label="I"
          shortcut="Ctrl+I"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          label="S"
          shortcut="Ctrl+Shift+S"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          label="<>"
          shortcut="Ctrl+E"
        />
        <span className="w-px bg-base-content/10 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          label="H2"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          label="H3"
        />
        <span className="w-px bg-base-content/10 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          label="• List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          label="1. List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          label="Quote"
        />
        <span className="w-px bg-base-content/10 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          label="↩"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          label="↪"
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
