import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { listInvitations, deleteInvitation } from '#/server/invitation-fns'

export const Route = createFileRoute('/dashboard/')({
  loader: async () => {
    return listInvitations()
  },
  component: DashboardIndex,
})

function DashboardIndex() {
  const invitations = Route.useLoaderData()
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus undangan ini permanen?')) return
    try {
      await deleteInvitation({ data: { id } })
      router.invalidate()
    } catch (e) {
      console.error(e)
      alert('Gagal menghapus')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Invitations</h1>
        <Link
          to="/dashboard/new"
          className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-black/90"
        >
          + New Invitation
        </Link>
      </div>

      {invitations.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-xl bg-white">
          <p className="text-gray-500 mb-4">No invitations found.</p>
          <Link
            to="/dashboard/new"
            className="text-black font-medium hover:underline"
          >
            Create your first invitation
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invitations.map((inv) => (
            <div
              key={inv.id}
              className="bg-white border rounded-xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{inv.title}</h3>
                  <div className="text-xs text-gray-500 mt-1">
                    {inv.slug}.salarasa.id
                  </div>
                </div>
                <div
                  className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                    inv.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {inv.status}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t text-sm">
                <Link
                  to="/dashboard/$invitationId"
                  params={{ invitationId: inv.id }}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Edit Blocks
                </Link>
                <a
                  href={`/${inv.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-600 hover:text-black font-medium"
                >
                  View
                </a>
                <button
                  onClick={() => handleDelete(inv.id)}
                  className="text-red-500 font-medium hover:underline ml-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
