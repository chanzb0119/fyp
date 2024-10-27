import PropertiesView from '@/components/properties/PropertiesView';

export default function PropertiesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Properties</h1>
      <PropertiesView />
    </div>
  );
}