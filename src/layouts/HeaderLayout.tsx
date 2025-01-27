import { ReactNode } from "react";

type HeaderLayoutProps = {
    children: ReactNode
}

function HeaderLayout({ children }: HeaderLayoutProps) {
    return <>
        <header>

        </header>
        <body>
            {children}
        </body>
    </>
}

export default HeaderLayout;
