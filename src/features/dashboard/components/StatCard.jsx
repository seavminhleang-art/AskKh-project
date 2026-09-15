import { Card, CardContent } from '@/components/ui/card';

export default function StatCard({ icon: Icon, iconBg, iconColor, label, value, subtext }) {
  return (
    <Card className="bg-gray-850 border-gray-800 rounded-xl">
      <CardContent className="p-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-body text-gray-400">{label}</span>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-100">{value}</div>
        <span className="text-lg text-gray-500">{subtext}</span>
      </CardContent>
    </Card>
  );
}