import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" legacyBehavior>
      <a className="block">
        <div className="sm:hidden">
          <Image src="/images/feelgoodreads_logo_small.png" alt="Feel Good Reads Logo" width={150} height={150} />
        </div>
        <div className="hidden sm:block md:hidden">
          <Image src="/images/feelgoodreads_logo_medium.png" alt="Feel Good Reads Logo" width={300} height={300} />
        </div>
        <div className="hidden md:block">
          <Image src="/images/feelgoodreads_logo_large.png" alt="Feel Good Reads Logo" width={600} height={600} />
        </div>
      </a>
    </Link>
  );
};

export default Logo;
