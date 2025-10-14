import { redirect } from 'next/navigation'
export default function Home() {
  redirect('/login') // middleware troca pra /(protected) se jA! tiver cookie
}

