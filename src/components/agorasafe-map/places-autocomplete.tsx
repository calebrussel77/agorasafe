/* eslint-disable @typescript-eslint/naming-convention */
import { ChevronsUpDown, MapPinIcon } from 'lucide-react';
import React, { type FC } from 'react';
import { useMeasure } from 'react-use';
import usePlacesAutocompleteAutocomplete, {
  getDetails,
} from 'use-places-autocomplete';

import { type Variant } from '@/utils/variants';

import { cn } from '@/lib/utils';

import { CheckCircleSolidIcon } from '../icons/check-circle-solid-icon';
import { Button } from '../ui/button';
import { Command } from '../ui/command';
import { IconContainer } from '../ui/icon-container';
import { Popover } from '../ui/popover';
import { Spinner } from '../ui/spinner';
import { Truncate } from '../ui/truncate';
import { Typography } from '../ui/typography';

type AutocompletePrediction = google.maps.places.AutocompletePrediction;
type PlaceDetails = google.maps.places.PlaceResult;

export type PlaceLocationOption = {
  address: string;
  placeId: string;
  country?: string;
  city?: string;
  lat?: number;
  long?: number;
};

interface PlacesAutocompleteProps {
  className?: string;
  onSelectPlace: (item: PlaceLocationOption) => void;
  selectedPlace: PlaceLocationOption | null;
  disabled?: boolean;
  placeholder?: string;
  placeholderSearch?: string;
  variant?: Variant;
}

const PlacesAutocomplete: FC<PlacesAutocompleteProps> = ({
  selectedPlace,
  onSelectPlace,
  className,
  placeholder = 'Selectionner la localisation',
  placeholderSearch = 'Recherchez un lieu...',
  disabled,
  variant,
}) => {
  const {
    ready,
    value,
    suggestions: { status, data, loading },
    setValue,
  } = usePlacesAutocompleteAutocomplete({
    requestOptions: {
      componentRestrictions: {
        country: 'CM',
      },
      language: 'fr',
    },
    debounce: 300,
  });

  const [triggerRef, { width }] = useMeasure();
  const [isOpen, setIsOpen] = React.useState(false);
  const hasError = variant === 'danger';

  const handleInput = (value: string) => {
    setValue(value);
  };

  const handleSelect =
    ({ place_id, structured_formatting }: AutocompletePrediction) =>
    async () => {
      // Define an array of fields to request from the place details
      const fields = ['address_components', 'geometry'];

      // Use the getDetails function to fetch details for the selected place
      const placeDetails = (await getDetails({
        placeId: place_id,
        fields,
      })) as PlaceDetails;

      // Extract city and country
      let city, country, latitude, longitude;

      if (placeDetails?.address_components) {
        city = placeDetails.address_components.find(component =>
          component.types.includes('locality')
        )?.long_name;

        country = placeDetails.address_components.find(component =>
          component.types.includes('country')
        )?.long_name;
      }

      if (placeDetails?.geometry && placeDetails?.geometry.location) {
        latitude = placeDetails.geometry.location.lat();
        longitude = placeDetails.geometry.location.lng();
      }

      const address = `${structured_formatting?.main_text}${
        city ? `, ${city}` : ''
      }`;

      onSelectPlace({
        placeId: place_id,
        long: longitude,
        lat: latitude,
        address,
        country,
        city,
      });

      // When the user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(address, false);
      setIsOpen(false);
    };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger ref={triggerRef as never} asChild className={className}>
        <Button
          variant="outline"
          role="comboBox"
          disabled={!ready || disabled}
          className="w-full justify-between"
          style={hasError ? { borderColor: 'red' } : {}}
          aria-invalid={hasError ? 'true' : 'false'}
        >
          <MapPinIcon className="mr-1 h-4 w-4 shrink-0" />
          <Truncate className="w-full flex-1 text-left">
            {selectedPlace?.address || placeholder}
          </Truncate>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
        </Button>
      </Popover.Trigger>
      <Popover.Content
        className="w-auto p-0"
        style={{ width: `${width + 35}px` }}
      >
        <Command shouldFilter={false}>
          <Command.Input
            value={value}
            disabled={!ready}
            onValueChange={handleInput}
            placeholder={placeholderSearch}
          />

          {!loading && data?.length === 0 ? (
            <Command.Empty>
              <p>
                {value ? (
                  <span>
                    Aucun résultats trouvés pour "<strong>{value}</strong>"
                  </span>
                ) : (
                  `Recherchez une localisation...`
                )}
              </p>
            </Command.Empty>
          ) : null}

          {loading ? (
            <Command.Loading className="my-1 flex w-full justify-center">
              <Spinner variant="primary" size="sm" />
            </Command.Loading>
          ) : null}

          <Command.List>
            {status === 'OK' &&
              data?.map(suggestion => (
                <Command.Item
                  key={suggestion?.place_id}
                  value={suggestion?.place_id}
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onSelect={handleSelect(suggestion as never)}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex w-full flex-1 items-center gap-3">
                      <IconContainer>
                        <MapPinIcon className="h-4 w-4" />
                      </IconContainer>
                      <div>
                        <Typography className="font-semibold">
                          {suggestion?.structured_formatting?.main_text}
                        </Typography>
                        <Typography variant="small">
                          {suggestion?.structured_formatting?.secondary_text}
                        </Typography>
                      </div>
                    </div>
                    <CheckCircleSolidIcon
                      className={cn(
                        'ml-1 h-5 w-5 flex-shrink-0',
                        selectedPlace?.placeId === suggestion?.place_id
                          ? 'text-brand-500 opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </div>
                </Command.Item>
              ))}
          </Command.List>
        </Command>
      </Popover.Content>
    </Popover>
  );
};

export { PlacesAutocomplete };
