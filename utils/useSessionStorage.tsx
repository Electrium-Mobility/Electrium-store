import { useState, useEffect } from "react";

const useSessionStorage = (name: string) => {
  const [value, setValue] = useState('')

  useEffect(() => {
    let val = sessionStorage.getItem(name)
    if (val) {
        setValue(val)
    }
  }, [])

  return value
}

export default useSessionStorage; 