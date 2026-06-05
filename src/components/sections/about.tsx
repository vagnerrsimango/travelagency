import Image from "next/image";

export function About() {
  return (
    <div className="px-7 lg:px-28 pb-14 lg:pb-28 bg-lightbeige">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Left images */}
        <div className="relative overflow-hidden">
          <Image
            src="/images/desc1.jpg"
            alt="Travelers"
            width={800}
            height={1000}
            className="object-cover object-center w-full h-96 lg:w-[75%] lg:h-56"
          />
          <Image
            src="/images/desc2.jpg"
            alt="Travelers"
            width={800}
            height={1000}
            className="object-cover object-center w-36 h-36 absolute bottom-0 right-0 hidden lg:flex"
          />
        </div>

        {/* Center text */}
        <div className="lg:col-span-2 text-center">
          <h2 className="text-4xl md:text-5xl text-textdark leading-tight">
            Southern Africa&apos;s Trusted Travel Partner
          </h2>
          <p className="text-parablack text-lg py-6">
            At ZambiTour, we specialize in Southern Africa travel. With deep roots in the
            region, we offer expert knowledge of Zambia, Zimbabwe, South Africa, Mozambique,
            Botswana, and beyond — from booking flights and hotels to planning your perfect
            safari itinerary.
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="bg-orange/80 text-white hover:bg-orange transition-all duration-300 rounded-3xl px-6 py-3 uppercase text-sm cursor-pointer"
            >
              Read More
            </button>
          </div>
        </div>

        {/* Right images */}
        <div className="flex justify-end relative overflow-hidden">
          <Image
            src="/images/desc3.jpg"
            alt="Travelers"
            width={800}
            height={1000}
            className="object-cover object-center w-full h-96 lg:w-36 lg:h-36"
          />
          <Image
            src="/images/desc4.jpg"
            alt="Travelers"
            width={800}
            height={1000}
            className="object-cover object-center hidden lg:flex lg:w-[75%] lg:h-56 absolute left-0 bottom-0"
          />
        </div>
      </div>
    </div>
  );
}
