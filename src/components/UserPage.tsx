import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { User, Settings, Bell, Shield, LogOut, Moon } from 'lucide-react';
import { useState } from 'react';
import { api } from '../util/api';
import LoadingPage from './LoadingPage';
import { ErrorPage } from './ErrorPage';

interface UserData {
  name: string;
  id: string;
  status: string;
  email?: string;
  phone?: string;
  joinDate?: string;
}

interface UserPageProps {
  userData: UserData;
  onLogout?: () => void;
}

export function UserPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const userData: UserData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const onLogout = async () => {
    setIsLoading(true);
    try {
      console.log(`Bearer ${localStorage.getItem('access_token')}`);
      await api.post('/logout', {}, {
        headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
      })
    } catch (e: any) {
      if (!e.status){
        setError('There is error with the server');
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("device_id");
        localStorage.removeItem("user_data");
        window.location.reload();
        setError(e.response.data.message);
      }
      setIsLoading(false);
      return;
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("device_id");
    localStorage.removeItem("user_data");
    setIsLoading(false);
    window.location.reload();
  };

  if(error != '') {
    return (
      <ErrorPage onRetry={onLogout} errorType={'server'} errorMessage={error} />
    );
  }

  return (
    <div className="space-y-4">
      { isLoading && <LoadingPage/> }
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5" />
        <h2>Profil User</h2>
      </div>

      {/* User Profile Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informasi Profil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Nama:</span>
            <span>{userData?.name}</span>
          </div>
          {/* <div className="flex justify-between items-center">
            <span className="text-muted-foreground">User ID:</span>
            <span>{userData?.id}</span>
          </div> */}
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Email:</span>
            <span>{userData?.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Phone:</span>
            <span>tes</span>
          </div>
          {/* <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              tes
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Bergabung:</span>
            <span>tes</span>
          </div> */}
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Pengaturan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifikasi
            </Label>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="flex items-center gap-2">
              <Moon className="w-4 h-4" />
              Mode Gelap
            </Label>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Statistik Penggunaan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Operasi:</span>
            <span>127</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Waktu Total:</span>
            <span>45h 32m</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Rata-rata Temp:</span>
            <span>29.3°C</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Operasi Bulan Ini:</span>
            <span>23</span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Aksi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Settings className="w-4 h-4 mr-2" />
            Edit Profil
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Shield className="w-4 h-4 mr-2" />
            Ubah Password
          </Button>
          <Button 
            variant="destructive" 
            className="w-full justify-start"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}