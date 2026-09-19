import LeaderBoardComponent from "./LeaderBoardComponent";
import { useTheme } from "../../theme-provider";
import { useLanguage } from "../../Language/LanguageContext";




export default function LeaderboardPage() {
  const { resolvedTheme } = useTheme();
  const { language } = useLanguage();

  return (
    <LeaderBoardComponent
        dark={resolvedTheme === "dark"}
        lang={language}
      />
  );
}
