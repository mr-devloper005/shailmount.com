import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Field notes',
    headline: 'Clear ideas for people building real things.',
    description: 'Explore practical stories, useful context and fresh perspectives from across the business community.',
    filterLabel: 'Choose article topic',
    secondaryNote: 'Take your time with the stories that matter.',
    chips: ['Perspectives', 'Practical guides', 'Fresh thinking'],
  },
  classified: {
    eyebrow: 'Notice board',
    headline: 'Good opportunities move quickly. Start here.',
    description: 'Browse current offers, requests and practical opportunities posted for business owners and independent professionals.',
    filterLabel: 'Filter classified category',
    secondaryNote: 'Clear details for quicker decisions.',
    chips: ['New offers', 'Requests', 'Open opportunities'],
  },
  sbm: {
    eyebrow: 'Saved resources',
    headline: 'Social bookmarks arranged like curated collections.',
    description: 'Bookmark pages should feel like shelves of useful resources, tools, references, and collections.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Curated resources need grouping and calm metadata.',
    chips: ['Collections', 'Resources', 'Reference flow'],
  },
  profile: {
    eyebrow: 'People and profiles',
    headline: 'Meet the people behind the work.',
    description: 'Discover business owners, independent specialists and organisations with something useful to share.',
    filterLabel: 'Filter profile category',
    secondaryNote: 'A direct route to capable people.',
    chips: ['Owners', 'Specialists', 'Organisations'],
  },
  pdf: {
    eyebrow: 'Document library',
    headline: 'PDFs and documents presented as a useful library.',
    description: 'PDF pages should feel like downloadable guides, reports, files, and reference material instead of normal articles.',
    filterLabel: 'Filter document type',
    secondaryNote: 'Document surfaces need archive cues, file context, and clear browsing.',
    chips: ['Documents', 'Guides', 'Archive ready'],
  },
  listing: {
    eyebrow: 'Business directory',
    headline: 'Find the right business for the next move.',
    description: 'Browse useful companies, compare the details and connect directly when the fit feels right.',
    filterLabel: 'Filter business category',
    secondaryNote: 'Prioritize comparison, location, and direct action paths.',
    chips: ['Directory', 'Compare', 'Business discovery'],
  },
  image: {
    eyebrow: 'Visual gallery',
    headline: 'Image posts with a gallery-first browsing experience.',
    description: 'Image pages should lead with visual impact, stronger cards, and a portfolio-like rhythm.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Let images carry the page before long text does.',
    chips: ['Gallery', 'Visual-first', 'Portfolio mood'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
