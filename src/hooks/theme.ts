import { createTheme } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"

export function useMyTheme() {
  // Can't use usePreference() here because this hook is used before the
  // context is set up.
  const [primaryColor, setPrimaryColor] = useLocalStorage<string>({
    key: "hem:primary-color",
    // defaultValue: theme.primaryColor,
    defaultValue: "indigo",
  })

  // hook will return either 'dark' or 'light' on client
  // and always 'light' during ssr as window.matchMedia is not available
  // const preferredColorScheme = useColorScheme()

  // const colorSchemeManager = localStorageColorSchemeManager({
  //   key: "hem:color-scheme",
  // })

  // const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
  //   key: "hem:color-scheme",
  //   defaultValue: preferredColorScheme,
  // })
  // const toggleColorScheme = (value?: MantineColorScheme) => {
  //   // defaultColorScheme={"light"}
  //   // setColorScheme(value || "auto")
  //   console.log("CURRENTLY NOT WORKING")
  // }

  const myTheme = createTheme({
    // colorScheme,
    primaryColor: primaryColor || "blue",
    // defaultRadius: 0,

    // fontFamilyMonospace: "Monaco, Courier, monospace",
    fontFamilyMonospace:
      "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
  })

  return {
    myTheme,
    // colorSchemeManager,
    // colorScheme,
    // toggleColorScheme,
    primaryColor,
    setPrimaryColor,
  }
}
