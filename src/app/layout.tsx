import type {Metadata,Viewport} from 'next';
import './globals.css';
export const metadata:Metadata={title:'FlexMap · Your movement, mapped',description:'Private bilingual mobility self-check with an interactive 3D body map.',manifest:'/flexmap-pwa/manifest.webmanifest',appleWebApp:{capable:true,title:'FlexMap',statusBarStyle:'default'},icons:{apple:'/flexmap-pwa/icon-192.png'}};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#182a24'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body>{children}</body></html>}
