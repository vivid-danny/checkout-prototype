import { useEffect, useRef, useState } from 'react'

// Formats a second count as mm:ss. Shared so a static "starting time" display
// (see TimerIntroModal) and the live header timer can't drift apart.
export function formatMMSS(seconds) {
  const mm = Math.floor(seconds / 60)
  const ss = seconds % 60
  return `${mm}:${String(ss).padStart(2, '0')}`
}

// Small reusable countdown. Ticks once a second while `active`, formats the
// remaining time as mm:ss, and fires `onExpire` exactly once when it hits zero.
// Modeled on the setTimeout + useRef + cleanup pattern in PaymentPage.jsx, but
// with setInterval. Clears the interval on unmount and whenever `active` is
// false, so navigating away never leaks a timer. Each time it becomes active it
// starts over from the full duration, so a countdown that only switches on
// partway through the flow begins at mm:ss rather than resuming mid-tick.
export function useCountdown({ minutes, active, onExpire }) {
  const totalSeconds = Math.round((minutes || 0) * 60)
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)
  const expiredRef = useRef(false)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    if (!active) return
    setSecondsLeft(totalSeconds)
    expiredRef.current = false
    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id)
          if (!expiredRef.current) {
            expiredRef.current = true
            onExpireRef.current?.()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [active, totalSeconds])

  return { secondsLeft, mmss: formatMMSS(secondsLeft) }
}
