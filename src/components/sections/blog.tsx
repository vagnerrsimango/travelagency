import Image from "next/image";
import type { Dictionary } from "@/i18n/types";

type BlogProps = {
  copy: Dictionary["sections"]["blog"];
};

export function Blog({ copy }: BlogProps) {
  return (
    <div className="px-7 lg:px-28 pb-14 lg:pb-28 bg-beige">
      <div className="mb-10">
        <h2 className="text-4xl md:text-5xl text-textdark">{copy.title}</h2>
        <p className="text-parablack text-lg mt-4 max-w-xl">
          {copy.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {copy.posts.map((post) => (
          <div key={post.slug} className="cursor-pointer">
            <div className="relative h-72 rounded-xl overflow-hidden group">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h3 className="text-lg font-semibold leading-tight text-orange mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-shadow overflow-hidden">
                    <Image src="/images/avatar.jpg" alt={post.author} width={32} height={32} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{post.author}</p>
                    <p className="text-xs text-white/70">{post.date}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
