
import LeaderBoardComponent from "./LeaderBoardComponent";
import { useTheme } from "../../theme-provider";
import { useLanguage } from "../../Language/LanguageContext";
import { usePageSEO } from "../../common/SEO";

export default function LeaderboardPage() {
  const { resolvedTheme } = useTheme();
  const { language } = useLanguage();

  const isDarkMode = resolvedTheme === "dark";

  usePageSEO({
    title: "AskKh Leaderboard | Top Contributors",
    description: "Discover top question solvers, helpful contributors, and campus asset heroes on the AskKh community leaderboard.",
    keywords: "AskKh leaderboard, top developers, coding ranking, student achievements, ISTAD leaderboard",
    canonicalUrl: "https://askkh.com/leaderboard",
  });

  return (
    <LeaderBoardComponent
      dark={isDarkMode}
      lang={language}
    />
  );
}
