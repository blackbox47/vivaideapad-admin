import * as React from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
} from 'lucide-react';

import { cn } from '@/lib/utils';

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  errorMessage?: string | null;
  className?: string;
  id?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-describedby'?: string;
  minHeight?: number;
}

function ToolbarButton({
  active,
  disabled,
  onClick,
  label,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active ? true : undefined}
      title={label}
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-md transition-colors cursor-pointer',
        'text-muted-foreground hover:bg-surface-subtle hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-forest/40',
        active && 'bg-brand-forest/10 text-brand-forest',
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
      )}
    >
      {children}
    </button>
  );
}

function RichTextToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const setLink = () => {
    const previous = (editor.getAttributes('link').href as string | undefined) ?? '';
    const input = window.prompt('URL', previous || 'https://');
    if (input === null) return;
    const trimmed = input.trim();
    if (trimmed === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: trimmed })
      .run();
  };

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="flex flex-wrap items-center gap-0.5 border-b border-border bg-surface-subtle/60 px-2 py-1.5"
    >
      <ToolbarButton
        label="Bold"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
      <ToolbarButton
        label="Heading 2"
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
      <ToolbarButton
        label="Bullet list"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="Blockquote"
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="Link"
        active={editor.isActive('link')}
        onClick={setLink}
      >
        <LinkIcon className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
      <ToolbarButton
        label="Undo"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 className="size-4" aria-hidden="true" />
      </ToolbarButton>
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  disabled = false,
  errorMessage,
  className,
  id,
  minHeight = 160,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: RichTextEditorProps) {
  // Stable extensions array.
  const extensions = React.useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? '',
      }),
    ],
    // Note: Placeholder reads from initial config; if it must change
    // dynamically, update via editor.extensionManager. Empty deps keep the
    // extensions array stable across renders.
    [],
  );

  const isInvalid = ariaInvalid === true || ariaInvalid === 'true';

  const editor = useEditor({
    extensions,
    content: value ?? '',
    editable: !disabled,
    onUpdate({ editor: ed }) {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        ...(isInvalid ? { 'aria-invalid': 'true' } : {}),
        ...(ariaDescribedBy ? { 'aria-describedby': ariaDescribedBy } : {}),
        class:
          'px-4 py-3.5 text-base text-foreground focus:outline-none [&_*]:outline-none ' +
          '[&_p]:my-2 ' +
          '[&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-bold ' +
          '[&_h3]:mt-3 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold ' +
          '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 ' +
          '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 ' +
          '[&_blockquote]:border-l-4 [&_blockquote]:border-brand-forest/40 ' +
          '[&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-2 ' +
          '[&_a]:text-brand-forest [&_a]:underline hover:[&_a]:no-underline ' +
          '[&_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] ' +
          '[&_p.is-editor-empty:first-child]:before:text-muted-foreground ' +
          '[&_p.is-editor-empty:first-child]:before:float-left ' +
          '[&_p.is-editor-empty:first-child]:before:h-0 ' +
          '[&_p.is-editor-empty:first-child]:before:pointer-events-none',
        style: `min-height: ${minHeight}px; max-height: 60vh; overflow-y: auto;`,
      },
    },
  });

  // External-value sync.
  const lastEmittedRef = React.useRef(value);
  React.useEffect(() => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    if (value !== currentHtml && value !== lastEmittedRef.current) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
    lastEmittedRef.current = value;
  }, [value, editor]);

  React.useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
    if (disabled) editor.commands.blur();
  }, [disabled, editor]);

  return (
    <div className="w-full">
      <div
        aria-disabled={disabled || undefined}
        className={cn(
          'rounded-xl border border-border bg-card transition-colors overflow-hidden',
          'focus-within:border-brand-forest focus-within:ring-2 focus-within:ring-brand-forest/15',
          'aria-disabled:opacity-60',
          className,
        )}
      >
        <RichTextToolbar editor={editor} />
        <EditorContent editor={editor} />
      </div>
      {errorMessage ? (
        <p
          role="alert"
          className="mt-1.5 text-xs font-semibold text-destructive"
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}