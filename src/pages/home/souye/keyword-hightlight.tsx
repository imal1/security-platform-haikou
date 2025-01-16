import React from "react";
interface KeywordHighlighterProps {
  text?: string;
  keyword?: string;
}
const KeywordHighlighter = ({ text, keyword }: KeywordHighlighterProps) => {
  if (!keyword) {
    return <>{{ text }}</>;
  }
  const parts = text?.split(new RegExp(`(${keyword})`, "gi"));
  return (
    <>
      {parts.map((part, index) => (
        <span key={index}>
          {part.toLowerCase() === keyword.toLowerCase() ? (
            <strong style={{ color: "#f8fc13cf" }}>{part}</strong>
          ) : (
            part
          )}
        </span>
      ))}
    </>
  );
};
export default KeywordHighlighter;
