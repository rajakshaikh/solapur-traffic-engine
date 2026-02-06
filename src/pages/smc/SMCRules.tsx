import { SMCHeader } from "@/components/smc/SMCHeader";
import { RuleEnginePanel } from "@/components/smc/RuleEnginePanel";

export default function SMCRules() {
  return (
    <div className="min-h-screen">
      <SMCHeader 
        title="Rule Engine" 
        subtitle="System-generated traffic and parking rules" 
      />
      <div className="p-6">
        <RuleEnginePanel />
      </div>
    </div>
  );
}
