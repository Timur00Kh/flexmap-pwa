import type {Metadata,Viewport} from 'next';
import './globals.css';
export const metadata:Metadata={title:'FlexMap · Your movement, mapped',description:'Stretching progress and everyday mobility, with a private interactive 3D body map.',manifest:'/flexmap-pwa/manifest.webmanifest',appleWebApp:{capable:true,title:'FlexMap',statusBarStyle:'default'},icons:{apple:'/flexmap-pwa/icon-192.png'}};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#182a24'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body>{children}</body></html>}
