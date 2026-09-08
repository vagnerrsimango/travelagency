import Image from "next/image";
import type { Dictionary } from "@/i18n/types";

type PaymentProps = {
  copy: Dictionary["sections"]["payment"];
};

const MpesaIcon = () => (
  <Image src="/images/m-pesa.jpg" alt="M-Pesa" width={96} height={40} className="h-8 w-auto object-contain" />
);

const EMolaIcon = () => (
  <Image src="/images/e-mola.png" alt="e-Mola" width={96} height={40} className="h-8 w-auto object-contain" />
);

const paymentIcons = {
  mpesa: MpesaIcon,
  emola: EMolaIcon,
};

export function Payment({ copy }: PaymentProps) {
  return (
    <div className="bg-beige px-7 lg:px-28 py-14 lg:py-24">
      <div className="max-w-4xl mx-auto bg-white border border-darkgray/20 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Left: explanation */}
          <div className="p-8 lg:p-10 border-b sm:border-b-0 sm:border-r border-darkgray/15">
            <h2 className="text-3xl md:text-4xl text-textdark leading-tight">
              {copy.title} <span className="italic">{copy.titleAccent}</span>
            </h2>
            <p className="text-parablack mt-3 mb-6 leading-relaxed">{copy.description}</p>

            <div className="flex items-center gap-2 mb-6">
              {copy.steps.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-orange/10 text-orange rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide">
                    <span className="w-4 h-4 rounded-full bg-orange text-white flex items-center justify-center text-[10px]">{i + 1}</span>
                    {step}
                  </span>
                  {i < copy.steps.length - 1 && <span className="text-darkgray/50 text-xs">&rarr;</span>}
                </div>
              ))}
            </div>

            <p className="text-parablack text-xs leading-relaxed">
              <span className="font-semibold text-leafy">{copy.secureTitle}.</span> {copy.secureDescription}
            </p>
          </div>

          {/* Right: payment methods */}
          <div className="p-8 lg:p-10 bg-lightbeige/60">
            <p className="text-xs uppercase tracking-widest text-darkgray mb-4">{copy.acceptedMethods}</p>
            <div className="flex flex-col gap-3">
              {copy.methods.map((method) => {
                const Icon = paymentIcons[method.id as keyof typeof paymentIcons];

                return (
                  <div
                    key={method.id}
                    className="bg-white border border-darkgray/20 rounded-xl p-4 flex items-center gap-4"
                  >
                    <Icon />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-textdark text-sm">{method.name}</p>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                        <span className="text-[10px] text-darkgray uppercase tracking-wide">{copy.available}</span>
                      </div>
                      <p className="text-xs text-parablack mt-0.5">{method.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
