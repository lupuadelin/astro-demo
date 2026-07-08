export const location = {
  lat: 44.39869,
  lng: 26.14345,
  addressShort: 'Sector 4, București',
  addressLong: 'Sector 4, București, România',
  phone: '+40 738 747 411',
  phoneHref: 'tel:+40738747411',
  whatsappHref: 'https://wa.me/40738747411',
  email: 'hello@yamaluxe.ro',
};

export interface Distance {
  label: string;
  value: string;
}

export const distances: Distance[] = [
  { label: 'Airport', value: '18 min' },
  { label: 'Old town', value: '22 min' },
  { label: 'Herăstrău park', value: '12 min' },
  { label: 'Metro', value: '6 min walk' },
];
