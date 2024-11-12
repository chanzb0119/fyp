import ChatInterface2 from '@/components/chat/ChatInterface2'
import ChatInterface from '@/components/chat/ChatInterface'
import { CHAT_INTERFACE } from '@/lib/constant/malaysiaStates'

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to Rental Property Platform</h1>
      <p className="text-gray-600">
        Find your perfect rental property or list your property today.
      </p>
      { CHAT_INTERFACE == 1 ? (<><ChatInterface mode={'search'}/></>) : (<><ChatInterface2/></>)}
    </div>
  )
}