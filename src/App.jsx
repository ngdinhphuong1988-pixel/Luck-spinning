import { useState } from 'react'
import Header    from './components/Header'
import StarField from './components/StarField'
import Confetti  from './components/Confetti'
import StepCount from './components/StepCount'
import StepNames from './components/StepNames'
import StepWheel from './components/StepWheel'

export default function App() {
  const [step, setStep]             = useState('count')
  const [numPlayers, setNumPlayers] = useState(null)
  const [nameInputs, setNameInputs] = useState([])
  const [errors, setErrors]         = useState([])
  const [names, setNames]           = useState([])
  const [showConfetti, setShowConfetti] = useState(false)

  function handleSelectCount(n) {
    setNumPlayers(n)
    setNameInputs(Array(n).fill(''))
    setErrors(Array(n).fill(false))
    setStep('names')
  }

  function handleNameChange(i, val) {
    const next = [...nameInputs]; next[i] = val; setNameInputs(next)
    if (val.trim()) { const e = [...errors]; e[i] = false; setErrors(e) }
  }

  function handleStartGame() {
    const newErrors = nameInputs.map(v => !v.trim())
    setErrors(newErrors)
    if (newErrors.some(Boolean)) return
    setNames(nameInputs.map(v => v.trim()))
    setStep('wheel')
  }

  function handleReset() {
    setStep('count'); setNumPlayers(null)
    setNameInputs([]); setErrors([]); setNames([])
    setShowConfetti(false)
  }

  return (
    <div style={{
      minHeight:'100dvh',
      background:'linear-gradient(155deg,#0b0920 0%,#161450 55%,#0a0820 100%)',
      fontFamily:"'Nunito','Segoe UI',sans-serif",
      display:'flex', flexDirection:'column', alignItems:'center',
      padding:'0 0 48px', overflowX:'hidden', position:'relative',
    }}>
      <StarField />
      <Confetti active={showConfetti} />
      <Header />

      {step === 'count' && <StepCount onSelect={handleSelectCount} />}

      {step === 'names' && (
        <StepNames
          numPlayers={numPlayers}
          nameInputs={nameInputs}
          errors={errors}
          onChange={handleNameChange}
          onBack={() => setStep('count')}
          onSubmit={handleStartGame}
        />
      )}

      {step === 'wheel' && (
        <StepWheel
          names={names}
          onReset={handleReset}
        />
      )}
    </div>
  )
}
