import { Home, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React from 'react';

interface BottomNavigationProps {
  activeTab: 'home' | 'history' | 'user';
  onTabChange: (tab: 'home' | 'history' | 'user') => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (activeTab === 'home') {
      navigate('/home', { replace: true });
    } else if (activeTab === 'history') {
      navigate('/history', { replace: true });
    } else if (activeTab === 'user') {
      navigate('/user', { replace: true });
    }
  }, [activeTab, navigate]);
  const tabs = [
    {
      id: 'home' as const,
      label: 'Home',
      icon: Home
    },
    {
      id: 'history' as const,
      label: 'History',
      icon: Clock
    },
    {
      id: 'user' as const,
      label: 'User',
      icon: User
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="max-w-md mx-auto">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-3 px-2 transition-colors ${
                  isActive 
                    ? 'text-primary bg-accent/50' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-primary' : ''}`} />
                <span className="text-xs">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}