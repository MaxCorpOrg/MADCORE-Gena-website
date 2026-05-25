import Image from "next/image";

export default function MadcoreWordmark() {
  return (
    <div className="madcore-wordmark" role="img" aria-label="MADCORE 2.0">
      <Image
        src="/images/madcore-logo-metallic-v3.png"
        alt=""
        aria-hidden="true"
        width={2079}
        height={384}
        sizes="(min-width: 1024px) 36rem, (min-width: 640px) 32rem, calc(100vw - 2rem)"
        className="madcore-wordmark-image"
      />
    </div>
  );
}
