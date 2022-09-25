import { ReactNode } from "react"
import MainNavigation from "./MainNavigation"

const RootLayout = ({children}: {children: ReactNode}) => {
    return (
        <>
      <MainNavigation />
      <main>{children}</main>
    </>
    )
}

export default RootLayout