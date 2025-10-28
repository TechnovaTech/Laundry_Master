import { useEffect, useState } from 'react';

interface LeafletMapProps {
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

const LeafletMap = ({ address }: LeafletMapProps) => {
  const [mapUrl, setMapUrl] = useState('');

  useEffect(() => {
    const query = `${address.street}, ${address.city}, ${address.state}, ${address.pincode}, India`;
    const encodedQuery = encodeURIComponent(query);
    setMapUrl(`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedQuery}&zoom=15`);
  }, [address]);

  return (
    <iframe
      src={mapUrl}
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="w-full h-full rounded-xl"
    />
  );
};

export default LeafletMap;