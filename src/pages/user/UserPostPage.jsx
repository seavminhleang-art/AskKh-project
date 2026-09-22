import CreateQuestionPage from "./CreateQuestionPage";
import CreateReportPage from "./CreateReportPage";

export default function UserPostPage({ kind }) {
  return kind === "question" ? <CreateQuestionPage /> : <CreateReportPage />;
}
