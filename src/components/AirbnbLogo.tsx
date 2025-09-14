import Image from "next/image";

export default function AirbnbLogo({ className = "h-12 w-auto" }) {
  return (
    <Image
      src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg"
      alt="Airbnb logo"
      width={160}     
      height={160}   
      priority
      className={className}
      unoptimized    
    />
  );
}
