import { TopBar } from "@/components/ide/top-bar";
import { IdeShell } from "@/components/ide/ide-shell";

export default function Home() {
  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <TopBar />
      <div className="min-h-0 flex-1">
        <IdeShell />
      </div>
    </div>
  );
}
