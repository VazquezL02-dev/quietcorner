import { supabase } from './supabase'

const localKey = (studentId, activityId) =>
  `quiet-corner:${studentId}:${activityId}`

export async function loadProgress(studentId, activityId) {
  const fallback = localStorage.getItem(localKey(studentId, activityId))
  let local = null

  try {
    local = fallback ? JSON.parse(fallback) : null
  } catch {
    local = null
  }

  if (!supabase) return local

  const { data, error } = await supabase
    .from('quiet_corner_progress')
    .select('progress')
    .eq('student_id', studentId)
    .eq('activity_id', activityId)
    .maybeSingle()

  if (error) {
    console.warn('Using local progress:', error.message)
    return local
  }

  return data?.progress ?? local
}

export async function saveProgress(studentId, activityId, progress) {
  localStorage.setItem(
    localKey(studentId, activityId),
    JSON.stringify(progress),
  )

  if (!supabase) return

  const { error } = await supabase
    .from('quiet_corner_progress')
    .upsert(
      {
        student_id: studentId,
        activity_id: activityId,
        progress,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'student_id,activity_id' },
    )

  if (error) {
    console.warn('Progress saved locally only:', error.message)
  }
}
