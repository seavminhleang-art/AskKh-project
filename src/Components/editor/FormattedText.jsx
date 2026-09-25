import ReactMarkdown from "react-markdown";

export default function FormattedText({ children }) {
  return <div className="formatted-text"><ReactMarkdown disallowedElements={["img"]}>{String(children ?? "")}</ReactMarkdown></div>;
}
