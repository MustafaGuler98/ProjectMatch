import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { api } from "~/trpc/server";
import { FcAdvertising, FcConferenceCall, FcSearch, FcIdea } from "react-icons/fc";

export default async function DashboardPage() {
  const campaigns = await api.campaign.getAll();
  const creators = await api.creator.getAll();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
          <span className="text-xl">🚀</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            System Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Overview of available records and tools.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-5">
        <Card className="bg-white border-l-4 border-l-slate-300 shadow-sm">
          <CardHeader>
            <CardDescription className="flex items-center gap-2 font-medium text-slate-500">
              <FcAdvertising className="h-5 w-5" /> Total Campaigns
            </CardDescription>
            <CardTitle className="text-4xl text-slate-800">
              {campaigns?.length ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-white border-l-4 border-l-slate-300 shadow-sm">
          <CardHeader>
            <CardDescription className="flex items-center gap-2 font-medium text-slate-500">
              <FcConferenceCall className="h-5 w-5" /> Total Creators
            </CardDescription>
            <CardTitle className="text-4xl text-slate-800">
              {creators?.length ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-5">
        <Link href="/matching" className="group">
          <Card className="bg-white h-full transition-all duration-200 hover:shadow-lg hover:border-slate-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg text-slate-800">
                <div className="rounded-lg bg-slate-50 p-2 group-hover:bg-slate-100 transition-colors">
                  <FcSearch className="h-6 w-6" />
                </div>
                Campaign Matching
              </CardTitle>
              <CardDescription className="mt-2 text-slate-600">
                Match creators to campaigns and see the detailed score breakdown.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/brief" className="group">
          <Card className="bg-white h-full transition-all duration-200 hover:shadow-lg hover:border-slate-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg text-slate-800">
                <div className="rounded-lg bg-slate-50 p-2 group-hover:bg-slate-100 transition-colors">
                  <FcIdea className="h-6 w-6" />
                </div>
                Brief Generator
              </CardTitle>
              <CardDescription className="mt-2 text-slate-600">
                Generate outreach messages and content ideas for selected creators.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}