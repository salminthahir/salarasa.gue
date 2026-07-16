import { createFileRoute, notFound, useRouter } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  getInvitation,
  updateBlock,
  updateInvitationMeta,
  listGreetings,
  deleteGreeting,
  listRsvp,
  deleteRsvp,
} from '#/server/invitation-fns'

export const Route = createFileRoute('/dashboard/$invitationId')({
  loader: async ({ params }) => {
    try {
      return await getInvitation({ data: { id: params.invitationId } })
    } catch {
      throw notFound()
    }
  },
  component: EditInvitationPage,
})

type TabType = 'editor' | 'guestbook' | 'rsvp'

function EditInvitationPage() {
  const { invitation, blocks } = Route.useLoaderData()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('editor')
  const [activeBlock, setActiveBlock] = useState<number | null>(
    blocks[0]?.id ?? null,
  )

  const currentBlock = blocks.find((b) => b.id === activeBlock)

  const handleToggleActive = async (blockId: number, isActive: boolean) => {
    await updateBlock({
      data: { blockId, invitationId: invitation.id, isActive },
    })
    router.invalidate()
  }

  const handleConfigChange = async (
    blockId: number,
    key: string,
    value: any,
  ) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block) return
    const newConfig = { ...block.config, [key]: value }
    await updateBlock({
      data: { blockId, invitationId: invitation.id, config: newConfig },
    })
    router.invalidate()
  }

  const toggleStatus = async () => {
    const nextStatus = invitation.status === 'published' ? 'draft' : 'published'
    await updateInvitationMeta({
      data: { id: invitation.id, status: nextStatus },
    })
    router.invalidate()
  }

  // Guestbook & RSVP state
  const [greetings, setGreetings] = useState<any[]>([])
  const [rsvps, setRsvps] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(false)

  const fetchData = async () => {
    if (activeTab === 'editor') return
    setLoadingData(true)
    try {
      if (activeTab === 'guestbook') {
        const res = await listGreetings({
          data: { invitationId: invitation.id, page: 1, perPage: 100 }, // load top 100 for dashboard
        })
        setGreetings(res.rows)
      } else if (activeTab === 'rsvp') {
        const res = await listRsvp({
          data: { invitationId: invitation.id },
        })
        setRsvps(res)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const handleDeleteGreeting = async (id: number) => {
    if (!confirm('Yakin ingin menghapus komentar ini?')) return
    await deleteGreeting({ data: { id, invitationId: invitation.id } })
    fetchData()
  }

  const handleDeleteRsvp = async (id: number) => {
    if (!confirm('Yakin ingin menghapus data RSVP tamu ini?')) return
    await deleteRsvp({ data: { id, invitationId: invitation.id } })
    fetchData()
  }

  return (
    <div className="flex h-[calc(100vh-100px)] -m-6 flex-col">
      {/* Top Header / Tabs */}
      <div className="flex items-center justify-between border-b bg-white px-6 py-4 shrink-0">
        <div className="flex items-center gap-6">
          <h2 className="font-semibold text-lg">{invitation.title}</h2>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-md">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-1.5 text-sm font-medium rounded ${activeTab === 'editor' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-black'}`}
            >
              Editor
            </button>
            <button
              onClick={() => setActiveTab('guestbook')}
              className={`px-4 py-1.5 text-sm font-medium rounded ${activeTab === 'guestbook' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-black'}`}
            >
              Guestbook
            </button>
            <button
              onClick={() => setActiveTab('rsvp')}
              className={`px-4 py-1.5 text-sm font-medium rounded ${activeTab === 'rsvp' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-black'}`}
            >
              RSVP Data
            </button>
          </div>
        </div>
        <button
          onClick={toggleStatus}
          className={`text-sm px-4 py-1.5 rounded-full font-medium transition-colors ${
            invitation.status === 'published'
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
          }`}
        >
          Status: {invitation.status}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {activeTab === 'editor' && (
          <>
            {/* Sidebar Blocks List */}
            <div className="w-64 bg-white border-r flex flex-col h-full shrink-0">
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {blocks.map((b) => (
                  <div
                    key={b.id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                      activeBlock === b.id
                        ? 'bg-black text-white'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveBlock(b.id)}
                  >
                    <span className="text-sm font-medium capitalize truncate">
                      {b.blockType.replace('_', ' ')}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleActive(b.id, !b.isActive)
                      }}
                      className={`w-3 h-3 rounded-full ${
                        b.isActive ? 'bg-green-400' : 'bg-gray-300'
                      }`}
                      title={b.isActive ? 'Active' : 'Hidden'}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Block Config Editor */}
            <div className="flex-1 bg-gray-50 overflow-y-auto p-8">
              {currentBlock ? (
                <div className="max-w-2xl mx-auto bg-white rounded-xl border p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6 border-b pb-4">
                    <h3 className="text-xl font-semibold capitalize">
                      {currentBlock.blockType.replace('_', ' ')} Settings
                    </h3>
                    <a
                      href={`/${invitation.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Preview Undangan ↗
                    </a>
                  </div>

                  <div className="space-y-5">
                    {Object.entries(currentBlock.config).map(([key, value]) => {
                      if (typeof value === 'boolean') {
                        return (
                          <label key={key} className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) =>
                                handleConfigChange(
                                  currentBlock.id,
                                  key,
                                  e.target.checked,
                                )
                              }
                              className="w-4 h-4 rounded text-black focus:ring-black"
                            />
                            <span className="font-medium text-gray-700 capitalize">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </span>
                          </label>
                        )
                      }
                      if (typeof value === 'number') {
                        return (
                          <div key={key}>
                            <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </label>
                            <input
                              type="number"
                              value={value}
                              onChange={(e) =>
                                handleConfigChange(
                                  currentBlock.id,
                                  key,
                                  Number(e.target.value),
                                )
                              }
                              className="w-full px-3 py-2 border rounded-md focus:ring-black focus:border-black"
                            />
                          </div>
                        )
                      }
                      return (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </label>
                          {String(value).length > 50 ? (
                            <textarea
                              value={value as string}
                              onChange={(e) =>
                                handleConfigChange(
                                  currentBlock.id,
                                  key,
                                  e.target.value,
                                )
                              }
                              rows={3}
                              className="w-full px-3 py-2 border rounded-md focus:ring-black focus:border-black"
                            />
                          ) : (
                            <input
                              type="text"
                              value={value as string}
                              onChange={(e) =>
                                handleConfigChange(
                                  currentBlock.id,
                                  key,
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border rounded-md focus:ring-black focus:border-black"
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Select a block to edit its configuration
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'guestbook' && (
          <div className="flex-1 bg-gray-50 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl border p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-6 border-b pb-4">
                Guestbook Management
              </h3>
              {loadingData ? (
                <p className="text-gray-500">Loading...</p>
              ) : greetings.length === 0 ? (
                <p className="text-gray-500">Belum ada komentar.</p>
              ) : (
                <div className="space-y-4">
                  {greetings.map((g) => (
                    <div key={g.id} className="flex justify-between items-start p-4 border rounded-lg hover:bg-gray-50">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <strong className="font-semibold">{g.name}</strong>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            g.attendance === 'hadir' ? 'bg-green-100 text-green-700' :
                            g.attendance === 'absen' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {g.attendance}
                          </span>
                          <span className="text-xs text-gray-400 ml-2">
                            {new Date(g.createdAt).toLocaleString('id-ID')}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm mt-2">{g.message}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteGreeting(g.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'rsvp' && (
          <div className="flex-1 bg-gray-50 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl border p-6 shadow-sm">
              <div className="flex justify-between items-end border-b pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-semibold mb-1">RSVP Management</h3>
                  <p className="text-sm text-gray-500">Daftar tamu yang telah mengisi form konfirmasi kehadiran.</p>
                </div>
                <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
                  Total Hadir: <strong className="text-black">{rsvps.filter(r => r.attendance === 'hadir').reduce((acc, curr) => acc + curr.jumlahTamu, 0)} orang</strong>
                </div>
              </div>
              {loadingData ? (
                <p className="text-gray-500">Loading...</p>
              ) : rsvps.length === 0 ? (
                <p className="text-gray-500">Belum ada data RSVP.</p>
              ) : (
                <div className="overflow-hidden border rounded-lg">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 font-medium text-gray-600">Nama Tamu</th>
                        <th className="px-4 py-3 font-medium text-gray-600">Kehadiran</th>
                        <th className="px-4 py-3 font-medium text-gray-600">Jml Orang</th>
                        <th className="px-4 py-3 font-medium text-gray-600">Tanggal Input</th>
                        <th className="px-4 py-3 font-medium text-gray-600 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {rsvps.map((r) => (
                        <tr key={r.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{r.guestName}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              r.attendance === 'hadir' ? 'bg-green-100 text-green-700' :
                              r.attendance === 'absen' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {r.attendance}
                            </span>
                          </td>
                          <td className="px-4 py-3">{r.jumlahTamu}</td>
                          <td className="px-4 py-3 text-gray-500">
                            {new Date(r.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleDeleteRsvp(r.id)}
                              className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 hover:bg-red-50 rounded"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
