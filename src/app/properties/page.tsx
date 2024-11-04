import PropertiesView from '@/components/properties/PropertiesView';
import ChatInterface2 from '@/components/chat/ChatInterface2'
import ChatInterface from '@/components/chat/ChatInterface'
import { CHAT_INTERFACE } from '@/libs/constant/malaysiaStates'

export default function PropertiesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Properties</h1>
      <PropertiesView />
      { CHAT_INTERFACE == 1 ? (<><ChatInterface mode={'search'}/></>) : (<><ChatInterface2/></>)}
    </div>
  );
}