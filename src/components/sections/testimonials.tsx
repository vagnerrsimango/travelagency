const StarIcon = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="text-yellow-500 text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M463 192H315.9L271.2 58.6C269 52.1 262.9 48 256 48s-13 4.1-15.2 10.6L196.1 192H48c-8.8 0-16 7.2-16 16 0 .9.1 1.9.3 2.7.2 3.5 1.8 7.4 6.7 11.3l120.9 85.2-46.4 134.9c-2.3 6.5 0 13.8 5.5 18 2.9 2.1 5.6 3.9 9 3.9 3.3 0 7.2-1.7 10-3.6l118-84.1 118 84.1c2.8 2 6.7 3.6 10 3.6 3.4 0 6.1-1.7 8.9-3.9 5.6-4.2 7.8-11.4 5.5-18L352 307.2l119.9-86 2.9-2.5c2.6-2.8 5.2-6.6 5.2-10.7 0-8.8-8.2-16-17-16z"/>
  </svg>
);

const Stars = () => (
  <div className="inline-flex gap-1">
    {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
  </div>
);

const testimonials = [
  {
    name: "Hary Gurdan",
    role: "GN SL",
    text: "Exceptional service and unforgettable experiences! Highly recommend ZambiTour for anyone looking to create lifelong memories through travel.",
  },
  {
    name: "Lucas Thompson",
    role: "GN SL SN",
    text: "An exceptional travel company! ZambiTour exceeded our expectations in every way. Their professionalism, expertise, and commitment to customer satisfaction are truly commendable.",
  },
  {
    name: "Katty Perry",
    role: "SL",
    text: "ZambiTour made our dream vacation a reality. We couldn't have asked for a better travel experience. Can't wait to book our next adventure with them.",
  },
  {
    name: "Benjamin Carter",
    role: "GN SL",
    text: "Incredible customer service and attention to detail. ZambiTour truly goes above and beyond to ensure their clients have a memorable experience. Can't wait to travel with them again!",
  },
  {
    name: "Eva Williams",
    role: "SN SL",
    text: "Five stars all around! ZambiTour provided us with an unforgettable travel experience. Their attention to detail, personalized service, and passion for travel shine through in everything they do. We can't wait to book with them again!",
  },
  {
    name: "Jack Henry",
    role: "GN EH",
    text: "Our vacation with ZambiTour exceeded all expectations. From the luxurious accommodations to the unique excursions, every detail was carefully thought out. We felt like royalty the entire time!",
  },
];

export function Testimonials() {
  return (
    <div className="px-7 lg:px-28 pb-14 lg:pb-28 bg-beige">
      <h2 className="text-4xl md:text-5xl text-textdark text-center">What Our Clients Say</h2>
      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <div key={t.name} className="bg-white/50 border border-darkgray/40 p-8 flex flex-col gap-6 rounded-lg">
            <Stars />
            <p className="text-parablack text-sm leading-relaxed">
              &ldquo;{t.text}&rdquo;
            </p>
            <div className="flex items-center gap-4 mt-auto">
              <div className="w-10 h-10 rounded-full bg-shadow flex items-center justify-center text-leafy font-bold text-sm">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-textdark">{t.name}</p>
                <p className="text-xs text-darkgray">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
