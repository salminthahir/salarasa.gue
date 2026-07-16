import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { createInvitation } from '#/server/invitation-fns'

export const Route = createFileRoute('/dashboard/new')({
  component: NewInvitationPage,
})

function NewInvitationPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return
    setSubmitting(true)
    try {
      const res = await createInvitation({
        data: {
          title,
          slug: slug || undefined,
          themeSlug: 'riqqa-pastel-garden',
        },
      })
      navigate({
        to: '/dashboard/$invitationId',
        params: { invitationId: res.id },
      })
    } catch (e) {
      console.error(e)
      alert('Gagal membuat undangan')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-6">Create New Invitation</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl p-6 shadow-sm"
      >
        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">
            Judul Undangan
          </span>
          <input
            type="text"
            required
            value={title}
            onChange={(evt) => setTitle(evt.target.value)}
            placeholder="Contoh: Ulang Tahun Riqqa ke-17"
            className="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:border-black focus:outline-none"
          />
        </label>
        <label className="block mb-6">
          <span className="text-sm font-medium text-gray-700">
            Custom Subdomain (opsional)
          </span>
          <div className="mt-1 flex items-center">
            <input
              type="text"
              value={slug}
              onChange={(evt) => setSlug(evt.target.value)}
              placeholder="riqqa17"
              className="block w-full rounded-l-md border border-r-0 border-gray-300 p-2 focus:border-black focus:outline-none"
            />
            <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 h-[42px]">
              .salarasa.id
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Jika dikosongkan akan digenerate dari judul.
          </p>
        </label>
        <div className="flex justify-end gap-3 border-t pt-4 mt-2">
          <button
            type="button"
            onClick={() => navigate({ to: '/dashboard' })}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-black/90 disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  )
}
