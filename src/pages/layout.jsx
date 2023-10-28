import Header from "@components/header";

export default function Layout({ children }) {
    return (
        <main>
            <Header />
            {children}
        </main>
    )
}