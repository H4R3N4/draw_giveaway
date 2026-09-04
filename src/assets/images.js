import captureParticipants from './capture participant.png'
import captureLots from './capture lots.png'
import captureTirage from './tirage.png'

/**
 * Illustrations propres à l'application — pas les photos de lots, qui sont
 * fournies par l'utilisateur et stockées à part. Ce sont ces fichiers que
 * l'écran de chargement attend avant d'afficher l'interface, pour éviter que
 * les textes apparaissent avant leurs images.
 */
export const IMAGES_APP = {
  hero: '/hero.png',
  captureParticipants,
  captureLots,
  captureTirage,
}

export const LISTE_IMAGES_APP = Object.values(IMAGES_APP)
