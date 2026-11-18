import { useState } from 'react';
import { describe, expect, test } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { ParagraphsField } from './ParagraphsField';

function Harness({ onChange }: { onChange?: (p: string[]) => void }) {
  const [value, setValue] = useState<string[] | undefined>(undefined);
  return (
    <ParagraphsField
      id="notes"
      value={value}
      onChange={(p) => {
        setValue(p);
        onChange?.(p);
      }}
    />
  );
}

describe('ParagraphsField', () => {
  test('keeps trailing spaces and blank lines while typing', () => {
    const seen: string[][] = [];
    render(<Harness onChange={(p) => seen.push(p)} />);
    const box = screen.getByRole('textbox') as HTMLTextAreaElement;

    fireEvent.change(box, { target: { value: 'thanks ' } });
    expect(box.value).toBe('thanks ');

    fireEvent.change(box, { target: { value: 'thanks everyone\n\n' } });
    expect(box.value).toBe('thanks everyone\n\n');

    fireEvent.change(box, { target: { value: 'thanks everyone\n\nsee you next month' } });
    expect(box.value).toBe('thanks everyone\n\nsee you next month');
    expect(seen.at(-1)).toEqual(['thanks everyone', 'see you next month']);
  });

  test('shows paragraphs that were already saved', () => {
    render(<ParagraphsField id="n" value={['One.', 'Two.']} onChange={() => {}} />);
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toBe('One.\n\nTwo.');
  });
});
