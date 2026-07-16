import {
  themeStyleConfigSchema
  
} from '#/lib/blocks/types'
import type {ThemeStyleConfig} from '#/lib/blocks/types';

export const RIQQA_PASTEL_GARDEN_THEME: ThemeStyleConfig =
  themeStyleConfigSchema.parse({
    name: 'Riqqa Pastel Garden',
    fonts: {
      display: 'Great Vibes',
      body: 'Poppins',
    },
    colors: {
      textOnPhoto: '#ffffff',
      bg: '#faf7f2',
      slate: '#1e293b',
      accent: '#6ec1e4',
      accentHover: '#64b6ec',
      hadir: '#3d9a62',
      absen: '#d90a11',
      ragu: '#d7a916',
    },
    ornaments: {
      heroFloral: '/themes/riqqa-pastel-garden/ornaments/hero-floral.png',
      biodataOrnament:
        '/themes/riqqa-pastel-garden/ornaments/biodata-ornament.png',
      dresscodeBanner:
        '/themes/riqqa-pastel-garden/ornaments/dresscode-banner.png',
    },
    sampul: {
      coverPhoto: '/themes/riqqa-pastel-garden/sampul/cover-sampul.jpeg',
    },
  })
