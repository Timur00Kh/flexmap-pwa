import App from '@/components/App';
export function generateStaticParams(){return [{locale:'en'},{locale:'ru'}]}
export const dynamicParams=false;
export default async function Page({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return <App initialLang={locale==='ru'?'ru':'en'}/>}
