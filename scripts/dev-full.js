/**
 * Lance le relais Facebook puis le serveur de développement Vite.
 *
 * Deux processus enfants plutôt qu'une dépendance de plus (concurrently) :
 * si l'un s'arrête, l'autre est arrêté avec lui.
 */

import { spawn } from 'node:child_process'

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'

const enfants = [
  spawn(npm, ['run', 'server'], { stdio: 'inherit', shell: process.platform === 'win32' }),
  spawn(npm, ['run', 'dev'], { stdio: 'inherit', shell: process.platform === 'win32' }),
]

let arret = false
function toutArreter(code = 0) {
  if (arret) return
  arret = true
  for (const enfant of enfants) {
    if (!enfant.killed) enfant.kill()
  }
  process.exit(code)
}

for (const enfant of enfants) {
  enfant.on('exit', code => toutArreter(code ?? 0))
  enfant.on('error', err => { console.error(err); toutArreter(1) })
}

process.on('SIGINT', () => toutArreter(0))
process.on('SIGTERM', () => toutArreter(0))
