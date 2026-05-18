import Image from "next/image";

export default function MadcoreWordmark() {
  return (
    <div className="madcore-wordmark" role="img" aria-label="MADCORE Gena">
      <Image
        src="/images/madcore-wordmark-gena-silver.svg"
        alt=""
        aria-hidden="true"
        width={1940}
        height={375}
        priority
        className="madcore-wordmark-image"
      />
    </div>
  );
}
