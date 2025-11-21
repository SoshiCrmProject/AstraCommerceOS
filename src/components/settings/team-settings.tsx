/**
 * Team Settings Tab
 */

'use client';

import type { TeamMember } from '@/lib/services/settings-types';
import { UserPlus, Mail, Trash2 } from 'lucide-react';

type TeamSettingsProps = {
  members: TeamMember[];
  dict: any;
};

export function TeamSettings({ members, dict }: TeamSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{dict.team.title}</h2>
          <p className="text-sm text-gray-600 mt-1">{dict.team.subtitle}</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
          <UserPlus className="w-4 h-4" />
          {dict.team.inviteMember}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{dict.team.name}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{dict.team.email}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{dict.team.role}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{dict.team.status}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{dict.team.joinedAt}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{dict.team.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{member.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{member.email}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                    {dict.team.roles[member.role]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    member.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                    member.status === 'INVITED' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {dict.team.statuses[member.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : '-'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {member.status === 'INVITED' && (
                      <button className="text-blue-600 hover:text-blue-700 text-xs font-medium" title={dict.team.resendInvite}>
                        <Mail className="w-4 h-4" />
                      </button>
                    )}
                    {member.role !== 'OWNER' && (
                      <button className="text-red-600 hover:text-red-700 text-xs font-medium" title={dict.team.removeMember}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
