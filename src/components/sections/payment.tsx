import Image from "next/image";

const MpesaIcon = () => (
  <Image src="/images/m-pesa.jpg" alt="M-Pesa" width={96} height={40} className="h-9 w-auto object-contain" />
);

const EMolaIcon = () => (
  <Image src="/images/e-mola.png" alt="e-Mola" width={96} height={40} className="h-9 w-auto object-contain" />
);

const VisaIcon = () => (
  <Image src="/images/visa.png" alt="Visa" width={96} height={36} className="h-8 w-auto object-contain" />
);

const BankIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 text-leafy">
    <path d="M11.5 1L2 6v2h19V6m-5 4v7h3v-7M2 20v2h19v-2m-9-4v7h3v-7M7 10v7h3v-7H7z" />
  </svg>
);

const methods = [
  {
    id: "mpesa",
    name: "M-Pesa",
    desc: "Pay instantly via Vodacom M-Pesa mobile money.",
    Icon: MpesaIcon,
  },
  {
    id: "emola",
    name: "e-Mola",
    desc: "Secure mobile payment through BCI e-Mola.",
    Icon: EMolaIcon,
  },
  {
    id: "visa",
    name: "Visa",
    desc: "Pay with your Visa credit or debit card.",
    Icon: VisaIcon,
  },
  {
    id: "bank",
    name: "Bank Transfer",
    desc: "Direct bank transfer in MZN, USD or ZAR.",
    Icon: BankIcon,
  },
];

const paymentSteps = [
  { label: "Complete the booking form" },
  { label: "Receive our confirmation & invoice" },
  { label: "Pay via your preferred method" },
  { label: "Get your booking documents" },
];

export function Payment() {
  return (
    <div className="bg-beige px-7 lg:px-28 py-14 lg:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: explanation */}
        <div>
          <h2 className="text-4xl md:text-5xl text-textdark leading-tight">
            Secure <span className="italic">Online Payment</span>
          </h2>
          <p className="text-parablack text-lg mt-6 mb-8 leading-relaxed">
            Payment is only required after you receive booking confirmation from our team. We support
            multiple payment methods so you can pay the way that works best for you.
          </p>
          <ul className="flex flex-col gap-4">
            {paymentSteps.map((step, i) => (
              <li key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-orange/10 text-orange flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                <span className="text-parablack">{step.label}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 bg-leafy/10 border border-leafy/30 rounded-xl p-5">
            <p className="text-parablack text-sm leading-relaxed">
              <span className="font-semibold text-leafy">Secure & protected</span> — All transactions are processed
              through verified payment channels. Your financial data is never stored on our servers.
            </p>
          </div>
        </div>

        {/* Right: payment method cards */}
        <div>
          <p className="text-sm uppercase tracking-widest text-darkgray mb-6">Accepted Payment Methods</p>
          <div className="grid grid-cols-2 gap-5">
            {methods.map((method) => (
              <div
                key={method.id}
                className="bg-white border border-darkgray/30 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="h-10 flex items-center">
                  <method.Icon />
                </div>
                <div>
                  <p className="font-semibold text-textdark">{method.name}</p>
                  <p className="text-sm text-parablack mt-1">{method.desc}</p>
                </div>
                <div className="inline-flex items-center gap-1.5 mt-auto">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-darkgray">Available</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
