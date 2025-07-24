export const parseLogWithColors = (logText: string) => {
  if (!logText) return ''

  return logText.replace(
    /(\[INFO\]|\[WARNING\]|\[ERROR\])([^\n]*)/g,
    (tag, content) => {
      const level = tag.slice(1, -1)
      const className = `log-${level.toLowerCase()}`
      return `<span class="${className}">${tag}${content}</span>`
    }
  )
}
