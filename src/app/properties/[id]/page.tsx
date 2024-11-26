// src\app\properties\[id]\page.tsx

import { propertyService } from '@/services/properties';
import PropertyDetails from '@/components/properties/detail/PropertyDetails';
import ChatInterface2 from '@/components/chat/ChatInterface2'
import ChatInterface from '@/components/chat/ChatInterface'
import { CHAT_INTERFACE } from '@/lib/constant/malaysiaStates'

interface Props {
  params: {
    id: string;
  };
}

export default async function PropertyPage({ params }: Props) {
  try {
    const { id } = await params
    const property = await propertyService.getPropertyById(id);
    
    if (!property) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Property not found</h1>
          <p className="mt-2 text-gray-600">
            The property you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          
        </div>
      );
    }

    return (
      <>
        <PropertyDetails property={property} />
        { CHAT_INTERFACE == 1 ? (<><ChatInterface mode={'property_details'} propertyId={id}/></>) : (<><ChatInterface2/></>)}
      </>);
  } catch (error) {
    console.error(error);
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Error</h1>
        <p className="mt-2 text-gray-600">
          There was an error loading the property details.
        </p>
      </div>
    );
  }
}