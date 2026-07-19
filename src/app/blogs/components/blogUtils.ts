export type { BlogItem, Category, BlogPageData, BlogListResponse } from '../types'

export const CATEGORY_COLORS: Record<string, [string, string]> = {
  'Mindfulness': ['#7B3F20', '#4A2010'],
  'Spirituality': ['#4A2B6E', '#2C1545'],
  'Yoga & Health': ['#2E5C40', '#1A3A28'],
  'Relationships': ['#8B2A2A', '#5C1515'],
  'Personal Growth': ['#8B5E00', '#5C3A00'],
  'Nutrition': ['#1A4A5C', '#0E2C38'],
  'Devotion and Spirituality': ['#4A2B6E', '#2C1545'],
  'Stories': ['#4A5028', '#2A3010'],
}

export function getCategoryColors(category?: string): [string, string] {
  if (!category) return ['#7B3F20', '#4A2010']
  return CATEGORY_COLORS[category] ?? ['#7B3F20', '#4A2010']
}
