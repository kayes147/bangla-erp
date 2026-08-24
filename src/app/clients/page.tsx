import Link from 'next/link';
import { Users, UserPlus } from "lucide-react";
import { getClients } from '@/actions/clientActions';
import ClientsList from './ClientsList';

export default async function Clients() {
  const { clients } = await getClients();

  return (
    <div className="max-w-6xl mx-auto space-y-6 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">মহাজন <span className="text-lg font-normal text-gray-500">(Suppliers)</span></h1>
            <p className="text-sm text-gray-500 mt-1">Manage profiles and login access for your suppliers.</p>
          </div>
        </div>
        <Link href="/clients/new" className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-sm text-sm">
          <UserPlus size={18} />
          <span>নতুন যোগ করুন <span className="text-[10px] font-normal opacity-80 uppercase">(Add New)</span></span>
        </Link>
      </div>

      <ClientsList initialClients={clients || []} />
    </div>
  );
}
