import {  useState } from 'react'


export function useImageOnLoad() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  // Triggered when full image will be loaded.
  const handleImageOnLoad = () => {
    setIsLoaded(true)
  }

  return { handleImageOnLoad, isLoaded }
}