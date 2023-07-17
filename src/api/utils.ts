export const TestImage = (url: string): Promise<boolean> => {
  const img = new Image()
  img.src = url

  return new Promise((resolve) => {
    img.onerror = () => resolve(false)
    img.onload = () => resolve(true)
  })
}
