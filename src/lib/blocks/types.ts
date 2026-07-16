import { z } from 'zod'

// ----------------------------------------------------------------------------
// Theme config (stored in themes.style_config JSONB)
// ----------------------------------------------------------------------------

export const themeStyleConfigSchema = z.object({
  name: z.string(),
  fonts: z.object({
    display: z.string().default('Great Vibes'),
    body: z.string().default('Poppins'),
  }),
  colors: z.object({
    textOnPhoto: z.string().default('#ffffff'),
    bg: z.string().default('#faf7f2'),
    slate: z.string().default('#1e293b'),
    accent: z.string().default('#6ec1e4'),
    accentHover: z.string().default('#64b6ec'),
    hadir: z.string().default('#3d9a62'),
    absen: z.string().default('#d90a11'),
    ragu: z.string().default('#d7a916'),
  }),
  ornaments: z.object({
    heroFloral: z
      .string()
      .default('/themes/riqqa-pastel-garden/ornaments/hero-floral.png'),
    biodataOrnament: z
      .string()
      .default('/themes/riqqa-pastel-garden/ornaments/biodata-ornament.png'),
    dresscodeBanner: z
      .string()
      .default('/themes/riqqa-pastel-garden/ornaments/dresscode-banner.png'),
  }),
  sampul: z.object({
    coverPhoto: z
      .string()
      .default('/themes/riqqa-pastel-garden/sampul/cover-sampul.jpeg'),
  }),
})
export type ThemeStyleConfig = z.infer<typeof themeStyleConfigSchema>

// ----------------------------------------------------------------------------
// Block configs — each block_type has its own Zod schema
// Stored in invitation_blocks.config JSONB
// ----------------------------------------------------------------------------

export const splashCoverConfigSchema = z.object({
  coverPhoto: z.string().optional(),
  greetingDefault: z.string().default('Tamu Undangan'),
  openButtonLabel: z.string().default('Open Invitation'),
  name: z.string().default(''),
})
export type SplashCoverConfig = z.infer<typeof splashCoverConfigSchema>

export const heroConfigSchema = z.object({
  title: z.string().default('Hi Ladies/Gentlemen !'),
  subtitle: z.string().default(''),
  image: z.string().optional(),
})
export type HeroConfig = z.infer<typeof heroConfigSchema>

export const subjectBiodataConfigSchema = z.object({
  fullName: z.string().default(''),
  parentsLine: z.string().default('Putri dari Bapak ... & Ibu ...'),
  instagramHandle: z.string().optional(),
})
export type SubjectBiodataConfig = z.infer<typeof subjectBiodataConfigSchema>

export const countdownEventConfigSchema = z.object({
  eventDateTime: z.string().default(''),
  eventTitle: z.string().default('Birthday Party'),
  eventDateText: z.string().default(''),
  eventTime: z.string().default(''),
  venueName: z.string().default(''),
  address: z.string().default(''),
  mapsUrl: z.string().default(''),
  mapsEmbedQuery: z.string().optional(),
  calendarTitle: z.string().optional(),
  calendarStartIso: z.string().optional(),
  calendarEndIso: z.string().optional(),
})
export type CountdownEventConfig = z.infer<typeof countdownEventConfigSchema>

export const dresscodeConfigSchema = z.object({
  text: z.string().default('Garden (Nuansa Pastel)'),
})
export type DresscodeConfig = z.infer<typeof dresscodeConfigSchema>

export const giftConfigSchema = z.object({
  showToggle: z.boolean().default(true),
  heading: z.string().default('Birthday Gift'),
  helperText: z
    .string()
    .default(
      'For those who want to give a token of love, you can send it via the feature below:',
    ),
  bankLogoUrl: z.string().optional(),
  bankName: z.string().default(''),
  accountNumber: z.string().default(''),
  accountHolder: z.string().default(''),
  whatsappNumber: z.string().optional(),
  whatsappMessage: z.string().optional(),
})
export type GiftConfig = z.infer<typeof giftConfigSchema>

export const rsvpConfigSchema = z.object({
  enabled: z.boolean().default(true),
  heading: z.string().default('RSVP'),
  helperText: z
    .string()
    .default('We hope that you will fill in the form below:'),
  nameLabel: z.string().default('Nama'),
  countLabel: z.string().default('Jumlah'),
  countOptions: z.array(z.number()).default([1, 2]),
  submitLabel: z.string().default('Send'),
})
export type RsvpConfig = z.infer<typeof rsvpConfigSchema>

export const guestbookConfigSchema = z.object({
  enabled: z.boolean().default(true),
  heading: z.string().default('Birthday Wish'),
  subheading: z.string().default('Write the best prayers and greetings for us'),
  perPage: z.number().default(10),
  nameLabel: z.string().default('Name'),
  messageLabel: z.string().default('Your wish'),
  attendanceLabel: z.string().default('Konfirmasi Kehadiran'),
  attendanceOptions: z
    .array(z.string())
    .default(['Datang', 'Absen', 'Mungkin']),
  submitLabel: z.string().default('Kirim'),
})
export type GuestbookConfig = z.infer<typeof guestbookConfigSchema>

export const thankYouConfigSchema = z.object({
  heading: z.string().default('Thank You!'),
  name: z.string().default(''),
})
export type ThankYouConfig = z.infer<typeof thankYouConfigSchema>

export const footerConfigSchema = z.object({
  makerText: z.string().default('MADE BY'),
  makerName: z.string().default('Salarasa'),
  whatsappNumber: z.string().optional(),
  instagramHandle: z.string().optional(),
})
export type FooterConfig = z.infer<typeof footerConfigSchema>

// ----------------------------------------------------------------------------
// Block type → config schema registry
// ----------------------------------------------------------------------------

export const blockConfigSchemas = {
  splash_cover: splashCoverConfigSchema,
  hero: heroConfigSchema,
  subject_biodata: subjectBiodataConfigSchema,
  countdown_event: countdownEventConfigSchema,
  dresscode: dresscodeConfigSchema,
  gift: giftConfigSchema,
  rsvp: rsvpConfigSchema,
  guestbook: guestbookConfigSchema,
  thank_you: thankYouConfigSchema,
  footer: footerConfigSchema,
} as const

export type BlockConfigOf =
  (typeof blockConfigSchemas)[keyof typeof blockConfigSchemas]
