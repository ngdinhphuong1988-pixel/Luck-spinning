export const COLORS = [
  '#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#FF922B',
  '#CC5DE8','#20C997','#F06595','#74C0FC','#A9E34B',
  '#FF8787','#FFA94D','#63E6BE','#748FFC','#E599F7',
  '#66D9E8','#FFD43B','#FF6B81','#A0C4FF','#CAFFBF',
]

export const NUM_OPTIONS = [2,3,4,5,6,7,8,9,10,12,15,20]

export const STARS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  top:  `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size:  Math.random() * 3 + 1,
  delay: Math.random() * 3,
  dur:   Math.random() * 2 + 2,
}))
