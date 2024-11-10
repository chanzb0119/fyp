import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Combobox } from '@headlessui/react';
import { MapPin } from 'lucide-react';

interface AddressDetails {
  address: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
}

interface AddressAutocompleteProps {
  onSelect: (details: AddressDetails) => void;
}

const AddressAutocomplete = ({ onSelect }: AddressAutocompleteProps) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'my' }, // Restrict to Malaysia
    },
    debounce: 300,
  });

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      
      // Parse address components
      const addressComponents = results[0].address_components;
      const addressDetails: AddressDetails = {
        address: address,
        state: '',
        city: '',
        latitude: lat,
        longitude: lng
      };

      // Map address components to your structure
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      addressComponents.forEach((component: any) => {
        const types = component.types;

        if (types.includes('administrative_area_level_1')) {
          addressDetails.state = component.long_name;
        }
        if (types.includes('locality') || types.includes('administrative_area_level_2')) {
          addressDetails.city = component.long_name;
        }
      });

      onSelect(addressDetails);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div className="space-y-4">
      <Combobox onChange={handleSelect}>
        <div className="relative">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Combobox.Input
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search address..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={!ready}
            />
          </div>
          <Combobox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <Combobox.Option
                  key={place_id}
                  value={description}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-blue-600 text-white' : 'text-gray-900'
                    }`
                  }
                >
                  {description}
                </Combobox.Option>
              ))}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  );
};

export default AddressAutocomplete;