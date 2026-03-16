import { Menu } from 'lucide-react';
import { useStore } from '../../store/useStore';

export function Header() {
  const { toggleSidebar } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 h-14">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
        
        <div className="flex-1 lg:hidden" />
      </div>
    </header>
  );
}
