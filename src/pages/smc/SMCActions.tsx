import { SMCHeader } from "@/components/smc/SMCHeader";
import { DailyActionList } from "@/components/smc/DailyActionList";

export default function SMCActions() {
  return (
    <div className="min-h-screen">
      <SMCHeader 
        title="Daily Action List" 
        subtitle="Today's enforcement priorities" 
      />
      <div className="p-6">
        <DailyActionList />
      </div>
    </div>
  );
}
