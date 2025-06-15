import { prisma } from "@/lib/db";
import VolunteerForm from "@/components/volunteer-form";

export default async function VolunteersPage() {
  const volunteers = await prisma.volunteer.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Volunteers</h2>
        <p className="text-muted-foreground">
          Manage volunteers and their contributions
        </p>
      </div>
      <div className="grid gap-8">
        <VolunteerForm translations={{}} languageCode="" />
        <div className="rounded-md border">
          <div className="p-4">
            <h3 className="text-lg font-medium">Volunteer List</h3>
            <div className="mt-4">
              {volunteers.length === 0 ? (
                <p className="text-muted-foreground">No volunteers yet.</p>
              ) : (
                <div className="space-y-4">
                  {volunteers.map((volunteer) => (
                    <div key={volunteer.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{volunteer.name}</p>
                        <p className="text-sm text-muted-foreground">{volunteer.email}</p>
                      </div>
                      <div className="flex gap-2">
                        {volunteer.translations && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Translations</span>}
                        {volunteer.recordings && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Recordings</span>}
                        {volunteer.boards && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Boards</span>}
                        {volunteer.installations && <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Installations</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 