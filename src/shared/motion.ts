export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { delay } },
  exit: { opacity: 0, y: -8 }
})
