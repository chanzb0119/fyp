import PropertyForm from '@/components/properties/PropertyForm';

export default function CreateProperty() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-center mb-8">List Your Property</h1>
      <PropertyForm />
    </div>
  );
}