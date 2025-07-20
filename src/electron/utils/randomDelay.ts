export function randomDelay(min = 300, max = 1200) {
  return new Promise((resolve) =>
    setTimeout(resolve, Math.random() * (max - min) + min)
  )
}
