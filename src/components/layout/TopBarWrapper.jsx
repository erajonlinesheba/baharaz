import { createClient } from '@/lib/supabase/server'
import TopBar from './TopBar'

export default async function TopBarWrapper(){
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let initialProfile = null
  if(user){
    try{
      const { data } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single()
      initialProfile = data
    }catch{}
  }

  return <TopBar initialUser={user} initialProfile={initialProfile} />
}