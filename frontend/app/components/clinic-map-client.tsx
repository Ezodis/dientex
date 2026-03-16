'use client';

import dynamic from 'next/dynamic';

const ClinicMap = dynamic(() => import('@/app/components/clinic-map'), { ssr: false });

export default function ClinicMapClient() {
  return <div className="h-full"><ClinicMap /></div>;
}
