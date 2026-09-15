import { CircleHelp, PackagePlus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../Components/ui/card';
import Button from '../../../Components/ui/button';

export default function QuickActionsCard() {
  return <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"><CardHeader className="pb-3"><CardTitle>Quick Actions</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-3"><Button className="bg-brand-primary hover:bg-brand-primary/90"><Search />Report Lost Item</Button><Button variant="outline"><PackagePlus />Report Found Item</Button><Button variant="outline"><CircleHelp />Ask a Question</Button></CardContent></Card>;
}
