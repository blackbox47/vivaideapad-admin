import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

import { cn } from '@/lib/utils';

/** Prose styles aligned with `RichTextEditor` so view mode matches edit mode. */
const RICH_TEXT_PROSE_CLASS =
  'px-4 py-3.5 text-sm leading-[1.7] text-foreground focus:outline-none ' +
  '[&_p]:my-2 first:[&_p]:mt-0 last:[&_p]:mb-0 ' +
  '[&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-bold ' +
  '[&_h3]:mt-3 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold ' +
  '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 ' +
  '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 ' +
  '[&_blockquote]:border-l-4 [&_blockquote]:border-brand-forest/40 ' +
  '[&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-2 ' +
  '[&_a]:text-brand-forest [&_a]:underline hover:[&_a]:no-underline ' +
  '[&_code]:rounded [&_code]:bg-surface-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.9em] ' +
  '[&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-surface-muted [&_pre]:p-3';

interface RichTextContentProps {
  html: string;
  className?: string;
}

/**
 * Read-only TipTap renderer for submission bodies. Uses the same schema as
 * `RichTextEditor`, so authored HTML renders as formatted content (not tags)
 * and unsupported markup is dropped by ProseMirror.
 */
export default function RichTextContent({
  html,
  className,
}: RichTextContentProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
    ],
    content: html || '',
    editable: false,
    editorProps: {
      attributes: {
        class: RICH_TEXT_PROSE_CLASS,
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(html || '', { emitUpdate: false });
  }, [editor, html]);

  if (!html.trim()) {
    return (
      <div
        className={cn(
          'rounded-[14px] bg-surface-subtle p-4 text-sm text-muted-foreground',
          className,
        )}
      >
        No content
      </div>
    );
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-[14px] bg-surface-subtle',
        className,
      )}
    >
      <EditorContent editor={editor} />
    </div>
  );
}
