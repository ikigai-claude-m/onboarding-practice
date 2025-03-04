import { useEffect, useRef } from 'react'

import { BonusActivationCore } from './BonusActivationCore'

export default function BonusActivation() {
  const container = useRef<HTMLDivElement>(null)
  const hasInitialized = useRef<boolean>(false)

  useEffect(() => {
    if(!hasInitialized.current) {
        const BonusActivation = new BonusActivationCore()
        BonusActivation.container = container.current
        BonusActivation.initial().catch(console.error)
    } 
    return ()=> {
        hasInitialized.current = true
    }
  }, [])

  return (
    <div
      ref={container}
      style={{
        position: 'fixed',
        left: '0',
        top: '0',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    ></div>
  )
}
