import React from 'react';
import { InvitationData } from '../../types';

interface Props {
  data: InvitationData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleThemeChange: (key: string, value: string) => void;
  handleImageChange: (key: string, value: string) => void;
}

export default function EditorSidebar({ data, handleChange, handleThemeChange, handleImageChange }: Props) {
  return (
    <div className="w-full lg:w-1/3 bg-white border-r border-gray-200 overflow-y-auto h-[calc(100vh-4rem)]">
      <div className="p-6 space-y-8">
        {/* We will move the form sections here */}
        <p>Editor Sidebar Placeholder</p>
      </div>
    </div>
  );
}
