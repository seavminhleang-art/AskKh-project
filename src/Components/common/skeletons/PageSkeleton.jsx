import { useLanguage } from '../../Language/LanguageContext';
import './page-skeleton.css';

function Block({ className = '' }) {
  return <div className={`ps-block ${className}`} />;
}
function Lines() {
  return <div className="ps-lines"><Block className="ps-line"/><Block className="ps-line"/><Block className="ps-line ps-short"/></div>;
}
function Card({ image = false }) {
  return <div className="ps-card">{image && <Block className="ps-image"/>}<div className="ps-person"><Block className="ps-avatar"/><div className="ps-grow"><Block className="ps-line ps-short"/><Block className="ps-line ps-tiny"/></div></div><Lines/><div className="ps-pills"><Block/><Block/><Block/></div></div>;
}
function Heading() {
  return <div className="ps-heading"><Block className="ps-title"/><Block className="ps-line"/></div>;
}
function Home() {
  return <><div className="ps-hero"><Block className="ps-title"/><Block className="ps-title ps-short"/><Lines/><div className="ps-buttons"><Block/><Block/></div></div><Block className="ps-showcase"/><Heading/><div className="ps-grid">{[0,1,2].map(i=><Card key={i}/>)}</div></>;
}
function Community({ lostFound }) {
  if (lostFound) return <><div className="ps-lost-heading"><Heading/><Lines/></div><Block className="ps-toolbar"/><div className="ps-lost-layout"><div className="ps-feed">{[0,1,2].map(i=><div className="ps-card ps-lost-item" key={i}><Block className="ps-image"/><div className="ps-grow"><Block className="ps-title"/><Lines/><div className="ps-person"><Block className="ps-avatar"/><Block className="ps-line ps-short"/></div></div></div>)}</div><aside className="ps-feed"><Card/><Card/></aside></div></>;
  return <div className="ps-community"><aside className="ps-side ps-card"><Block className="ps-title"/>{[0,1,2,3,4].map(i=><Block key={i} className="ps-toolbar"/>)}</aside><div className="ps-feed"><Block className="ps-toolbar"/>{[0,1,2].map(i=><Card key={i}/>)}</div><aside className="ps-right"><Card/><Card/></aside></div>;
}
function Leaderboard() {
  return <><Heading/><Block className="ps-toolbar"/><div className="ps-podium">{[0,1,2].map(i=><div className="ps-card" key={i}><Block className="ps-avatar"/><Block className="ps-line"/><Block className="ps-line ps-short"/></div>)}</div><div className="ps-card">{[0,1,2,3,4].map(i=><div className="ps-ranking" key={i}><Block className="ps-avatar"/><Block className="ps-line ps-grow"/><Block className="ps-score"/></div>)}</div></>;
}
function About() {
  return <><div className="ps-split"><div><Heading/><Lines/><Block className="ps-button"/></div><Block className="ps-illustration"/></div><Heading/><div className="ps-grid ps-four">{[0,1,2,3].map(i=><Card key={i}/>)}</div><div className="ps-split"><Block className="ps-illustration"/><div><Heading/><Lines/></div></div></>;
}
export default function PageSkeleton({ pathname = '/' }) {
  const { language } = useLanguage();
  const type = pathname.startsWith('/community') ? 'community' : pathname === '/leaderboard' ? 'leaderboard' : pathname === '/about' ? 'about' : 'home';
  return <div className={`page-skeleton ps-page-${type}${pathname.includes("lost-found") ? " ps-page-lost-found" : ""}`} role="status" aria-busy="true" aria-live="polite"><span className="sr-only">{language === 'km' ? 'កំពុងផ្ទុកទំព័រ…' : `Loading ${type} page…`}</span><div aria-hidden="true">{type === 'home' ? <Home/> : type === 'community' ? <Community lostFound={pathname.includes('lost-found')}/> : type === 'leaderboard' ? <Leaderboard/> : <About/>}</div></div>;
}
