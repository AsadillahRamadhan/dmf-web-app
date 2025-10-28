import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { LogIn, Eye, EyeOff, User, Lock } from 'lucide-react';
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { api } from '../util/api';


interface LoginFormProps {
  onLogin: (userData: any) => void;
  onSwitchToRegister: () => void;
}

export function LoginForm() {
  const navigate = useNavigate();
  
  const onSwitchToRegister = () => {
    navigate("/register", { replace: true });
  }
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isChooseDevice, setIsChooseDevice] = useState(false);
  const [devices, setDevices] = useState([]);
  const [loginCredentials, setLoginCredentials] = useState({data: {token: {token: ''}}});
  const [currentUser, setCurrentUser] = useState({data: {user: {}}});
  const [selectValue, setSelectValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.username || !formData.password) {
      setError('Harap isi semua field');
      setIsLoading(false);
      return;
    }

    let result: any;
    try {
      result = await api.post('/login', formData)
      setLoginCredentials(result);
    } catch (e: any) {
      if (!e.status){
        setError('There is error with the server');
      } else {
        setError(e.response.data.message);
      }
      setIsLoading(false);
      return;
    }

    try {
      setCurrentUser(await api.get('/current-user', {
        headers: {
          'Authorization': `Bearer ${result.data.token.token}`
        }
      }));
    } catch (e: any) {
      if (!e.status){
        setError('There is error with the server');
      } else {
        setError(e.response.data.message);
      }
      setIsLoading(false);
      return;
    }

    let deviceRes: any;
    try {
      deviceRes = await api.get(`/devices`, {headers: {
        'Authorization': `Bearer ${result.data.token.token}`
      }});
      setDevices(deviceRes.data.data.data);
    } catch (e: any) {
      if (!e.status){
        setError('There is error with the server');
      } else {
        setError(e.response.data.message);
      }
      setIsLoading(false);
      return;
    }
    setIsChooseDevice(true);
    setIsLoading(false);
  };

  const handleSelectDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if(selectValue == ""){
      setIsLoading(false);
      setError('The device not selected!');
      return;
    }

    let device: any;
    try {
       device = await api.get(`/devices/${selectValue}`, {headers: {
        'Authorization': `Bearer ${loginCredentials.data.token.token}`
      }});
    } catch (e: any) {
      if (!e.status){
        setError('There is error with the server');
      } else {
        setError(e.response.data.message);
      }
      setIsLoading(false);
      return;
    }

    try {
      await api.post(`/use-device`, { id: selectValue }, {headers: {
        'Authorization': `Bearer ${loginCredentials.data.token.token}`
      }});
    } catch (e: any) {
      if (!e.status){
        setError('There is error with the server');
      } else {
        setError(e.response.data.message);
      }
      setIsLoading(false);
      return;
    }

    localStorage.setItem('user_data', JSON.stringify(currentUser.data.user));
    localStorage.setItem('access_token', loginCredentials.data.token.token);
    localStorage.setItem('device_id', device.data.data.id);

    navigate("/home", { replace: true });
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="mb-2">Selamat Datang</h1>
          <p className="text-muted-foreground">Masuk ke akun Anda untuk melanjutkan</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <LogIn className="w-5 h-5" />
              Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={!isChooseDevice ? handleSubmit : handleSelectDevice } className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <Input
                    id="username"
                    name="username"
                    type="username"
                    placeholder="Masukkan username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="pl-10"
                    disabled={isLoading}
                  />
                  <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              
              { isChooseDevice && (
                <div className="space-y-2">
                  <Label htmlFor="device">Select Device</Label>
                  <Select
                    name="device"
                    value={selectValue}
                    onValueChange={setSelectValue}
                  >
                    <SelectTrigger id="device" className="w-full">
                      <SelectValue placeholder="Please select the device" />
                    </SelectTrigger>
                    <SelectContent>
                      {devices.map((device: any) => (
                        <SelectItem key={device.id} value={`${device.id}`}>
                          {device.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Memproses...' : 'Masuk'}
              </Button>
            </form>

            <Separator className="my-6" />

            {/* <div className="text-center space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setError('Fitur lupa password belum tersedia, silahkan hubungi admin.')}
                disabled={isLoading}
              >
                Lupa Password?
              </Button>

              <div className="text-sm text-muted-foreground">
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-primary hover:underline"
                  disabled={isLoading}
                >
                  Daftar sekarang
                </button>
              </div>
            </div> */}
          </CardContent>
        </Card>

        {/* Demo credentials */}
        {/* <Card className="mt-4 bg-accent/30">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground text-center mb-2">
              Demo: Gunakan username dan password apapun untuk login
            </p>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}