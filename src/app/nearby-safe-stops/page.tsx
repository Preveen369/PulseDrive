'use client';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUser } from '@/firebase';
import { Loader2, MapPin, LocateFixed, Hospital, Shield, Fuel, Hotel, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Location = {
  latitude: number;
  longitude: number;
};

type Place = {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name: string;
  };
  distance: number;
};

type PlaceType = 'hospital' | 'police' | 'fuel' | 'hotel';

const placeTypeConfig = {
    hospital: {
        icon: Hospital,
        label: 'Hospitals',
        queryValue: 'hospital'
    },
    police: {
        icon: Shield,
        label: 'Police Stations',
        queryValue: 'police'
    },
    fuel: {
        icon: Fuel,
        label: 'Petrol Bunks',
        queryValue: 'fuel'
    },
    hotel: {
        icon: Hotel,
        label: 'Hotels and Lodges',
        queryValue: 'hotel'
    }
}

// Haversine formula to calculate distance
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const shuffleArray = (array: Place[]) => {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export default function NearbySafeStopsPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [location, setLocation] = useState<Location | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [typedLocation, setTypedLocation] = useState('');

  const [places, setPlaces] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<PlaceType | null>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const resetState = () => {
    setLocation(null);
    setAddress(null);
    setPlaces([]);
    setSelectedType(null);
    setError(null);
    setSearchError(null);
  }

  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    setIsGeocoding(true);
    setAddress(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress('Could not retrieve address.');
      }
    } catch (err) {
      setAddress('Failed to fetch address.');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoadingLocation(true);
    resetState();
    setTypedLocation('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(newLocation);
        getAddressFromCoordinates(newLocation.latitude, newLocation.longitude);
        setIsLoadingLocation(false);
      },
      (err) => {
        setError(err.message);
        setIsLoadingLocation(false);
      }
    );
  };

  const handleSearchLocation = async () => {
    if (!typedLocation) {
        setError("Please enter a location to search.");
        return;
    }
    
    setIsLoadingLocation(true);
    resetState();

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(typedLocation)}&format=json&limit=1`
        );
        const data = await response.json();
        if (data && data.length > 0) {
            const result = data[0];
            const newLocation = {
                latitude: parseFloat(result.lat),
                longitude: parseFloat(result.lon)
            };
            setLocation(newLocation);
            setAddress(result.display_name);
        } else {
            setError("Location not found. Please try a different search term.");
        }
    } catch (err) {
        setError("Failed to search for location.");
    } finally {
        setIsLoadingLocation(false);
    }
  }
  
  const searchForPlaces = async (type: PlaceType) => {
    if (!location) return;
    
    setIsSearching(true);
    setSearchError(null);
    setPlaces([]);
    setSelectedType(type);

    const radius = 5000; // 5km radius for more precise results
    const limit = 15; // Limit to the top 15 results

    const queryMap = {
        hospital: `node[amenity=hospital](around:${radius},${location.latitude},${location.longitude});`,
        police: `node[amenity=police](around:${radius},${location.latitude},${location.longitude});`,
        fuel: `node[amenity=fuel](around:${radius},${location.latitude},${location.longitude});`,
        hotel: `node[tourism=hotel][stars](around:${radius},${location.latitude},${location.longitude});
        node[tourism=motel](around:${radius},${location.latitude},${location.longitude});
        node[tourism=hostel](around:${radius},${location.latitude},${location.longitude});
        node[tourism=guest_house](around:${radius},${location.latitude},${location.longitude});`
    };

    const query = `
      [out:json];
      (
        ${queryMap[type]}
      );
      out body;
      >;
      out skel qt;
    `;

    try {
        const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query
        });
        const data = await response.json();
        
        if (data.elements) {
            const foundPlaces = data.elements
                .filter((place: any) => place.tags && place.tags.name)
                .map((place: any) => ({
                    ...place,
                    distance: getDistance(location.latitude, location.longitude, place.lat, place.lon)
                }))
                .sort((a: Place, b: Place) => a.distance - b.distance)
                .slice(0, limit); // Take only the top 'limit' results
            
            const shuffledPlaces = shuffleArray(foundPlaces);
            setPlaces(shuffledPlaces);
        }

    } catch (e) {
        setSearchError('Failed to fetch nearby places. Please try again.');
    } finally {
        setIsSearching(false);
    }
  }


  if (isUserLoading || !user) {
    return (
      <AppShell>
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight font-headline">Nearby Safe Stops</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LocateFixed /> Find Your Location
            </CardTitle>
            <CardDescription>
              Use automatic location detection or manually type a location to find safe stops.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className='flex w-full max-w-lg items-center space-x-2'>
                 <Input 
                    type="text"
                    placeholder="E.g., New York, NY or an address"
                    value={typedLocation}
                    onChange={(e) => setTypedLocation(e.target.value)}
                    disabled={isLoadingLocation}
                 />
                 <Button onClick={handleSearchLocation} disabled={isLoadingLocation}>
                    {isLoadingLocation && typedLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search />}
                 </Button>
            </div>
             <div className="flex items-center space-x-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <Button onClick={handleGetLocation} disabled={isLoadingLocation} size="lg">
              {isLoadingLocation && !typedLocation ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="mr-2" />
              )}
              {isLoadingLocation && !typedLocation ? 'Detecting...' : 'Detect My Location'}
            </Button>
            {location && (
              <div className="p-4 bg-secondary rounded-md text-left w-full max-w-2xl">
                <p className="font-semibold text-foreground">Showing results for:</p>
                {isGeocoding && (
                    <div className='flex items-center gap-2 mt-2'>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className='text-sm text-muted-foreground'>Fetching address details...</span>
                    </div>
                )}
                {address && (
                  <p className="text-sm text-foreground mt-1">
                    {address}
                  </p>
                )}
                 <p className="text-xs text-muted-foreground mt-2">
                  (Lat: {location.latitude.toFixed(6)}, Lon: {location.longitude.toFixed(6)})
                </p>
              </div>
            )}
            {error && (
              <div className="p-4 bg-destructive/20 rounded-md text-destructive text-sm w-full max-w-md">
                <p>
                  <strong>Error:</strong> {error}
                </p>
                <p className="mt-1">Please ensure you have granted location permissions or try a different search term.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {location && (
            <Card>
                <CardHeader>
                    <CardTitle>Find Places</CardTitle>
                    <CardDescription>Select a category to find places near your chosen location within a 5km radius.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {(Object.keys(placeTypeConfig) as PlaceType[]).map(type => {
                            const config = placeTypeConfig[type];
                            return (
                                <Button 
                                    key={type}
                                    variant={selectedType === type ? "default" : "outline"}
                                    onClick={() => searchForPlaces(type)}
                                    disabled={isSearching}
                                >
                                    <config.icon className="mr-2" />
                                    {config.label}
                                </Button>
                            )
                        })}
                    </div>
                    
                    {isSearching && (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="ml-4 text-muted-foreground">Searching for {placeTypeConfig[selectedType!]?.label}...</p>

                        </div>
                    )}
                    {searchError && (
                         <div className="p-4 bg-destructive/20 rounded-md text-destructive text-sm text-center">
                            {searchError}
                        </div>
                    )}

                    {places.length > 0 && (
                        <div className="space-y-4">
                            <h3 className='text-lg font-semibold'>Top {places.length} results for "{placeTypeConfig[selectedType!]?.label}"</h3>
                            <ul className="divide-y divide-border rounded-md border">
                                {places.map(place => (
                                    <li key={place.id} className="p-4 flex items-center justify-between hover:bg-secondary">
                                        <div>
                                            <p className="font-semibold">{place.tags.name}</p>
                                            <p className="text-sm text-muted-foreground">{place.distance.toFixed(2)} km away</p>
                                        </div>
                                        <Button asChild variant="ghost" size="sm">
                                            <Link href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`} target="_blank" rel="noopener noreferrer">
                                                Navigate
                                            </Link>
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {!isSearching && places.length === 0 && selectedType && (
                        <div className="text-center p-8 text-muted-foreground">
                            No {placeTypeConfig[selectedType]?.label.toLowerCase()} found within a 5km radius.
                        </div>
                    )}
                </CardContent>
            </Card>
        )}
      </div>
    </AppShell>
  );
}
