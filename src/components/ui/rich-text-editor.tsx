import * as React from 'react';
import { createPortal } from 'react-dom';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import { BubbleMenuPlugin } from '@tiptap/extension-bubble-menu';
import { PluginKey } from '@tiptap/pm/state';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Plus,
  Quote,
  Redo2,
  Strikethrough,
  Table as TableIcon,
  TrendingUp,
  Underline as UnderlineIcon,
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
  maxLength?: number;
  floatingMenu?: boolean;
}

function ToolbarButton({
  active,
  disabled,
  onClick,
  label,
  children,
  size = 'md',
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  size?: 'sm' | 'md';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active ? true : undefined}
      title={label}
      className={cn(
        'inline-flex items-center justify-center rounded-md transition-colors cursor-pointer',
        size === 'sm' ? 'size-7' : 'size-7 sm:size-8',
        'text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-200 dark:hover:text-neutral-900',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-forest/40',
        active && 'bg-brand-forest/10 text-brand-forest font-semibold dark:bg-brand-forest/20',
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
      )}
    >
      {children}
    </button>
  );
}

function HeadingDropdown({ editor }: { editor: Editor }) {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  let currentLabel = 'P';
  let isHeading = false;
  if (editor.isActive('heading', { level: 1 })) {
    currentLabel = 'H₁';
    isHeading = true;
  } else if (editor.isActive('heading', { level: 2 })) {
    currentLabel = 'H₂';
    isHeading = true;
  } else if (editor.isActive('heading', { level: 3 })) {
    currentLabel = 'H₃';
    isHeading = true;
  }

  return (
    <div className="relative inline-flex items-center" ref={dropdownRef}>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((prev) => !prev)}
        title="Heading style"
        className={cn(
          'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer',
          isHeading
            ? 'bg-violet-100/80 text-violet-700 dark:bg-violet-200/80 dark:text-violet-800 hover:bg-neutral-200'
            : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-200 dark:text-neutral-700 hover:bg-neutral-200 hover:text-foreground',
        )}
      >
        <span>{currentLabel}</span>
        <ChevronDown className="size-3 opacity-70" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full mt-1.5 z-50 min-w-[130px] rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-100"
        >
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              editor.chain().focus().setParagraph().run();
              setOpen(false);
            }}
            className={cn(
              'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-colors hover:bg-surface-subtle',
              !isHeading && 'text-brand-forest font-semibold bg-brand-forest/10',
            )}
          >
            <span>Paragraph</span>
            <span className="text-[10px] text-muted-foreground">P</span>
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 1 }).run();
              setOpen(false);
            }}
            className={cn(
              'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-colors hover:bg-surface-subtle',
              editor.isActive('heading', { level: 1 }) && 'text-brand-forest font-semibold bg-brand-forest/10',
            )}
          >
            <span>Heading 1</span>
            <span className="text-[10px] text-muted-foreground">H₁</span>
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 2 }).run();
              setOpen(false);
            }}
            className={cn(
              'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-colors hover:bg-surface-subtle',
              editor.isActive('heading', { level: 2 }) && 'text-brand-forest font-semibold bg-brand-forest/10',
            )}
          >
            <span>Heading 2</span>
            <span className="text-[10px] text-muted-foreground">H₂</span>
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 3 }).run();
              setOpen(false);
            }}
            className={cn(
              'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-colors hover:bg-surface-subtle',
              editor.isActive('heading', { level: 3 }) && 'text-brand-forest font-semibold bg-brand-forest/10',
            )}
          >
            <span>Heading 3</span>
            <span className="text-[10px] text-muted-foreground">H₃</span>
          </button>
        </div>
      )}
    </div>
  );
}

function ListDropdown({ editor }: { editor: Editor }) {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const isListActive = editor.isActive('bulletList') || editor.isActive('orderedList');

  return (
    <div className="relative inline-flex items-center" ref={dropdownRef}>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((prev) => !prev)}
        title="List options"
        className={cn(
          'inline-flex items-center gap-0.5 px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-200',
          isListActive
            ? 'bg-brand-forest/10 text-brand-forest font-semibold'
            : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-900',
        )}
      >
        <List className="size-4" aria-hidden="true" />
        <ChevronDown className="size-3 opacity-70" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full mt-1.5 z-50 min-w-[130px] rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-100"
        >
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              editor.chain().focus().toggleBulletList().run();
              setOpen(false);
            }}
            className={cn(
              'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-colors hover:bg-surface-subtle',
              editor.isActive('bulletList') && 'text-brand-forest font-semibold bg-brand-forest/10',
            )}
          >
            <List className="size-3.5" aria-hidden="true" />
            <span>Bullet list</span>
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              editor.chain().focus().toggleOrderedList().run();
              setOpen(false);
            }}
            className={cn(
              'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-colors hover:bg-surface-subtle',
              editor.isActive('orderedList') && 'text-brand-forest font-semibold bg-brand-forest/10',
            )}
          >
            <ListOrdered className="size-3.5" aria-hidden="true" />
            <span>Numbered list</span>
          </button>
        </div>
      )}
    </div>
  );
}

function ZoomControl({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}: {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onZoomOut}
        disabled={zoom <= 50}
        title="Zoom out"
        className="size-5 rounded-full bg-neutral-200 hover:bg-neutral-200 dark:bg-neutral-200 dark:hover:bg-neutral-200 flex items-center justify-center text-neutral-700 dark:text-neutral-700 transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
      >
        <Minus className="size-3" aria-hidden="true" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onResetZoom}
        title="Reset zoom"
        className="min-w-[38px] rounded-md text-center font-medium text-xs hover:bg-neutral-200 hover:text-foreground dark:hover:bg-neutral-200 transition-colors cursor-pointer select-none"
      >
        {zoom}%
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onZoomIn}
        disabled={zoom >= 200}
        title="Zoom in"
        className="size-5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-200 flex items-center justify-center text-neutral-600 dark:text-neutral-700 transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
      >
        <Plus className="size-3" aria-hidden="true" />
      </button>
    </div>
  );
}

function RichTextToolbar({
  editor,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}: {
  editor: Editor | null;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}) {
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    if (!editor) return undefined;
    const update = () => setTick((t) => t + 1);
    editor.on('transaction', update);
    editor.on('selectionUpdate', update);
    return () => {
      editor.off('transaction', update);
      editor.off('selectionUpdate', update);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      data-rich-text-toolbar=""
      className="flex shrink-0 flex-wrap items-center gap-1 border-b border-border/40 bg-card px-2.5 py-2 select-none"
    >
      {/* 1. History: Undo & Redo */}
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

      {/* 2. Zoom Controls */}
      <ZoomControl
        zoom={zoom}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onResetZoom={onResetZoom}
      />

      <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1 shrink-0" aria-hidden="true" />

      {/* 3. Heading & List Dropdowns */}
      <HeadingDropdown editor={editor} />
      <ListDropdown editor={editor} />

      <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1 shrink-0" aria-hidden="true" />

      {/* 4. Text Formatting Marks: B, I, S, U, Highlighter */}
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
      <ToolbarButton
        label="Strikethrough"
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="Highlight"
        active={editor.isActive('highlight')}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        <Highlighter className="size-4" aria-hidden="true" />
      </ToolbarButton>

      <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1 shrink-0" aria-hidden="true" />

      {/* 5. Text Alignment: Left, Center, Right, Justify */}
      <ToolbarButton
        label="Align left"
        active={editor.isActive({ textAlign: 'left' })}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <AlignLeft className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="Align center"
        active={editor.isActive({ textAlign: 'center' })}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <AlignCenter className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="Align right"
        active={editor.isActive({ textAlign: 'right' })}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <AlignRight className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="Justify"
        active={editor.isActive({ textAlign: 'justify' })}
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <AlignJustify className="size-4" aria-hidden="true" />
      </ToolbarButton>

      <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1 shrink-0" aria-hidden="true" />

      {/* 6. Table & Extra (LineChart / Quote / Metrics) */}
      <ToolbarButton
        label="Insert table"
        active={editor.isActive('table')}
        onClick={() => {
          if (editor.isActive('table')) {
            editor.chain().focus().deleteTable().run();
          } else {
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
          }
        }}
      >
        <TableIcon className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        label="Callout / Quote"
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <TrendingUp className="size-4" aria-hidden="true" />
      </ToolbarButton>
    </div>
  );
}

function RichTextFloatingMenu({ editor }: { editor: Editor | null }) {
  const [, setTick] = React.useState(0);

  const container = React.useMemo(() => {
    if (typeof document === 'undefined') return null;
    const el = document.createElement('div');
    el.className = 'tiptap-floating-menu-container';
    el.style.zIndex = '9999';
    return el;
  }, []);

  React.useEffect(() => {
    if (!editor) return undefined;
    const update = () => setTick((t) => t + 1);
    editor.on('transaction', update);
    editor.on('selectionUpdate', update);
    return () => {
      editor.off('transaction', update);
      editor.off('selectionUpdate', update);
    };
  }, [editor]);

  React.useEffect(() => {
    if (!editor || !container) return undefined;

    const pluginKey = new PluginKey('floatingMenu');
    const plugin = BubbleMenuPlugin({
      pluginKey,
      editor,
      element: container,
      updateDelay: 80,
      appendTo: () => document.body,
      options: {
        strategy: 'fixed',
        placement: 'top',
        offset: 8,
        flip: true,
        shift: true,
      },
      shouldShow: ({ editor: ed, state, from, to }) => {
        if (!ed.isEditable) return false;
        const { selection } = state;
        if (selection.empty || from === to) return false;
        const text = state.doc.textBetween(from, to, ' ').trim();
        return text.length > 0;
      },
    });

    editor.registerPlugin(plugin);

    return () => {
      editor.unregisterPlugin(pluginKey);
      container.remove();
    };
  }, [editor, container]);

  if (!editor || !container) return null;

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

  return createPortal(
    <div
      role="toolbar"
      aria-label="Floating formatting options"
      className={cn(
        'z-50 flex items-center gap-0.5 rounded-xl border border-border/80 bg-popover/95 p-1 text-popover-foreground shadow-xl backdrop-blur-md',
        'animate-in fade-in-0 zoom-in-95 duration-150',
      )}
    >
      <ToolbarButton
        size="sm"
        label="Bold"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-3.5" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        size="sm"
        label="Italic"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-3.5" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        size="sm"
        label="Strikethrough"
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="size-3.5" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        size="sm"
        label="Underline"
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="size-3.5" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        size="sm"
        label="Highlight"
        active={editor.isActive('highlight')}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        <Highlighter className="size-3.5" aria-hidden="true" />
      </ToolbarButton>
      <span className="mx-0.5 h-4 w-px bg-border/60" aria-hidden="true" />
      <ToolbarButton
        size="sm"
        label="Heading 2"
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="size-3.5" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        size="sm"
        label="Heading 3"
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="size-3.5" aria-hidden="true" />
      </ToolbarButton>
      <span className="mx-0.5 h-4 w-px bg-border/60" aria-hidden="true" />
      <ToolbarButton
        size="sm"
        label="Bullet list"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="size-3.5" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        size="sm"
        label="Numbered list"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-3.5" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        size="sm"
        label="Blockquote"
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="size-3.5" aria-hidden="true" />
      </ToolbarButton>
      <span className="mx-0.5 h-4 w-px bg-border/60" aria-hidden="true" />
      <ToolbarButton
        size="sm"
        label="Link"
        active={editor.isActive('link')}
        onClick={setLink}
      >
        <LinkIcon className="size-3.5" aria-hidden="true" />
      </ToolbarButton>
    </div>,
    container,
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
  minHeight = 180,
  maxLength,
  floatingMenu = true,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: RichTextEditorProps) {
  const [zoom, setZoom] = React.useState(100);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  // Stable extensions array.
  const extensions = React.useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
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
      ...(maxLength != null
        ? [
            CharacterCount.configure({
              limit: maxLength,
              autoTrim: false,
            }),
          ]
        : []),
    ],
    [maxLength, placeholder],
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
          'flex-1 min-h-0 overflow-y-auto px-4 py-3.5 text-base text-foreground focus:outline-none [&_*]:outline-none ' +
          '[&_p]:my-2 ' +
          '[&_h1]:mt-5 [&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-extrabold ' +
          '[&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-bold ' +
          '[&_h3]:mt-3 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold ' +
          '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 ' +
          '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 ' +
          '[&_blockquote]:border-l-4 [&_blockquote]:border-brand-forest/40 ' +
          '[&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-2 ' +
          '[&_a]:text-brand-forest [&_a]:underline hover:[&_a]:no-underline ' +
          '[&_u]:underline ' +
          '[&_mark]:bg-violet-100 [&_mark]:text-violet-900 [&_mark]:dark:bg-violet-900/50 [&_mark]:dark:text-violet-100 [&_mark]:px-1 [&_mark]:py-0.5 [&_mark]:rounded ' +
          '[&_table]:border-collapse [&_table]:table-auto [&_table]:w-full [&_table]:my-3 ' +
          '[&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold ' +
          '[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 ' +
          '[&_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] ' +
          '[&_p.is-editor-empty:first-child]:before:text-muted-foreground ' +
          '[&_p.is-editor-empty:first-child]:before:float-left ' +
          '[&_p.is-editor-empty:first-child]:before:h-0 ' +
          '[&_p.is-editor-empty:first-child]:before:pointer-events-none',
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

  React.useEffect(() => {
    if (!editor || maxLength == null) return;
    const extension = editor.extensionManager.extensions.find(
      (ext) => ext.name === 'characterCount',
    );
    if (extension) {
      extension.options.limit = maxLength;
    }
  }, [maxLength, editor]);

  return (
    <div className="w-full">
      <div
        aria-disabled={disabled || undefined}
        style={{ minHeight: `${minHeight}px` }}
        className={cn(
          'flex flex-col rounded-xl border border-border bg-card transition-colors resize-y overflow-hidden',
          'focus-within:border-brand-forest focus-within:ring-2 focus-within:ring-brand-forest/15',
          'aria-disabled:opacity-60 aria-disabled:resize-none',
          disabled && 'resize-none pointer-events-none',
          className,
        )}
      >
        <RichTextToolbar
          editor={editor}
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
        />
        {floatingMenu && !disabled ? (
          <RichTextFloatingMenu editor={editor} />
        ) : null}
        <EditorContent
          editor={editor}
          style={{ zoom: `${zoom}%` }}
          className="flex flex-1 flex-col min-h-0 cursor-text"
          onClick={() => {
            if (editor && !editor.isFocused) {
              editor.commands.focus('end');
            }
          }}
        />
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