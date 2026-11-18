import { useState } from 'react';

import { Textarea } from '@/components/ui/textarea';
import { paragraphsToText, textToParagraphs } from '@/lib/nspAdmin';

interface ParagraphsFieldProps {
  id: string;
  rows?: number;
  placeholder?: string;
  /** Paragraphs, as saved */
  value?: string[];
  onChange: (paragraphs: string[]) => void;
}

/**
 * A text box for a list of paragraphs (a blank line starts a new one).
 * It keeps exactly what's typed -- including trailing spaces and blank lines --
 * and only reports the cleaned-up paragraphs. Deriving the text from the
 * trimmed paragraphs on every keystroke would swallow each space as it's typed.
 */
export function ParagraphsField({ id, rows = 4, placeholder, value, onChange }: ParagraphsFieldProps) {
  const [text, setText] = useState(() => paragraphsToText(value));

  // If the paragraphs change from outside (not by typing here), show them.
  if (JSON.stringify(textToParagraphs(text)) !== JSON.stringify(value ?? [])) {
    setText(paragraphsToText(value));
  }

  return (
    <Textarea
      id={id}
      rows={rows}
      placeholder={placeholder}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        onChange(textToParagraphs(e.target.value));
      }}
    />
  );
}
