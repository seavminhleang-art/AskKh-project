import LeaderBoardComponent from "./LeaderBoardComponent";
import { useTheme } from "../../theme-provider";
import { useLanguage } from "../../Language/LanguageContext";
import { usePageSEO } from "../../common/SEO";

export default function LeaderboardPage() {
  const { resolvedTheme } = useTheme();
  const { language } = useLanguage();

  const isDarkMode = resolvedTheme === "dark";

  usePageSEO({
    title: "Leaderboard | Top Contributors | NEXA",
    description:
      "Discover top question solvers, helpful developers, and campus asset recovery heroes on the NEXA community leaderboard.",
    keywords:
      "NEXA leaderboard, top developers Cambodia, coding ranking, student achievements, ISTAD leaderboard",
    canonicalUrl: "https://ask-kh-project.vercel.app/leaderboard",
  });

  return <LeaderBoardComponent dark={isDarkMode} lang={language} />;
}
