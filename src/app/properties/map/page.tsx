// src/app/properties/page.tsx
import { propertyService } from '@/services/properties';
import MapView from '@/components/properties/MapView';

export default async function PropertiesPage() {
  const properties = await propertyService.getProperties();

  return <MapView properties={properties} />;
}