import Navbar from "../../Nav/NavBarComponent";
import FooterComponent from "../../Footer/FooterComponet";
import LeaderBoardComponent from "./LeaderBoardComponent";
import { useTheme } from "../../../components/theme-provider";
import { useLanguage } from "../../Language/LanguageContext";




export default function LeaderboardPage() {
  const { resolvedTheme } = useTheme();
  const { language } = useLanguage();

  return (
    <>
      <Navbar />
      <LeaderBoardComponent
        dark={resolvedTheme === "dark"}
        lang={language}
      />
      <FooterComponent />
    </>
  );
}
