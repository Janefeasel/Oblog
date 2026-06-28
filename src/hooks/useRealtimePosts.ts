/**
 * Hook that sets up a Supabase Realtime subscription on the posts table.
 *
 * When any post is inserted, updated, or deleted, the provided callback is invoked
 * so the parent component can invalidate the React Query cache and trigger a refetch.
 *
 * This enables instant sync across all devices/browsers without manual refresh.
 */
import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

type RealtimePayload = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: Record<string, unknown>
  old: Record<string, unknown>
}

/**
 * Subscribe to real-time changes on the posts table.
 * @param onChange - Callback fired when a post is inserted, updated, or deleted.
 * @param enabled - Whether the subscription is active (e.g., only when component is mounted).
 */
export function useRealtimePosts(
  onChange: (payload: RealtimePayload) => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return

    const channel = supabase
      .channel('posts-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
        },
        (payload) => {
          onChange(payload as unknown as RealtimePayload)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [enabled, onChange])
}
