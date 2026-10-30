import { Fragment } from "react";

// Liens et code renvoyés par Google : seuls ces deux formats, en texte sûr, sans HTML brut.
const TOKEN_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|`([^`]+)`/g;

type InlineMarkdownProps = {
  text: string;
};

export function InlineMarkdown({ text }: InlineMarkdownProps) {
  const parts: React.ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(TOKEN_PATTERN)) {
    parts.push(text.slice(cursor, match.index));
    const [token, label, href, code] = match;

    parts.push(
      href ? (
        <a
          key={match.index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent underline underline-offset-2"
        >
          {label}
        </a>
      ) : (
        <code key={match.index} className="rounded bg-surface px-1 py-0.5 font-mono text-[0.9em]">
          {code}
        </code>
      ),
    );
    cursor = match.index + token.length;
  }
  parts.push(text.slice(cursor));

  return <Fragment>{parts}</Fragment>;
}
