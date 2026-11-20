'use client'

import { useState } from 'react'
import type { Messages } from '@/i18n/messages'
import { useI18n } from '@/i18n/provider'

function translateBackup(message: string, t: Messages) {
  const known: Record<string, string> = {
    'Backup was empty.': t.backup.empty,
    'That backup is too large.': t.backup.tooLarge,
    'Backup was not valid JSON.': t.backup.json,
    'Backup was not a JSON object.': t.backup.notObject,
    'Backup was not made by Finder.': t.backup.app,
    'Backup version is not supported.': t.backup.version,
    'Backup is missing a games object.': t.backup.games,
    'No game progress was found in that file.': t.backup.emptyGames,
    'Backup lists too many games.': t.backup.tooMany,
    'Backup has an invalid game id.': t.backup.badSlug,
  }
  if (known[message]) return known[message]
  const match = message.match(/^Backup for (.+) was rejected: (.+)$/)
  if (match) return t.backup.field(match[1], match[2])
  return message
}
import { parseBackup } from '@/lib/backup'
import { useCompanionStore } from '@/store/useCompanionStore'
import { DialogContent, DialogDescription, DialogRoot, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/form'

/** One import dialog for the navbar and the map sidebar. Both used to mount their own copy of the same flag. */
export function ImportBackupDialog() {
  const open = useCompanionStore((state) => state.importOpen)
  const { t } = useI18n()
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  function close() {
    useCompanionStore.getState().setImportOpen(false)
    setError('')
  }

  function importText() {
    try {
      const games = parseBackup(text)
      useCompanionStore.getState().replaceGames(games)
      close()
      setText('')
      useCompanionStore.getState().showToast(t.imported(Object.keys(games).join(', ')))
    } catch (reason) {
      setError(reason instanceof Error ? translateBackup(reason.message, t) : t.importDialog.failed)
    }
  }

  return (
    <DialogRoot
      open={open}
      onOpenChange={(next) => {
        if (!next) close()
        else useCompanionStore.getState().setImportOpen(true)
      }}
    >
      <DialogContent>
        <DialogTitle className="font-display text-2xl">{t.importDialog.title}</DialogTitle>
        <DialogDescription className="mt-1 text-sm text-[#a39c90]">
          {t.importDialog.body}
        </DialogDescription>
        <input
          type="file"
          accept="application/json,.json"
          className="mt-4 block w-full text-sm"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (!file) return
            void file.text().then((contents) => {
              setText(contents)
              setError('')
            })
          }}
        />
        <Textarea className="mt-3 min-h-40 font-mono text-xs" value={text} onChange={(event) => setText(event.target.value)} placeholder={t.importDialog.paste} />
        {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
        <div className="mt-3 flex justify-end">
          <Button onClick={importText} disabled={!text.trim()}>
            {t.importDialog.action}
          </Button>
        </div>
      </DialogContent>
    </DialogRoot>
  )
}
