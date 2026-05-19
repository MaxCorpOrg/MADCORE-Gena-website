import Image from "next/image";

export default function MadcoreWordmark() {
  return (
    <div className="madcore-wordmark" role="img" aria-label="MADCORE 2.0">
      <Image
        src="/images/madcore-logo-ai-gold-transparent.png"
        alt=""
        aria-hidden="true"
        width={1940}
        height={376}
        priority
        className="madcore-wordmark-image"
      />
    </div>
  );
}
