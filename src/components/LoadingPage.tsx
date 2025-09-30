import { Mosaic } from 'react-loading-indicators'
export default function LoadingPage() {

    return (
        <div style={{ backgroundColor: "black", width: "100vw", height: "100vh", opacity: 0.75, position: "fixed", top: 0, left: 0, zIndex: 999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Mosaic color="#f9f7f7" size="medium" text="" textColor="#a5a5a5ff" />
        </div>
    )
}