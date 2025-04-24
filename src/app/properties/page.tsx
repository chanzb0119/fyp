import PropertiesView from '@/components/properties/PropertiesView';

export default function PropertiesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6  lg:px-16 py-8">
      <h1 className="text-3xl font-bold mb-8 px-2">Available Properties</h1>
      <PropertiesView />
    </div>
  );
}