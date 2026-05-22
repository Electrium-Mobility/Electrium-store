import { redirect } from 'next/navigation'

interface LegacyComparePageProps {
  params: Promise<{ bikeAId: string; bikeBId: string }>
}

/**
 * Legacy path-based compare URL. Redirects to the new query-param form so
 * bookmarks and in-flight links keep working.
 */
export default async function LegacyComparePage({ params }: LegacyComparePageProps) {
  const { bikeAId, bikeBId } = await params
  redirect(`/compare?bikes=${bikeAId},${bikeBId}`)
}
