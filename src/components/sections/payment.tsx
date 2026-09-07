import Image from "next/image";
import type { Dictionary } from "@/i18n/types";

type PaymentProps = {
  copy: Dictionary["sections"]["payment"];
};

const MpesaIcon = () => (
  <Image src="/images/m-pesa.jpg" alt="M-Pesa" width={96} height={40} className="h-9 w-auto object-contain" />
);

const EMolaIcon = () => (
  <Image src="/images/e-mola.png" alt="e-Mola" width={96} height={40} className="h-9 w-auto object-contain" />
);

const BankIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 text-leafy">
    <path d="M11.5 1L2 6v2h19V6m-5 4v7h3v-7M2 20v2h19v-2m-9-4v7h3v-7M7 10v7h3v-7H7z" />
  </svg>
);

const paymentIcons = {
  mpesa: MpesaIcon,
  emola: EMolaIcon,
  bank: BankIcon,
};

export function Payment({ copy }: PaymentProps) {
  return (
    <div className="bg-beige px-7 lg:px-28 py-14 lg:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: explanation */}
        <div>
          <h2 className="text-4xl md:text-5xl text-textdark leading-tight">
            {copy.title} <span className="italic">{copy.titleAccent}</span>
          </h2>
          <p className="text-parablack text-lg mt-6 mb-8 leading-relaxed">
            {copy.description}
          </p>
          <ul className="flex flex-col gap-4">
            {copy.steps.map((step, i) => (
              <li key={step} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-orange/10 text-orange flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                <span className="text-parablack">{step}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 bg-leafy/10 border border-leafy/30 rounded-xl p-5">
            <p className="text-parablack text-sm leading-relaxed">
              <span className="font-semibold text-leafy">{copy.secureTitle}</span> — {copy.secureDescription}
            </p>
          </div>
        </div>

        {/* Right: payment method cards */}
        <div>
          <p className="text-sm uppercase tracking-widest text-darkgray mb-6">{copy.acceptedMethods}</p>
          <div className="grid grid-cols-2 gap-5">
            {copy.methods.map((method) => {
              const Icon = paymentIcons[method.id as keyof typeof paymentIcons];

              return (
                <div
                  key={method.id}
                  className="bg-white border border-darkgray/30 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="h-10 flex items-center">
                    <Icon />
                  </div>
                  <div>
                    <p className="font-semibold text-textdark">{method.name}</p>
                    <p className="text-sm text-parablack mt-1">{method.description}</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 mt-auto">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-darkgray">{copy.available}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
